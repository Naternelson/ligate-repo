import { ButtonBase, Tabs, TabsProps, BoxProps, Box, Tab, TabProps } from "@mui/material";
import { Children, createContext, PropsWithChildren, useContext, useEffect, useState, ReactNode, useRef, cloneElement, isValidElement } from "react";

interface TabContext{
    index: number, 
    setIndex: (newIndex:number) => void, 
    setCount: (count:number) => void
    count: number
}
const Context = createContext<TabContext>({
    index:0,
    setIndex: () => {},
    setCount: () => {},
    count: 0
})

export default function AppTabWrapper(props:PropsWithChildren<{}>){
    const [index, setIndex] = useState(0)
    const [count, setCount] = useState(0)
    return (
        <Context.Provider value={{
            count, index, setIndex: (index:number) => setIndex(index), setCount:(count:number) => setCount(count)
        }}>
            {props.children}
        </Context.Provider>
    )
}

export function useTabContext(){
    return useContext(Context)
}

export function AppTabs(props:PropsWithChildren<TabsProps>){
    const context = useTabContext()
    const children = props.children
    const count = Children.count(children)
    
    useEffect(()=>{
        context.setCount(count)
    },[count])
    return (
        <Tabs sx={{p:0}} value={context.index}>
            {children && Children.map(children, (child, index) => {
                if(isValidElement(child)) return cloneElement(child, {onClick:() => context.setIndex(index)})
                return null
            })}
        </Tabs>
    )
}

type TabPanelProps = BoxProps & {value:number}

export function TabPanel(props:PropsWithChildren<TabPanelProps>){
    const {value,children, ...bProps} = props
    const {index} = useTabContext()
    const touched = useRef(false)

    useEffect(()=>{
        if(index === value) touched.current = true 
    }, [index, value])

    if(index === value || touched.current === true) {
        return (
            <Box  sx={{display: index === value ? "block" : "none"}} {...bProps}>
                {children}
            </Box>
        )
    }
    return null 
}

export function AppTab(props:TabProps){
    const p:TabProps = {
        disableRipple:true, 
        ...props,
        sx:{
            textTransform: 'none',
            fontSize: ".8rem",
            "&:hover": {bgcolor: 'rgba(25, 118, 210,0.05)'},
            ...(props.sx||{})
        }
    }
    return (
        <Tab {...p}/>
    )
}

