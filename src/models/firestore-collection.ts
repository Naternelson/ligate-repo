import { CollectionReference, doc, getDocs, getFirestore, query, QueryConstraint, writeBatch } from "firebase/firestore";
import DocumentDataModel, { Attributes } from "./data-model";
import FirebaseDocument from "./firebase-document";

export default class FirebaseCollection{
    ref: CollectionReference
    docs: FirebaseDocument[] = [] 
    parent:FirebaseDocument | null = null 
    get count():number{
        return this.docs.length
    }
    get empty(){
        return this.count === 0
    }
    build(attributes?:Attributes){
        const docRef = doc(this.ref) 
        return FirebaseDocument.build(docRef, attributes||{})
    }
    add(...docs: FirebaseDocument[]){
        const isCollection = docs.every(doc => doc.ref.id === this.ref.id)
        if(!isCollection) throw new Error("Document(s) are not in collection")
        this.docs = [...this.docs, ...docs]
        return this 
    }
    forEach(callbackfn: (value: FirebaseDocument, index: number, array: FirebaseDocument[]) => void){
        this.docs.forEach(callbackfn)
    }
    constructor(collectionRef:CollectionReference, parent?:FirebaseDocument){
        this.ref = collectionRef
        if(parent) this.parent = parent
    }

}