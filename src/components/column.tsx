import { BoxProps, Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function Column(props:PropsWithChildren<BoxProps>){
    const {children, ...p} = props 
    const bProps:BoxProps = {
        display: 'flex',
        flexDirection: 'column',
        ...p
    }
    return (
        <Box {...bProps}>
            {children}
        </Box>
    )
}