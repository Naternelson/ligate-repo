import { doc, getFirestore, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Unit } from "../../schema"
import { unitActions } from "../units"
import useListenForCurrentUser from "./useListenForCurrentUser"



const useListenForAssignedUnit = () => {
    const [state, setState] = useState<null | Unit>(null)
    const dispatch = useDispatch()
    const user = useListenForCurrentUser()
    const unit = user?.unit
    useEffect(()=> {
        if(!unit) return setState(null)
        const d = doc(getFirestore(), "units", unit.id) 
        return onSnapshot(d, doc => {
            if(!doc.exists) return setState(null)
            setState(doc.data() as Unit)
            dispatch(unitActions.updateUnit({loading:false, ...doc.data(), id: doc.id}))
        })
    }, [unit])
    return state 
}

export default useListenForAssignedUnit