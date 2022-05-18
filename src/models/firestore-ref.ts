import { getAuth } from "firebase/auth";
import { CollectionReference, doc, DocumentReference, Firestore, getDoc, getFirestore, runTransaction, serverTimestamp, Transaction, writeBatch, WriteBatch } from "firebase/firestore";
import DocumentDataModel, { Attributes, SubscriberObject } from "./data-model";
import FirebaseCollection from "./firestore-collection";

export default class FirebaseDocument{
    static async subscriptionTransaction(provider:DocumentReference, subscriber:DocumentReference, subObject: Omit<SubscriberObject, "documentPath">){
        return runTransaction(getFirestore(), async(t) => {
            const currentUser = getAuth().currentUser 
            if(!currentUser) throw new Error("Must have a signed in user")
            const uid = currentUser.uid 
            const p = await t.get(provider)
            if(!p.exists) throw new Error("Provider document does not exist")
            const s = await t.get(subscriber)
            if(!s.exists) throw new Error("Subscriber document does not exist")

            const providerValue = p.get(subObject.attributePath)
            if(!providerValue) throw new Error("No value found at attributePath")

            const currentSubscibers = p.get("subscribers") || []

            const subscriptionUpdate = {
                [subObject.destinationPath]: {referencePath: provider.path, data: providerValue},
                "meta.updatedOn": serverTimestamp(),
                "meta.updatedBy": uid
            }
            t.update(subscriber, subscriptionUpdate)

            const providerUpdate = {subscribers: [...currentSubscibers, {...subObject, documentPath: subscriber.path}]}
            t.update(provider, providerUpdate)

        })
    }
    static build(ref:DocumentReference, attributes:Attributes){
        const model = new DocumentDataModel(attributes)
        return new this(ref, model)
    }
    static async retrieve(ref:DocumentReference){
        const document = await getDoc(ref)
        if(document.exists()){
            return new this(ref, document.data() as DocumentDataModel)
        }
        return null 
    }
    db:Firestore
    ref:DocumentReference
    data:DocumentDataModel
    subcollections: {[collectionId: string]: FirebaseCollection} = {}

    refresh(){
        return FirebaseDocument.retrieve(this.ref)
    }
    userPermission(uid?:string){
        let u = uid 
        if(!uid) {u = getAuth().currentUser?.uid}
        if(u === undefined) return null 
        return this.data.permissions[u] || null
    }
    async save(){
        const currentUser = getAuth().currentUser
        if(currentUser === null) throw new Error("User must be signed in in order to save document")
        const uid = currentUser.uid 
        if(this.userPermission() === null) throw new Error("Access denied, user does not have sufficent access")
        const data = this.data.toObj()
        await runTransaction(this.db, async (t) => {
            await this.saveDependencies(t, uid)
            t.set(this.ref, data)
        })
    }

    async saveDependencies(writer:Transaction, uid:string){
        const taskList:SubscriberObject[] = []
        this.data.subscribers.forEach((docSub)=>{
            docSub.forEach(async sub => {
                const subSnap = await writer.get(doc(this.db, sub.documentPath))
                const value = this.data.fromDotNotation(sub.attributePath)
                if(subSnap.get(`${sub.destinationPath}.data`) !== value) taskList.push(sub)
            })
        })
        taskList.forEach((task) => {
            const data = this.data.fromDotNotation(task.attributePath)
            const value = {referencePath: this.ref.path, data}
            writer.update(doc(this.db, task.documentPath), {
                [`${task.destinationPath}`]: value,
                "meta.updatedOn": serverTimestamp(),
                "meta.updatedBy": uid
            })
        })
    }


    subscribeTo(provider:DocumentReference, subObj: Omit<SubscriberObject, "documentPath">){
        return FirebaseDocument.subscriptionTransaction(provider, this.ref, subObj)
    }
    provideFor(subscriber:DocumentReference, subObj: Omit<SubscriberObject, "documentPath">){
        return FirebaseDocument.subscriptionTransaction(this.ref, subscriber, subObj)
    }

    constructor(ref:DocumentReference, data: DocumentDataModel){
        this.ref = ref
        this.data = data 
        this.db = getFirestore()
    }
}


export function isCollectionRef(x:any): x is CollectionReference{
    const {id, path, parent,  firestore} = x 
    if([id, path, parent, firestore].every(x => !!x)) return true 
    return false 
}

export function isWriteBatch(x:any): x is WriteBatch{
    return !!x.commit
}