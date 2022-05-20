import { getAuth } from "firebase/auth";
import { collection, DocumentReference, getFirestore } from "firebase/firestore";
import DocumentDataModel, { Attributes, SubscriberObject, DataModel } from "./data-model";
import FirebaseCollection from "./firestore-collection";

export default class FirebaseDocument{
    static createSubscription(provider: FirebaseDocument, subscriber: FirebaseDocument, params: Omit<SubscriberObject, "documentPath"> ){
        const providerValue = provider.data.fromDotNotation(params.attributePath)
        if(!providerValue) throw new Error("No value found at attributePath")

        const currentSubscibers = (provider.data.fromDotNotation("subscribers") || []) as SubscriberObject[]
        const subUpdate =  {[params.destinationPath]: {referencePath: provider.ref.path, data: providerValue}}
        const proUpdata = {"subscribers": [...currentSubscibers, {...params, documentPath: subscriber.ref.path}]}

        subscriber.data.update(subUpdate)
        provider.data.update(proUpdata)
        return [provider, subscriber]
    }
    static unsubscribe(provider: FirebaseDocument, subscriber:FirebaseDocument, params:SubscriberObject){
        const index = provider.data.subscribers.findIndex( el => {
            let match = true 
            if(el.attributePath !== params.attributePath) match = false 
            if(el.destinationPath !== params.destinationPath) match = false 
            if(el.documentPath !== params.destinationPath) match = false 
            return match 
        })
        if(index > -1) provider.data.subscribers.splice(index,1)
        subscriber.data.remove(params.destinationPath)
    }
    static build(ref:DocumentReference, attributes:Attributes, options?:Omit<Partial<DataModel>, "attributes">){
        const data:Partial<DataModel> = {attributes, ...(options||{})}
        const model = DocumentDataModel.build(data) 
        return new this(ref, model)
    }

    child(collectionId:string){
        this.data.addSubcollection(collectionId)
        const coll = collection(getFirestore(), this.ref.path, collectionId)
        return new FirebaseCollection(coll, this)
    }
    removeChild(collectionId:string){
        this.data.removeSubcollection(collectionId)
    }

    unsubscribeTo(provider:FirebaseDocument, params:SubscriberObject){
        return FirebaseDocument.unsubscribe(provider, this, params)
    }
    subscribeTo(provider:FirebaseDocument, params:SubscriberObject){
        return FirebaseDocument.createSubscription(provider, this, params)
    }
    accessRights(uid?:string){
        const userId = uid || getAuth().currentUser?.uid 
        if(!userId) return null 
        return this.data.permissions[userId]
    }
    data:DocumentDataModel
    ref: DocumentReference

    constructor(docRef: DocumentReference, data: DocumentDataModel){
        this.ref = docRef 
        this.data = data 
    }
}