import { useMemo, useState } from "react";


export interface SelectedObject{
    [id:string]: boolean
}
export type Gender = "male" | "female" | "other" | "prefer not to say"
export type MemberStatus = "active" | "inactive" | "do not contact" | "semi-active" | null 
export interface MemberData {
    [id:string]: {
        firstName: string
        lastName: string 
        display: string 
        status: MemberStatus
        addressConfirmed: boolean,
        gender: Gender
        address: {
            city: string,
            state: string 
        }
        imageURL: string | null,
        calling: string | null,
        temple: boolean,
        user: string | null, 
        ward: {
            id: string, 
            name: string,
            stakeId: string, 
            stakeName: string  
        }    
    }
}

interface DefaultMemberDataState {
    search?: string,
    activeColumn?: string,
    sortDirection?: "asc" | "desc"
    selected?: SelectedObject,
    filterByStake?: string | string[]
    filterByWard?: string | string[]
    filterByAddress?: boolean  
    filterByCity?: string | string[]
    filterByState?: string | string[]
    filterByStatus?: MemberStatus | MemberStatus[]
    filterByTemple?: boolean, 
    filterByGender?: Gender | Gender[]
}

export default function useMemberTableState(data: MemberData, defaultValues:DefaultMemberDataState={}):MemberTableState{
    const [search, setSearch] = useState<string>(defaultValues.search|| "")
    const [activeColumn, setActiveColumn] = useState<string | null>(defaultValues.activeColumn || null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultValues.sortDirection || "asc")
    const [selected, setSelected] = useState<SelectedObject>(defaultValues.selected || {})
    const [filterByStake, setFilterByStake] = useState<string | string[] | null>(defaultValues.filterByStake || null)
    const [filterByWard, setFilterByWard] = useState<string | string[] | null>(defaultValues.filterByWard || null)
    const [filterByAddress, setFilterByAddress] = useState<boolean | null>(defaultValues.filterByAddress || null)
    const [filterByCity, setFilterByCity] = useState<string | string[] | null>(defaultValues.filterByCity || null)
    const [filterByState, setFilterByState] = useState<string | string[] | null>(defaultValues.filterByState || null)
    const [filterByStatus, setFilterByStatus] = useState<MemberStatus | MemberStatus[]>(defaultValues.filterByStatus || null)
    const [filterByTemple, setFilterByTemple] = useState<boolean | null>(defaultValues.filterByTemple || null)
    const [filterByGender, setFilterByGender] = useState<Gender | Gender[] | null>(defaultValues.filterByGender || null)

    const filteredByStakeList = useMemo(() => {
        const keys = Object.keys(data)
        if(filterByStake === null) return keys 
        const filterable = typeof filterByStake === "string" ? [filterByStake] : filterByStake 
        return keys.filter(id => {
            return filterable.includes(data[id].ward.stakeId)
        })
    }, [JSON.stringify([filterByStake].flat()), JSON.stringify(Object.keys(data))])

    const filteredByWardList = useMemo(() => {
        const keys = filteredByStakeList
        if(filterByWard === null) return keys 
        const filterable = typeof filterByWard === "string" ? [filterByWard] : filterByWard 
        return keys.filter(id => {
            return filterable.includes(data[id].ward.id)
        })
    }, [JSON.stringify(filteredByStakeList), JSON.stringify([filterByWard].flat()), JSON.stringify(Object.keys(data))])

    const filterdByAddressList = useMemo(()=>{
        const keys = filteredByWardList
        if(filterByAddress === null) return keys
        return keys.filter((id) =>{
            return data[id].addressConfirmed === filterByAddress
        })
    }, [JSON.stringify(filteredByWardList), JSON.stringify([filterByAddress].flat()), JSON.stringify(Object.keys(data))])

    const filteredByCityList = useMemo(() => {
        const keys = filterdByAddressList
        if(filterByCity === null) return keys 
        const filterable = typeof filterByCity === "string" ? [filterByCity] : filterByCity 
        return keys.filter(id => {
            return filterable.includes(data[id].address.city)
        })
    }, [JSON.stringify(filterdByAddressList), JSON.stringify([filterByCity].flat()), JSON.stringify(Object.keys(data))])

    const filteredByStateList = useMemo(() => {
        const keys = filteredByCityList
        if(filterByState === null) return keys 
        const filterable = typeof filterByState === "string" ? [filterByState] : filterByState 
        return keys.filter(id => {
            return filterable.includes(data[id].address.state)
        })
    }, [JSON.stringify(filteredByCityList), JSON.stringify([filterByState].flat()), JSON.stringify(Object.keys(data))])

    const filteredByStatusList = useMemo(() => {
        const keys = filteredByCityList
        if(filterByStatus === null) return keys 
        const filterable = Array.isArray(filterByStatus) ? filterByStatus : [filterByStatus] 
        return keys.filter(id => {
            return filterable.includes(data[id].status)
        })
    }, [JSON.stringify(filteredByStateList), JSON.stringify([filterByStatus].flat()), JSON.stringify(Object.keys(data))])

    const filteredByTempleList = useMemo(() => {
        const keys = filteredByStatusList
        if(filterByTemple === null) return keys 
        const filterable = Array.isArray(filterByTemple) ? filterByTemple : [filterByTemple] 
        return keys.filter(id => {
            return filterable.includes(data[id].temple)
        })
    }, [JSON.stringify(filteredByStatusList), JSON.stringify([filterByTemple].flat()), JSON.stringify(Object.keys(data))])

    const filteredByGender = useMemo(()=>{
        const keys = filteredByTempleList
        if(filterByGender === null) return keys 
        const filterable = Array.isArray(filterByGender) ? filterByGender : [filterByGender] 
        return keys.filter(id => {
            return filterable.includes(data[id].gender)
        })
    }, [JSON.stringify(filteredByTempleList), JSON.stringify([filterByGender].flat()), JSON.stringify(Object.keys(data))])

    const filteredBySearch = useMemo(()=>{
        const keys = filteredByGender
        if(search === null || search === "") return keys 
        return keys.filter(id => {
            const member = data[id]
            const str = [member.address.city, member.address.state, member.calling, member.display, member.firstName, member.lastName, member.status, member.user, member.ward.name, member.ward.stakeName].join(" ")
            return str.includes(search)
        })
    },[search, JSON.stringify(filteredByGender)])




    const orderedList = useMemo(()=>{
        const keys = filteredBySearch
        let values:{id:string, value: any}[] = []
        switch(activeColumn){
            case "firstName":
                values = filteredBySearch.map((id)=> ({id, value: data[id].firstName}))
                break;
            case "lastName":
                values = filteredBySearch.map((id)=> ({id, value: data[id].lastName}))
                break;
            case "gender": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].gender}))
                break;
            case "status": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].status}))
                break;
            case "stake": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].ward.stakeName}))
                break;
            case "ward": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].ward.name}))
                break;
            case "addressConfirmed": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].addressConfirmed}))
                break;
            case "address": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].address}))
                break;
            case "display": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].display}))
                break;
            case "calling": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].calling}))
                break;
            case "temple": 
                values = filteredBySearch.map((id)=> ({id, value: data[id].temple}))
                break;
            default: 
                return keys 
        }
        values.sort((a,b) => {
            return +(a.value > b.value) || +(a.value === b.value) -1
        })
        const results = values.map(el => el.id)
        return sortDirection === "asc" ? results : results.reverse()
    },[JSON.stringify(filteredBySearch), activeColumn, sortDirection])

    const select = (id:string) => () => {
        setSelected((previous) => ({...previous, [id]: !previous[id]}))
    }

    const emptyObj:SelectedObject = {}
    const selectAll = () => {
        setSelected(() => {
            const values = orderedList
            return values.reduce((obj, id)=>{
                obj[id] = true 
                return obj 
            },emptyObj)
        })
    }
    const selectNone = () => {
        setSelected({})
    }
    const chooseColumns = (id:string) => () => {
        const dir = id === activeColumn ? sortDirection === "asc" ? "desc" : "asc" : "asc"
        setSortDirection(dir)
        setActiveColumn(id)
    }
    const clearColumns = () => {
        setSortDirection("asc")
        setActiveColumn(null)
    }
    const chooseStakes = (...stakes:string[]) => {
        setFilterByStake(stakes)
    }
    const clearStakes = () => {
        setFilterByStake(null)
    }
    const chooseWards = (...wards:string[]) => {
        setFilterByWard(wards)
    }
    const clearWards = () => {
        setFilterByWard(null)
    }
    const chooseAddress = (confirmed:boolean) => {
        setFilterByAddress(confirmed)
    }
    const clearAddress = () => setFilterByAddress(null)

    const chooseCities = (...cities:string[]) => {
        setFilterByCity(cities)
    }
    const clearCities = () => setFilterByCity(null)

    const chooseStates = (...states:string[]) => {
        setFilterByState(states)
    }
    const clearStates = () => setFilterByState(null)

    const chooseStatus = (...status:MemberStatus[]) => {
        setFilterByStatus(status)
    }
    const clearStatus = () => setFilterByStatus(null)

    const chooseTemple = (status: boolean) => {
        setFilterByTemple(status)
    }
    const clearTemple = () => setFilterByTemple(null)

    const chooseGender = (...gender: Gender[]) => {
        setFilterByGender(gender)
    }
    const clearGender = () => setFilterByGender(null)

    const toggleDirection = () => {
        setSortDirection(previous => previous === "asc" ? "desc" : "asc")
    }
    const searchBy = (str:string) =>{
        setSearch(str)
    }

    const isViewable = (id:string) => {
        return orderedList.includes(id)
    }
    const isSelected = (id:string) => {
        return selected[id]
    }

    return {
        data, 
        orderedList,
        activeColumn,
        sortDirection, 
        selected,
        select,
        selectAll,
        selectNone,
        chooseColumns,
        clearColumns,
        chooseStakes,
        clearStakes,
        chooseWards,
        clearWards,
        chooseAddress,
        clearAddress,
        chooseCities,
        clearCities,
        chooseStates,
        clearStates,
        chooseStatus,
        clearStatus,
        chooseTemple,
        clearTemple,
        chooseGender,
        clearGender,
        toggleDirection,
        searchBy,
        isViewable,
        isSelected,
        stakes: filterByStake,
        wards: filterByWard,
        cities: filterByCity,
        status: filterByStatus, 
        temple:filterByTemple, 
        gender: filterByGender, 
        address: filterByAddress,
        search
    }
}

export interface MemberTableState   {
    data: MemberData, 
    orderedList: string[],
    activeColumn:string | null,
    sortDirection:"asc" | "desc", 
    selected:SelectedObject,
    search:string
    select:(id: string) => () => void,
    selectAll: () => void,
    selectNone:() => void,
    chooseColumns: (id: string) => () => void,
    clearColumns: () => void,
    chooseStakes: (...stakes: string[]) => void,
    clearStakes: () => void,
    chooseWards: (...wards: string[]) => void,
    clearWards: () => void,
    chooseAddress: (confirmed: boolean) => void,
    clearAddress: () => void,
    chooseCities: (...cities: string[]) => void,
    clearCities: () => void,
    chooseStates: (...states: string[]) => void,
    clearStates: () => void,
    chooseStatus: (...status: MemberStatus[]) => void,
    clearStatus: () => void,
    chooseTemple: (status: boolean) => void,
    clearTemple: () => void,
    chooseGender: (...gender:Gender[]) => void,
    clearGender: () => void,
    toggleDirection: () => void,
    searchBy: (str: string) => void,
    isViewable: (id: string) => boolean,
    isSelected: (id: string) => boolean,
    stakes:  string | string[] | null,
    wards:  string | string[] | null,
    cities:  string | string[] | null,
    status:  MemberStatus | MemberStatus[], 
    temple: boolean | null, 
    gender:  Gender | Gender[] | null, 
    address: boolean | null
}