import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, DocumentReference, getFirestore, query, getDocs, deleteDoc } from "firebase/firestore";
import FirebaseDocument from "./firestore-ref";
import {SubscriberObject} from "./data-model"
import {faker} from "@faker-js/faker"

export default async function testFirebase(){
    const auth = getAuth()
    const db = getFirestore()
    await signInWithEmailAndPassword(auth, "test@gmail.com", "password")
    await clear()
    const uid = getAuth().currentUser?.uid || ""
    const pRef = doc(collection(db, "profiles"))
    const sRef = doc(collection(db, "stakes"))
    try{
        await newProfile(pRef)
        await newStake(sRef)
        await subscribeTest(sRef, pRef, uid)
        await updateDeps(pRef)
        return "true" 
    } catch(err) {
        console.error(err)
        return "false"
    }
    
    

}


function newProfile(profileRef:DocumentReference){
    const name = {first: faker.name.firstName(), last: faker.name.lastName(), display: ''}
    name.display = `${name.first} ${name.last}`
    const profileDoc = FirebaseDocument.build(profileRef, {
        name
    })
    return profileDoc.save()
}

function newStake(stakeRef:DocumentReference){
    const user = getAuth().currentUser
    if(!user) return 
    const uid = user.uid 
    const stakeDoc = FirebaseDocument.build(stakeRef, {
        name: faker.address.streetName(),
        roles: {
            [uid]:{
                role: 'president'
            }
        }
    })
    return stakeDoc.save()
}

function subscribeTest(stakeRef:DocumentReference, profileRef:DocumentReference,uid:string){
    
    const subObj: Omit<SubscriberObject, "documentPath"> = {
        attributePath: "attributes.name.display",
        destinationPath: "attributes.roles." +uid+".name"
    }
    return FirebaseDocument.subscriptionTransaction(profileRef, stakeRef, subObj)
}

async function updateDeps(profileRef:DocumentReference){
    const profile = await FirebaseDocument.retrieve(profileRef)
    if(profile === null) throw new Error("Profile aint there")
    profile.data.attributes.name.display = "Hello World"
    await profile.save()
}


async function clear(){
    const cs = ["profiles", "stakes"]
    return Promise.all(cs.map(async str => {
        const q = query(collection(getFirestore(), str))
        const snap = await getDocs(q)
        snap.forEach(doc => deleteDoc(doc.ref))
    }))
}