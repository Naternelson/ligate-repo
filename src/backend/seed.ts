import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import  {getFunctions, httpsCallable} from "firebase/functions"
import app from "../config/firebase"
const functions = getFunctions(app)
const createNewUser = httpsCallable(functions, "createNewUser")
const createControlledStake = httpsCallable(functions, "createControlledStake")
const createGhostStake = httpsCallable(functions, "createGhostStake")
export async function seedDb(){
    const user:any = await createNewUser({
        name: {
            first: 'James',
            last: 'Hill',
            middle: 'B.',
            display: 'Jimmy Hill'
        },
        email: 'jimmythehill@gmail.com',
        password: 'superSecretPassword1234',
        gender: 'male',
        phoneNumber: "+1801 4329-8834"
    })
    await signInWithEmailAndPassword(getAuth(), 'jimmythehill@gmail.com', 'superSecretPassword1234')
    console.log({user})
    const stakeRef = await createControlledStake({
        name: 'Example YSA Stake',
        type: 'ysa',
        city: 'Salt Lake City',
        state: 'UT',
        leadership: {
            title: 'president',
            role: 'admin'
        }
    })
    console.log({stakeRef})
    await new Promise((res) => {
        const countDown = 5000
        console.log("Waiting...")
        let i = 5
        const t = setInterval(()=>{
            console.log(i)
            i = i-1
        },1000)
        setTimeout(() =>{
            clearInterval(t)
            res(null)
        }, countDown)
    })
    const ghostStake = await createGhostStake({
        name: 'Example Family Stake',
        city: 'Salt Lake City',
        state: 'UT'
    })
    console.log({ghostStake})
}