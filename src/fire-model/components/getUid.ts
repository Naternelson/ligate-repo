import { getAuth } from "firebase/auth";

export function getUid(){
    const auth = getAuth()
    if(auth.currentUser) return auth.currentUser.uid
    else return null 
}