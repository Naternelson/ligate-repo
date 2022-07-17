import faker, { GenderType } from "@faker-js/faker"
import { MemberData } from "./useMemberTableState"

const dummyWards = (numOfStakes:number, wardsToStake:number) => {
    const wards:any[] = []
    for(let i =0; i < numOfStakes; i++){
        const stakeName = faker.address.streetName() + " Stake"
        const stakeId = faker.datatype.uuid()
        for(let j =0; j < wardsToStake; j++){
            wards.push({
                id: faker.datatype.uuid(),
                name: faker.address.streetName() + " Ward",
                stakeName,
                stakeId
            })
        }
    }
    return wards 
} 

export const dummyData = (membersToWard:number):MemberData => {
    const wards = dummyWards(1,1)
    const members:MemberData = {}
    wards.forEach(ward => {
        for(let i =0; i< membersToWard; i++){
            const gender:GenderType = faker.helpers.arrayElement(["male", "female"])
            const fName = faker.name.firstName(gender)
            const lName = faker.name.lastName(gender)
            members[faker.datatype.uuid()] = {
                display: fName + " " + lName,
                firstName: fName, 
                lastName: lName, 
                status: faker.helpers.arrayElement(["active", "inactive", "do not contact", "semi-active", null]),
                address: {
                    city: faker.address.cityName(), 
                    state: "UT"
                },
                addressConfirmed: faker.datatype.boolean(),
                temple: faker.datatype.boolean(),
                gender, 
                imageURL: null, 
                calling: faker.helpers.arrayElement(["instructor", "leader", "secretary", "committee-member", null]),
                user: null, 
                ward
            }
        }
    })
    return members
}