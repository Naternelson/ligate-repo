import { BoxProps, Box } from "@mui/material";
import { PropsWithChildren } from "react";

export default function Row(props:PropsWithChildren<BoxProps>){
    const {children, ...p} = props 
    const bProps:BoxProps = {
        display: 'flex',
        flexDirection: 'row',
        ...p
    }
    return (
        <Box {...bProps}>
            {children}
        </Box>
    )
}