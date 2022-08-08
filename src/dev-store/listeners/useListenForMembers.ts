import { collection, collectionGroup, getFirestore, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GlobalState } from ".."
import { Member } from "../../schema"
import { Member as MemberType, memberActions } from "../members"

export const useListenForMembers = () => {
    const assignedUnit = useSelector((s:GlobalState) => s.ui.homeUnit)
    const members = useSelector((s:GlobalState) => s.members)
    const memberIds = Object.keys(members)
    const dispatch = useDispatch()

    useEffect(()=> {
       const q = query( collection(getFirestore(), 'members'), where('unit.id', "==", assignedUnit)) 
       return onSnapshot((q), (snap)=> {
            if(snap.empty) return dispatch(memberActions.reset())
            const membersObj:{[id:string]: MemberType} ={}
            const members = snap.docs.reduce((obj, doc) => {
                const data = doc.data() as Member
                const o:MemberType = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    loading: true, 
                    calling: null, 
                    stake: data.unit.parent.id, 
                    ward: data.unit.id, 
                    recommend: false,  
                    reportTo: [],
                    activity: 'active'
                }
                return {...obj, [doc.id]: o}
            }, membersObj)
            dispatch(memberActions.updateMembers(members))
       })
    }, [assignedUnit])
}