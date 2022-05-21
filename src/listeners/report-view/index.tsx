import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore"
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react"
import DocumentDataModel from "../../models/data-model"
import FirebaseDocument from "../../models/firebase-document"

const Context = createContext<any>(undefined)
export default function ReportListener(props:PropsWithChildren<{}>){
    const [currentStake, setStake] = useState<null | FirebaseDocument>(null)
    const [myMembers, setMembers] = useState<any[]>([])
    const [theirMembers, setTheirMembers] = useState<any[]>([])
    const [uid, setUid] = useState<any>(null)
    const stakes = useMemo(()=>{
        const stakes:any = {}
        myMembers.forEach((doc)=>{
            const id = doc.data.attributes.foreignStake.id
            const obj = doc.data.attributes.foreignStake
            stakes[id] = obj 
        })
        theirMembers.forEach((doc)=>{
            const id = doc.data.attributes.homeStake.id
            const obj = doc.data.attributes.homeStake
            stakes[id] = obj 
        })
        return stakes
    }, [myMembers.length, theirMembers.length])


    // useEffect(()=>{
    //     return onAuthStateChanged(getAuth(), (u)=>{
    //         if(u) setUid(u.uid)
    //         else setUid(null)
    //     })
    // },[])

    // useEffect(()=>{
    //     if(!uid) return 
    //     const db = getFirestore()
    //     const stakes = collection(db, "stakes")
    //     const q = query(stakes, where(`permissions.${uid}`,"!=", false ))
    //     return onSnapshot(q, (snap)=>{
            
    //         if(!snap.empty) {
    //             const data = DocumentDataModel.build(snap.docs[0].data())
    //             const doc = new FirebaseDocument(snap.docs[0].ref, data)
    //             setStake(doc)
    //         } else {
    //             setStake(null)
    //         }
    //     })
    // },[uid])

    // useEffect(()=>{
    //     const id = currentStake?.ref?.id 
    //     if(!id) return 
    //     const db = getFirestore()
    //     const stakes = collection(db, "member-subscriptions")
    //     const q = query(stakes, where(`attributes.homeStake.id`,"==", id))
    //     return onSnapshot(q,(snap)=>{
    //         if(!snap.empty) {
    //             const docs = snap.docs.map(doc => {
    //                 const data = DocumentDataModel.build(doc.data())
    //                 return new FirebaseDocument(doc.ref, data)
    //             })
    //             setMembers(docs)
    //         } else {
    //             setMembers([])
    //         }
    //     })
    // }, [currentStake?.ref?.id])

    // useEffect(()=>{
    //     const id = currentStake?.ref?.id 
    //     if(!id) return 
    //     const db = getFirestore()
    //     const stakes = collection(db, "member-subscriptions")
    //     const q = query(stakes, where(`attributes.foreignStake.id`,"==", id))
    //     return onSnapshot(q,(snap)=>{
    //         if(!snap.empty) {
    //             const docs = snap.docs.map(doc => {
    //                 const data = DocumentDataModel.build(doc.data())
    //                 return new FirebaseDocument(doc.ref, data)
    //             })
    //             setTheirMembers(docs)
    //         } else {
    //             setTheirMembers([])
    //         }
    //     })
    // }, [currentStake?.ref?.id])

    return (
        <Context.Provider value={{current: currentStake, myMembers, theirMembers, stakes}}>
            {props.children}
        </Context.Provider>
    )
}

export function useReportContext(){
    return useContext(Context)
}