import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, DocumentReference, getFirestore, query, getDocs, deleteDoc, collectionGroup } from "firebase/firestore";
import FirebaseDocument from "./firestore-ref";
import {SubscriberObject} from "./data-model"
import {faker} from "@faker-js/faker"
import FirebaseCollection from "./firestore-collection";



export default async function testFirebase(){
    const auth = getAuth()
    const db = getFirestore()
    await signInWithEmailAndPassword(auth, "test@gmail.com", "password")
    await clear()
    const uid = getAuth().currentUser?.uid || ""
    const pRef = doc(collection(db, "profiles"))
    const otherP = doc(collection(db, "profiles"))
    const sRef = doc(collection(getFirestore(), "stakes"))
    const otherStake = doc(collection(getFirestore(), "stakes"))
    try{
        await newProfile(pRef)
        await newProfile(otherP)
        await newStake(sRef)
        await newStake(otherStake)
        await subscribeTest(sRef, pRef, uid)
        await updateDeps(pRef)
        const wards = await createWards(sRef)
        await createMembers(sRef, wards)
        // await createMemberActvityRoom(sRef, otherStake)
        return "true" 
    } catch(err) {
        console.error(err)
        return "false"
    }
    
    

}

export async function activity(){
    const stakes = await getDocs(collection(getFirestore(), "stakes"))
    await  createMemberActvityRoom(stakes.docs[0].ref, stakes.docs[1].ref)
    await chatRooms()
}

async function chatRooms(){
    const profiles = await getDocs(collection(getFirestore(), "profiles"))
    const ref = doc(collection(getFirestore(), 'chat-rooms'))
    const room = FirebaseDocument.build(ref, {})
    await room.save()
    await FirebaseDocument.subscriptionTransaction(profiles.docs[0].ref, ref, {
        attributePath: "attributes",
        destinationPath: "attributes.profileA"
    })
    await FirebaseDocument.subscriptionTransaction(profiles.docs[1].ref, ref, {
        attributePath: "attributes",
        destinationPath: "attributes.profileB"
    })
    const chat = await room.buildChild("chats", {
        message: "Hey president, how are you?",
        priority: -1
    })
    await chat.save()
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
        type: 'YSA',
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

async function createWards(stakeRef:DocumentReference){
    const stake = await FirebaseDocument.retrieve(stakeRef)
    if(stake === null) throw new Error("Stake aint there")
    await stake.buildSubcollection("wards")
    return Promise.all(range(10).map(async index => {
        console.log(3,index)
        const ward = await stake.buildChild("wards", {
            name: faker.address.streetName() + " YSA Ward",
            type: "YSA",
            address: {
                street: faker.address.streetAddress(),
                city: faker.address.cityName(),
                state: faker.address.stateAbbr(),
                zipcode: faker.address.zipCodeByState("UT")
            }
        })
        await ward.save()
        await FirebaseDocument.subscriptionTransaction(stakeRef, ward.ref, {
            attributePath: "attributes.name",
            destinationPath: "attributes.stake.name"
        })
        await FirebaseDocument.subscriptionTransaction(stakeRef, ward.ref, {
            attributePath: "attributes.type",
            destinationPath: "attributes.stake.type"
        }) 
        return ward 
    }))
}

function createMembers(stakeRef: DocumentReference, wards:FirebaseDocument[]){
    return Promise.all(wards.map(async ward => {
        return Promise.all(range(1).map(async() => {
            const docRef = doc(collection(getFirestore(), "members"))
            const member = FirebaseDocument.build(docRef, {
                name: createName(),
                gender: faker.name.gender(true),
                birthdate: faker.date.between("1900/01/01", "2004/01/01") 
            })
            await member.save()
            await FirebaseDocument.subscriptionTransaction(ward.ref, member.ref, {
                attributePath: "attributes.name",
                destinationPath: "attributes.ward.name"
            })
            await FirebaseDocument.subscriptionTransaction(stakeRef, member.ref, {
                attributePath: "attributes.name",
                destinationPath: "attributes.stake.name"
            })
        }))
    }))
}

export async function createMemberActvityRoom(currentStake:DocumentReference, foreignStake:DocumentReference){
    const members = new FirebaseCollection(collection(getFirestore(), "members"))
    const docs = await members.retrieve()
    return Promise.all(docs.map(async (d) => {
        const ref = doc(collection(getFirestore(), "member-subscriptions"))
        const document = FirebaseDocument.build(ref, {
            homeStake: {
                id: currentStake.id 
            },
            validAddress: "unknown", 
            foreignStake: {id: foreignStake.id},
            activity: faker.random.numeric()
        })
        // document.data.subcollections = ["history"]
        const child = await document.buildChild("history", {
            title: "Member shared"
        })
        await child.save()
        // await document.save()
        await FirebaseDocument.subscriptionTransaction(currentStake, document.ref, {
            attributePath: "attributes.name",
            destinationPath: "attributes.homeStake.name"
        })
        await FirebaseDocument.subscriptionTransaction(foreignStake, document.ref, {
            attributePath: "attributes.name",
            destinationPath: "attributes.foreignStake.name"
        })
        await FirebaseDocument.subscriptionTransaction(d.ref, document.ref, {
            attributePath: "attributes.name.display",
            destinationPath: "attributes.member.name"
        })
    }))
}


export async function clear(){
    const cs = ["profiles", "stakes", "wards", "members", "member-subscriptions", "history", "chat-rooms", "chats"]
    return Promise.all(cs.map(async str => {
        const q = query(collectionGroup(getFirestore(), str))
        const snap = await getDocs(q)
        snap.forEach(doc => deleteDoc(doc.ref))
    }))
}

function createName(){
    const name = {
        first: faker.name.firstName(),
        middle: faker.name.middleName(),
        last: faker.name.lastName(),
        display: ""
    }
    name.display = name.first + " " + name.last 
    return name 
}

function range(to:number, from:number=0){
    const arr:number[] = []
    for(let i = from; i < to; i++){
        arr.push(i)
    }
    return arr 
}