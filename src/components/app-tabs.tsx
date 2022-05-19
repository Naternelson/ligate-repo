import { ButtonBase, Tabs, TabsProps, BoxProps, Box } from "@mui/material";
import { Children, createContext, PropsWithChildren, useContext, useEffect, useState, ReactNode, useRef } from "react";

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
    const count = Children.count(props.children)
    
    useEffect(()=>{
        context.setCount(count)
    },[count])

    return (
        <Tabs value={context.index}>
            {props.children && Children.map(props.children, (child,index) =>(
                <ButtonBase centerRipple sx={{p:1}} onClick={() => context.setIndex(index)}>
                    {child}
                </ButtonBase>
            ))}
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
            <Box sx={{display: index === value ? "block" : "none"}} {...bProps}>
                {children}
            </Box>
        )
    }
    return null 
}