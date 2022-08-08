import { BoxProps } from "@mui/material"
import {  DocumentData, DocumentSnapshot, getFirestore, onSnapshot, Query, query, QueryConstraint, QuerySnapshot, where, limit, startAfter, orderBy, QueryDocumentSnapshot, FieldPath } from "firebase/firestore"
import React, { createContext,  ReactElement,  useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ActionItem } from "./actions"


export type FilterByContraint = {field: string, matches?: string|number|boolean, notMatch?: string| number| boolean}

export type TableProps = {
    query: Query<unknown>
    max?: number,
    initialContraints?: QueryConstraint[],
    initialPage?: number, 
    initalGroupBy?: FilterByContraint[],
    ContainerProps?: BoxProps,
    columns: ColumnDef[],
    api?: React.MutableRefObject<TableContextValue>
}

export interface ColumnDef {
    field: string,
    headerName?: string,
    renderCell?: (params: {value: unknown, column:ColumnDef}) =>  ReactElement,
    valueGetter?: (params: {id: string, row: DocumentData, column:ColumnDef}) => string | FieldPath,
    type: 'string' | 'number' | 'dateTime' | 'boolean' | 'singleSelect' | 'actions' | "checkbox"
    valueOptions?: Array<string | number>,
    getActions?: (params:{id:string, snap: DocumentSnapshot, column: ColumnDef}) => JSX.Element[],
    filterable?: boolean,
    hidden?: boolean,
    editable?: boolean
} 

export type TableContextValue = {
    selected:{
        getSelected: (id?: string) => boolean | {
            [id: string]: boolean;
        };
        selectById: (id: string) => void;
        unselectById: (id: string) => void;
        toggleById: (id: string) => void;
        allSelected: () => boolean;
        selectAll: () => void;
        unselectAll: () => void;
        toggleSelectAll: () => void;
        indeterminate: () => boolean;
    },
    pagination: {
        max: number;
        groups: DocumentDisplayGroups;
        currentGroup: () => DocumentSnapshot<DocumentData>[];
        setNewMax: (max: number) => void;
        nextPage: () => void;
        previousPage: () => void;
        goToStart: () => void;
        goToPage: (page: number) => void;
    },
    filtering: {
        contraints: FilterByContraint[];
        addContraint: (filterBy: FilterByContraint) => void;
        updateContraints: (callbackFn: React.SetStateAction<FilterByContraint[]>) => void;
    },
    ordering: {
        column: string | null;
        direction: "asc" | "desc";
        setColumn: (field: string) => void;
        setOrderDirection: (value: "asc" | "desc") => void;
        toggleDirection: () => void;
    },
    data: {
        [id: string]: DocumentSnapshot<DocumentData>;
    },
    columns: ColumnDef[]
}

function blankTableContextValue(): TableContextValue{
    return {
        selected: {
            getSelected: (id?:string) => false ,
            selectById: (id:string) => {},
            unselectById: (id:string) => {},
            toggleById:(id:string) => {},
            allSelected: () => false,
            selectAll: () => {},
            unselectAll: () => {},
            toggleSelectAll: () => {},
            indeterminate: () => false
        },
        pagination: {
            max: 25, groups:{}, 
            currentGroup: () => [],
            setNewMax: (max: number) => {},
            nextPage: () => {},
            previousPage: () => {},
            goToStart: () => {},
            goToPage: (page:number) => {}
        },
        filtering: {
            contraints: [],
            addContraint: (filterBy:FilterByContraint) => {},
            updateContraints: (callbackFn: React.SetStateAction<FilterByContraint[]>) => {}
        },
        ordering: {
            column: null, 
            direction: "asc",
            setColumn: (field:string) => {},
            setOrderDirection: (value: "asc" | "desc") =>  {}, 
            toggleDirection: () => {}
        },
        data: {},
        columns: []
    }
}

export type DocumentDisplayGroups = {
    [group:number]: string[]
}

export const TableContext = createContext<TableContextValue>(blankTableContextValue())
export const useTableContext = () => useContext(TableContext)

export default function useTable(params: TableProps){
    const [page, setPage] = useState<number>(params.initialPage || 0)
    const [max, setMax] = useState<number>(params.max || 25)
    const [filterBy, setFilterBy] = useState<FilterByContraint[]>(params.initalGroupBy || [])
    const [documents, setDocuments] = useState<{[id:string]: DocumentSnapshot}>({})
    const [groups, setGroups] = useState<DocumentDisplayGroups>({})
    const [selected, setSelected] = useState<{[id:string]: boolean}>({})
    const [orderCol, setOrderCol] = useState<string| null>(null)
    const [orderDirection, setOrderDirection] = useState<"asc"| "desc">("asc")

    const lastDocId = useMemo(()=> {
        if(page > 0) return groups[page-1][groups[page-1].length - 1]
        return null 
    }, [page, groups])

    const allSelected = ()=> {
        return groups[page] ? groups[page].every(id => selected[id]) : false
    }


    const getValue = useCallback(()=> {
        return {
            selected: {
                getSelected: (id?:string) => {
                    if(id) return !!selected[id]
                    return selected
                },
                selectById: (id:string) => {
                    setSelected(previous => ({...previous, [id]: true}))
                },
                unselectById: (id:string) => {
                    setSelected(previous => ({...previous, [id]: false}))
                },
                toggleById:(id:string) => {
                    setSelected(previous => ({...previous, [id]: !previous[id]}))
                },
                allSelected: () => {
                    return allSelected()
                },
                selectAll: async () => {
                    setSelected(groups[page].reduce((selected, id)=> {
                        return {...selected, [id]: true}
                    }, {}))
                },
                unselectAll: () => {
                    setSelected({})
                },
                toggleSelectAll: () => {
                    if(allSelected()) setSelected({})
                    else setSelected(groups[page].reduce((selected, id)=> {
                        return {...selected, [id]: true}
                    }, {}))
                },
                indeterminate: () => {
                    if(allSelected()) return false 
                    if(!groups[page]) return false 
                    return groups[page].some(id => selected[id])
                }
            },
            pagination: {
                max, groups, 
                currentGroup: () => groups[page] ? groups[page].map(id => documents[id]) : [],
                setNewMax: (max: number) => {
                    setMax(max)
                    setPage(0)
                },
                nextPage: () => {
                    if(Object.keys(groups[page].length < max)) return 
                    setPage(p => p + 1)
                },
                previousPage: () => {
                    if(page === 0) return 
                    setPage(p => p -1)
                },
                goToStart: () => setPage(0),
                goToPage: (page:number) => {
                    if(page >=0) setPage(0)
                }
            },
            filtering: {
                contraints: filterBy,
                addContraint: (filterBy:FilterByContraint) => setFilterBy(p => [...p, filterBy]),
                updateContraints: (callbackFn: React.SetStateAction<FilterByContraint[]>) => setFilterBy(callbackFn)
            },
            ordering: {
                column: orderCol, 
                direction: orderDirection,
                setColumn: (field:string) => {
                    if(field === orderCol) return setOrderDirection(p => p === "asc" ? "desc": "asc")
                    setOrderDirection("asc")
                    setOrderCol(field)
                },
                setOrderDirection: (value: "asc" | "desc") =>  setOrderDirection(value), 
                toggleDirection: () => {
                    setOrderDirection(p => p === "asc" ? "desc" : "asc")
                }
            },
            data: documents,
            columns: params.columns
        }
    }, [page, setPage, max, setMax, filterBy, setFilterBy, documents, setDocuments, groups, setGroups, selected, setSelected, allSelected, orderCol, setOrderCol, orderDirection, setOrderDirection])

    useEffect(() => {
        let t = getValue() 
        if(params.api?.current) params.api.current = getValue()
    })

    useEffect(() => {
        const constraints: QueryConstraint[] = [limit(max)]
        if(lastDocId !== null) constraints.push(startAfter(documents[lastDocId]))
        if(orderCol !== null) constraints.push(orderBy(orderCol,orderDirection))
        if(filterBy.length > 0) constraints.push(...filterByContraints(filterBy))
        return onSnapshot(query(params.query,...constraints), (snap) => {
            if(snap.empty) return setPage(p => p > 0 ? p -1 : p)
            const docs = getSnapshotById(snap)
            setDocuments(p => ({...p, ...docs}))
            setGroups(previous => ({...previous, [page]: getIdsInOrder(snap)}))
        })

    },[page, max, filterBy, lastDocId, orderCol, orderDirection])
    
    return getValue()
}

function filterByContraints(contraints:FilterByContraint[]): QueryConstraint[]{
    return contraints.reduce((arr, c) => {
        if(!c.matches && !c.notMatch) return arr 
        if(c.matches) return [...arr, where(c.field, "==", c.matches)]
        return [...arr, where(c.field, "!=", c.notMatch)]
    },[] as QueryConstraint[])

}

function getSnapshotById(snap: QuerySnapshot<unknown>){
    return snap.docs.reduce((obj, doc) => {
        if(!doc.exists()) return obj 
        return {...obj, [doc.id]: doc}
    }, {})
}

function getIdsInOrder(snap:QuerySnapshot<unknown>){
    return snap.docs.map(doc => doc.id)
}