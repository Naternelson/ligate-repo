import { DocumentReference, getFirestore, runTransaction} from "firebase/firestore";
import DocumentDataModel, { DataModel } from "./data-model";
import FirebaseDocument from "./firebase-document";

interface CommitObject{
    set: {[id:string]: FirebaseDocument},
    delete?: {[id:string]: FirebaseDocument|DocumentReference }
}
interface FireDocs {
    [id:string]: FirebaseDocument
}
type CommitFn = (retrieved: FireDocs, toSet: FireDocs, toDelete: FireDocs) => CommitObject

export default class Writer{
    toSet: {[key:string]: FirebaseDocument} = {}
    toDelete:{[key:string]:FirebaseDocument} = {}
    toGet: {[key:string]:FirebaseDocument} = {}
    set(doc:FirebaseDocument){
        this.toSet[doc.ref.id] = doc 
    }
    update(doc:FirebaseDocument, updateObject: {[key:string]: unknown}){
        const id = doc.ref.id 
        if(id in this.toSet) this.toSet[id].data.update(updateObject)
        else {
            doc.data.update(updateObject)
            this.toSet[id] = doc 
        }
    }
    delete(doc:FirebaseDocument){
        const id = doc.ref.id 
        delete this.toSet[id]
        this.toDelete[id] = doc 
    }
    get(doc:FirebaseDocument){
        const id = doc.ref.id 
        this.toGet[id] = doc
    }
    async commit(commitFn?:CommitFn){
        await runTransaction(getFirestore(), async(t) => {
            let commitObj:CommitObject
            if(commitFn){
                const docs = await Promise.all(Object.values(this.toGet).map( async doc => {
                    const docRef = await t.get(doc.ref)
                    const data = docRef.data() as DataModel 
                    const fDoc = new FirebaseDocument(docRef.ref, DocumentDataModel.build(data))
                    return fDoc 
                }))
                const retrieved:FireDocs = docs.reduce((obj, doc) => ({...obj, [doc.ref.id]: doc}), {})
                commitObj = commitFn(retrieved, this.toSet, this.toDelete)
            } else {
                commitObj = {set:this.toSet, delete: this.toDelete}
            }
            if(commitObj.delete !== undefined) Object.values(commitObj.delete).forEach(doc => {
                if("ref" in doc) t.delete(doc.ref)
                else t.delete(doc) 
            })
            Object.values(commitObj.set).forEach(doc => {
                t.set(doc.ref, doc.data.toObj())
            })
        })
        return new Writer()
    }
    
    
}