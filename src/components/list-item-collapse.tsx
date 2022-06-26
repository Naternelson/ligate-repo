import { Box, BoxProps, Collapse, CollapseProps, Divider } from "@mui/material";
import { PropsWithChildren, ReactNode, useEffect } from "react";

export interface ListItemCollapseProps extends BoxProps{
    primary?: ReactNode
    secondary?: ReactNode
    enter: boolean,
    collapseProps?: CollapseProps,
    divider?:boolean
}
export default function ListItemCollapse(props: PropsWithChildren<ListItemCollapseProps>){
    const {primary, secondary, enter, collapseProps, children, divider, ...boxP} = props
    const boxProps:BoxProps = { display: 'flex', flexDirection: 'column', justifyContent: 'start', ...boxP}
    const titleProps:BoxProps = {py: 1, px: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', sx: {cursor: 'pointer'}}
    const collapseP = {in:enter, ...(collapseProps || {})}
    return (
        <Box {...boxProps}>
            <Box {...titleProps}>
                {!!primary && primary}
                {!!secondary && secondary}
            </Box>
            <Collapse {...collapseP}>
                {children}
            </Collapse>
            {!!divider && <Divider/>}
        </Box>
    )
}