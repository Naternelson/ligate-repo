import { DocumentReference, getDoc } from "firebase/firestore";
import DocumentDataModel, { Attributes, DataModel } from "./data-model";
import FirebaseCollection from "./firestore-collection";

export default class FirebaseDocument{
    static build(ref:DocumentReference, attributes:Attributes){
        const model = new DocumentDataModel(attributes)
        return new this(ref, model)
    }
    static async retrieve(ref:DocumentReference){
        const document = await getDoc(ref)
        if(document.exists()){
            return new this(ref, document.data() as DataModel)
        }
        return null 
    }

    ref:DocumentReference
    data:DataModel
    subcollections: {[collectionId: string]: FirebaseCollection} = {}

    refresh(){
        return FirebaseDocument.retrieve(this.ref)
    }
    save(){

    }
    constructor(ref:DocumentReference, data: DataModel){
        this.ref = ref
        this.data = data 
    }
}
