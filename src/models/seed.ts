import faker from "@faker-js/faker";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, DocumentReference, Firestore, getFirestore, increment, runTransaction, writeBatch } from "firebase/firestore";
import { wait } from "../utility/wait";
import FirebaseCollection from "./firestore-collection";
import FirebaseDocument from "./firestore-ref";

export default async function seed(){
    const auth = getAuth()
    const u = await signInWithEmailAndPassword(auth, "test@gmail.com", "password")
    const db = getFirestore()
    const uid = u.user.uid
    const userDoc = await createUserDocument(uid, db)
    const user = await userDoc.refresh()
    const [stake, tempStake] = await createStakes(uid, userDoc, db)
    const [wards, temps] = await createWards(uid, db, stake, tempStake)
    await createMembers(db, wards, temps, stake, tempStake)
    await createConversations(db, uid)
    
}

async function createUserDocument(uid:string, db:Firestore){
    const u = new FirebaseCollection(collection(db, "users")).build({
        uid, 
        stakeId: null,
        stakeRole: null 
    })
    const name = {first: faker.name.firstName(), last: faker.name.lastName(), middle: faker.name.middleName(), display: ""}
    name.display = name.first + " " + name.last
    const p = new FirebaseCollection(collection(db, "members")).build({
        name,
        gender: "male",
        birthdate: faker.date.past(100)
    })
    const b = writeBatch(db)
    b.set(u.ref, u.saveObject())
    b.set(p.ref, p.saveObject())
    try {
        await b.commit()
        await FirebaseDocument.subscriptionTransaction(p.ref, u.ref, {
            attributePath:  "attributes",
            destinationPath: "attributes.profile"
        })
        return u
    } catch (err) {
        console.warn("Error Creating a user documents")
        throw err 
    }

}

function fakeAddress() {
    const {address} = faker
    return {
        street: address.streetAddress(),
        secondaryAddress: address.secondaryAddress(), 
        city: address.cityName(),
        state: address.stateAbbr(),
        zipcode: address.zipCode() 
    }
}

function fakeName(){
    const {name} = faker 
    const {firstName, lastName, middleName} = name
    const fName = {
        first: firstName(), middle: middleName(), last:lastName(), display: ""
    }
    const {first, last} = fName
    fName.display = [first, last].join(" ")
    return fName
}

async function createStakes(uid:string, userDoc:FirebaseDocument, db:Firestore):Promise<[stake:FirebaseDocument, tempStake: FirebaseDocument]>{
    const s = new FirebaseCollection(collection(db, "stakes")).build({
        name: "Ogden YSA 2nd Stake", 
        address: fakeAddress(),
        roles: {[uid]:{}},
        type: "YSA",
        memberCount: 0
    })
    const temp = new FirebaseCollection(collection(db, "stakes")).build({
        name: "Ogden Family Stake",
        address: fakeAddress(), 
        type: 'Temp',
        memberCount: 0
    })
    

    const b = writeBatch(db)
    b.set(s.ref, s.saveObject())
    b.set(temp.ref, temp.saveObject())
    b.update(userDoc.ref, {
        "attributes.stakeId": s.ref.id,
        "attributes.stakeRole": "Stake President"
    })
    try {
        await b.commit()
        
        await FirebaseDocument.subscriptionTransaction(userDoc.ref, s.ref, {
            attributePath:  "attributes.profile.data.name",
            destinationPath: "attributes.role." + uid + ".name"
        })
        return [s, temp]
    } catch (err) {
        console.warn("Error Creating stakes")
        throw err 
    }
}

function range(to:number, from:number =0){
    const arr:number[] = []
    for(let i = from; i < to; i++) {
        arr.push(i)
    }
    return arr 
}

async function createWards(uid:string, db:Firestore, stakeDoc:FirebaseDocument, tempDoc: FirebaseDocument){
    const b = writeBatch(db)
    const wardsCollections = await stakeDoc.buildSubcollection("wards")
    const tempCollections = await tempDoc.buildSubcollection("wards")

    const wards = range(1).map(() =>{
        const ward = wardsCollections.build({
            name: `${faker.address.streetName()} YSA Ward`,
            address: fakeAddress(),
            roles: {},
            type: 'YSA',
            count:0
        })
        b.set(ward.ref, ward.saveObject())
        return ward
    })
    const temps = range(1).map(() =>{
        const temp = tempCollections.build({
            name: `${faker.address.streetName()} Ward`,
            address: fakeAddress(),
            roles: {},
            type: 'Temp',
            count:0
        })
        b.set(temp.ref, temp.saveObject())
        return temp
    })

    try {
        await b.commit()
        return [wards, temps]
    } catch (err) {
        console.warn("Error Creating Wards")
        throw err 
    }
}

async function createMembers(db:Firestore, wardDocs:FirebaseDocument[], tempDocs:FirebaseDocument[], stakeDoc:FirebaseDocument, tempStake: FirebaseDocument){
    
    try {
        // const stakeMembers = await promiseIterator(wardDocs.map(async ward => {
        //     await promiseIterator(range(2).map( async() =>{
        //         return await createMember(db, ward, stakeDoc)
        //     }))
        // }))

        const stakeMembers:any[] = []
        for(let ward of wardDocs){
            for(let i = 0; i < 200; i++){
                stakeMembers.push(await createMember(db, ward, stakeDoc))
            }
        }
        const tempMembers: any[] = []
        for(let temp of tempDocs){
            for(let i = 0; i < 2; i++){
                tempMembers.push(await createMember(db, temp, tempStake))
            }
        }
        return  await Promise.all([stakeMembers, []])
    } catch (err){
        console.warn("Error creating members")
        throw err 
    }

}

async function createMember(db: Firestore, wardDoc:FirebaseDocument, stakeDoc: FirebaseDocument){
    const member = new FirebaseCollection(collection(db, "members")).build({
        name: fakeName(),
        gender: faker.name.gender(true),
        birthdate: faker.date.past(100)       
    })
    const b =  writeBatch(db)
    b.set(member.ref, member.saveObject())
    b.update(wardDoc.ref, {"attributes.memberCount": increment(1)})
    b.update(stakeDoc.ref, {"attributes.memberCount": increment(1)})
    try {
        await b.commit()
        await FirebaseDocument.subscriptionTransaction(wardDoc.ref, member.ref, {
            attributePath: "attributes.name",
            destinationPath: "attributes.ward"
        })
        await FirebaseDocument.subscriptionTransaction(stakeDoc.ref, member.ref, {
            attributePath: "attributes.name",
            destinationPath: "attributes.stake"
        })
        return member 
    } catch (err) {
        console.warn("Error Creating Member")
        throw err 
    }
}

async function createConversations(db:Firestore, uid:string){
    const uB = "lCa1qQwgshhocTSJExtgZY0Nf743"
    const room = new FirebaseCollection(collection(db, "rooms")).build({
        userA: uid, 
        userB: uB,
        userAStatus: "online",
        userBStatus: "offline",
        roomStatus: "active"
    })
    room.data.addPermisssion({uB: "admin"})
    try{
        const chats = await room.buildSubcollection("chats")
        await Promise.all(range(10).map(async (index) => {
            const chat = chats.build({
                message: faker.lorem.sentences(),
                priority: 0, 
                sender: !!(index % 1) ? uid : uB,
                status: "Sent",
                date: new Date()
            })
            return await chat.save()
        }) )
        
    } catch (err){
        console.warn("Error Creating chats")
        throw err 
    }
    
    
}
