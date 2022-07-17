import faker, { GenderType } from "@faker-js/faker";
import { Add, Search } from "@mui/icons-material";
import { Box, Button, Dialog, Divider, TextField, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UsaStates } from "usa-states";
import ComboBox from "../../../components/combo-box";
import HelperButton from "../../../components/helper-button";
import TField from "../../../components/t-field";
import Typo from "../../../components/typo";
import { dummyData } from "./dummy";
import useMemberTableState, { Gender, MemberData, MemberStatus, MemberTableState } from "./useMemberTableState";


const blankState:MemberTableState =  {
    data:{}, 
    orderedList: [],
    activeColumn:null,
    sortDirection:"asc", 
    selected:{},
    select:() => () => {},
    selectAll: () => {},
    selectNone:() => {},
    chooseColumns: (id:string)=> () => {},
    clearColumns: () => {},
    chooseStakes: () => {},
    clearStakes: () => {},
    chooseWards: () => {},
    clearWards: () => {},
    chooseAddress: () => {},
    clearAddress: () => {},
    chooseCities: () => {},
    clearCities: () => {},
    chooseStates: () => {},
    clearStates: () => {},
    chooseStatus: () => {},
    clearStatus: () => {},
    chooseTemple: () => {},
    clearTemple: () => {},
    chooseGender: () => {},
    clearGender: () => {},
    toggleDirection: () => {},
    searchBy: () => {},
    isViewable: () => false,
    isSelected: () => false,
    stakes:  null,
    wards:  null,
    cities:  null,
    status:  null, 
    temple: null, 
    gender:  null, 
    address: null,
    search: ""
}
const Context = createContext(blankState)

export function useMemberTableContext(){
    return useContext(Context)
}
export default function MemberTable(){
    const [data, setData] = useState({})
    const tableState = useMemberTableState(data)

    useEffect(()=>{
        const data = dummyData(10)
        setData(data)
    },[])

    useEffect(()=>{
        console.log(tableState)
    },[tableState])

    return (
        <Box>
            <Context.Provider value={tableState}>
                <MemberTableToolbar/>
            </Context.Provider>
        </Box>
    )
}


function MemberTableToolbar(){
    const tContext = useMemberTableContext()
    const [openNewMemberForm, setOpenNMF] = useState(false)
    return (
        <>
        <Box m={3}>
            <Box display="flex" flexDirection='row' justifyContent={"start"} alignItems="center" gap={2} py={1}>
                <Typography variant="h1" sx={{fontSize: "2rem", color: 'grey.600', display: 'inline'}}>Members</Typography>
                <HelperButton onClick={() => setOpenNMF(true)}>
                    Add New Member
                    <Add sx={{fontSize: '1rem'}}/>
                </HelperButton>
                <TextField 
                    value={tContext.search} 
                    onChange={(e) => {
                        const value = e.target.value
                        tContext.searchBy(value)
                    }}
                    placeholder="Search"
                    size="small"
                    InputProps={{
                        style: {fontSize: '.75rem'},
                        startAdornment: <Search sx={{fontSize:'1rem', color: "grey.700"}}/>
                    }}
                />   
                
            </Box>
            <Divider sx={{borderBottomWidth:'medium'}}/> 
        </Box>
            <Dialog open={openNewMemberForm} onClose={() => setOpenNMF(false)}>
                <AddMemberForm close={()=>setOpenNMF(false)}/>
            </Dialog>
        </>
    )
}


function MemberHeaderBar(){
    
}


type AddMemberFormProps = {close: any}

function AddMemberForm(props: AddMemberFormProps){
    const [loading, setLoading] = useState(false)
    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [display, setDisplay] = useState("")
    const [gender, setGender] = useState<Gender | "">("")
    const [wardId, setWardId] = useState("")
    const [wardName, setWardName] = useState("")
    const [stakeId, setStakeId] = useState("")
    const [stakeName, setStakeName] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState<string>("UT")
    const [status, setStatus] = useState<MemberStatus>(null)
    const [temple, setTemple] = useState<boolean | null>(null)

    useEffect(()=>{
        console.log({gender, state})
    })


    return (
        <Box m={3}>
            <Box maxWidth="300px">
                <TField label={"First Name"} value={first} onChange={(e) => setFirst(e.target.value)}/>
                <TField label={"Last Name"} value={last} onChange={(e) => setLast(e.target.value)}/>
                <TField label={"Preferred Name"} value={display} onChange={(e) => setDisplay(e.target.value)}/>
                <ComboBox options={genders} label="Gender" onChange={(_e:any, value:any) => setGender(value.id as Gender)} value={gender}/>
                <Box display="flex" flexDirection="row" gap={1}>
                    <TField label={"City"} value={city} onChange={(e) => setCity(e.target.value)}/>
                    <Box minWidth={"100px"}>
                        <ComboBox options={states} label="State" value={state || undefined} onChange={(_e:any, value:any) => {
                            setState(value?.id || "")}
                            }/>
                    </Box>
                    
                </Box>
                
                <Box display="flex" flexDirection="row" justifyContent={"end"} gap={2}>
                    <Button variant="text" size="small" onClick={props.close}>Cancel</Button>
                    <Button variant="text" size="small">Add</Button>
                </Box>
                <Box mt={1}>
                    
                </Box>
            </Box>

        </Box>
    )
}

const usaStates = new UsaStates()
const states = usaStates.states.map(state => {
    return {label: state.abbreviation, id: state.abbreviation}
})

const genders = [{
        id: 'male',
        label: 'male'
    },
    {
        id: 'female',
        label: 'female'
    },
    {
        id: 'other',
        label: 'other'
    },
    {
        id: 'prefer not to say',
        label: 'prefer not to say'
    }
]