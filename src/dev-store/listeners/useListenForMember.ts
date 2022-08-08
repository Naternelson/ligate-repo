import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Member } from "../../schema"
import { memberActions, Member as MemberType } from "../members"

export const useListenForMember = (id:string) => {
    const dispatch = useDispatch()

    // useEffect(()=> {
    //     const d = doc(getFirestore(), "members",id)
    //     return onSnapshot(d, document=>{
    //         if(!document.exists) return dispatch(memberActions.removeMembers([id]))
    //         const data = document.data() as Member 
    //         const storeData:MemberType = {
    //             firstName: data.firstName, 
    //             lastName: data.lastName, 
    //             stake: data.unit.parent.id,  
    //             ward: data.unit.id, 
    //             activity: 'active',
    //             calling: null, 
    //             loading: true, 

    //         }

    //     })
    // },[id])
}