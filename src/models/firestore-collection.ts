import { CollectionReference, doc, getDocs, getFirestore, query, QueryConstraint, writeBatch } from "firebase/firestore";
import DocumentDataModel, { Attributes } from "./data-model";
import FirebaseDocument from "./firestore-ref";

export default class FirebaseCollection{
    ref: CollectionReference
    docs: FirebaseDocument[] = [] 
    async query(...contraints:QueryConstraint[]){
        const q = query(this.ref, ...contraints)
        const snap = await getDocs(q)
        this.docs = snap.docs.map(doc => {
            const data = DocumentDataModel.build(doc.data())
            return new FirebaseDocument(doc.ref, data)
        })
        return this.docs 
    }
    get count():number{
        return this.docs.length
    }
    get empty(){
        return this.count === 0
    }
    retrieve(...contraints:QueryConstraint[]){
        return this.query(...contraints)
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
    /**
     * 
     * @param predicate An optional filter function to filter out which documents to save
     */
    save(predicate?: (value: FirebaseDocument, index: number, array: FirebaseDocument[]) => value is FirebaseDocument){
        const docs = predicate ? this.docs.filter(predicate) : this.docs 
        const proms = docs.map(doc => doc.save())
        return Promise.all(proms)
    }
    async destroyAll(){
        await this.retrieve()
        const b = writeBatch(getFirestore())
        this.docs.forEach(doc => {
           b.delete(doc.ref)
        })
        return b.commit()
    }
    constructor(collectionRef:CollectionReference){
        this.ref = collectionRef
    }

}