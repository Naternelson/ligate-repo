import faker from "@faker-js/faker";
import { StakeState } from "./current-stake/slice";
import { StakesState } from "./stakes/slice";
import { Gender, HumanName, UserState } from "./user/slice";

export function fakeName(gender:"male" | "female" = "male"):HumanName{
    const name = {
        first: faker.name.firstName(gender),
        middle: faker.name.middleName(),
        last: faker.name.lastName(), 
        display: ''   
    }
    name.display = [name.first, name.last].join(" ")
    return name 
}

export function fakeAge(from:number, to: number):UserState["birthdate"]{
    const afterDate = new Date()
    afterDate.setFullYear(afterDate.getFullYear()-to)

    const beforeDate = new Date()
    beforeDate.setFullYear(beforeDate.getFullYear() -from)
    return faker.date.between(afterDate,beforeDate).toLocaleDateString()
}

export function fakeAddress(state?:string): StakeState["address"]{
    let s = state || faker.address.stateAbbr()
    return {
        street: faker.address.streetAddress(),
        city: faker.address.cityName(),
        state: s,
        zipcode: faker.address.zipCodeByState(s)
    }
}

const user:UserState = {
    loading: false, 
    name: fakeName(), 
    email: "test@gmail.com",
    gender: "male",
    profileImg: "https://www.w3schools.com/howto/img_avatar.png",
    birthdate: fakeAge(30,70), 
    uid: faker.random.alphaNumeric(10)

}


const currentStake: StakeState = {
    loading: false, 
    id: faker.random.alphaNumeric(10),
    name: `${faker.address.streetName()} YSA Stake`,
    language: "English",
    type: 'YSA',
    address: fakeAddress("UT"),
    roles:{
        [user.uid as string]: {
            title: "President",
            name: user.name?.display || ""
        }
    }
}

function randomStake():StakeState{
    const type = rndFromList("YSA", "Standard", "Special Language", "Married Student", "Single Adult", "Temp")
    
    return {
        loading: false, 
        id: faker.random.alphaNumeric(10),
        name: `${faker.address.streetName()} Stake`,
        language: type === "Special Language" ? "Spanish" : "English",
        type: type,
        address: fakeAddress("UT"),
        roles:{}
    }
}
function range(to:number, from:number = 0){
    const arr:number[] = []
    for(let i = from; i<to; i++)arr.push(i)
    return arr 
}

function rndFromList(...arr:any[]){
    const rndIndex = Math.floor(Math.random() * arr.length) 
    return arr[rndIndex]
}

const stakes:StakesState = {
    loading: false, 
    selected: {}, 
    focus: null,
    data: range(10).map(() => randomStake()).reduce((obj, stake) =>  ({...obj, [stake.id as string]: stake}),{})
}

export const preloadedStore = {
    currentStake: {
        stake: currentStake
    },
    stakes, 
    user
}