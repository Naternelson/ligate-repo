import { NavigateOptions, useNavigate } from "react-router-dom";

interface LinkToProps {
    base?: string
} 
export default function useLinkTo(props?: LinkToProps){
    const {base} = props || {}
    const nav = useNavigate()
    let path:string = ""
    if(base) path = base 
    return (to:string = "/", options?:NavigateOptions) => () => nav(path + to, options)
}

export function useHomeLink(){
    const link = useLinkTo()
    return link 
}

export function useConnectionsLink(){
    const link = useLinkTo({base: "/connections"})
}