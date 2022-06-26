import { SxProps, Typography, TypographyProps } from "@mui/material";
import { PropsWithChildren, useEffect } from "react";

export default function Typo(props: PropsWithChildren<TypographyProps>){
    const {children, ...tProps} = props
    const p:TypographyProps = {...tProps, sx: {lineHeight: 1, fontSize: '.75rem',...(tProps.sx || {})}}
    useEffect(()=>{
        console.log(children, tProps)
    },[])
    return (
        <Typography {...p}>
            {children}
        </Typography>
    )
}