import faker from "@faker-js/faker"
import { Box } from "@mui/material"
import { collection, doc, getDocs, getFirestore, query, runTransaction, writeBatch } from "firebase/firestore"
import { useEffect, useRef } from "react"
import Table from "."
import { ColumnDef } from "./context"

const TABLE = "test-group"

const seed = () => {
    const b = writeBatch(getFirestore())
    for(let i = 0; i < 25; i++){
        const d = doc(collection(getFirestore(), TABLE))
        b.set(d, {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            recommend: faker.datatype.boolean(),
            activity: faker.helpers.arrayElement(["active", "semi", "inactive", "do not contact"]),
            calling: faker.datatype.boolean()
        })
    }
    return b.commit()
}

const reset = async () => {
    const q = query(collection(getFirestore(), TABLE))
    const snap = await getDocs(q)
    return runTransaction(getFirestore(), async (t)=>{
        snap.docs.forEach(doc => {
            t.delete(doc.ref)
        })
    })
}

export default function ExampleTable() {
    const firstPass = useRef(false)
    useEffect(()=> {
        if (firstPass.current) return 
        const fn = async () => {
            firstPass.current = true
            await reset() 
            await seed()   
        }
        fn() 

    },[firstPass.current])
    const q = query(collection(getFirestore(), TABLE))
    const columns:ColumnDef[] = [
        {field: 'firstName', headerName: 'First Name', type:'string', editable: true},
        {field: 'lastName', headerName: 'Last Name', type:'string', editable: true},
        {field: 'recommed', headerName: 'Recommend', type: 'checkbox', editable:true},
        {field: 'calling', headerName: 'Calling', type: 'checkbox', editable: true},
        {field: 'activity', headerName: 'Activity', type: 'string', editable: true}
    ]
    return (
        <Box my={2} mx={'auto'} width={"500px"} height={"500px"} overflow="auto">
            <Table query={q} columns={columns}/>
        </Box>
    )
}