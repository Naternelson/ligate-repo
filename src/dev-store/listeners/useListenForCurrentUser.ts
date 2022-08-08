import { getAuth } from "firebase/auth"
import { collection, getFirestore, limit, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { User } from "../../schema"

const useListenForCurrentUser = (): null | User => {
    const [user, setUser] = useState<null | User>(null)
    const uid = getAuth().currentUser?.uid

    useEffect(()=> {
        if(uid === undefined) return setUser(null)
        const q = query(collection(getFirestore(), 'users'), where('uid', '==', uid), limit(1))
        return onSnapshot(q, qS => {
            if(qS.empty) setUser(null)
            setUser(qS.docs[0].data() as User)
        })
    },[uid])
    
    return user 
}

export default useListenForCurrentUser