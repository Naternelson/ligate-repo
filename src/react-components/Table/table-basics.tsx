import { Grid, GridProps } from "@mui/material"
import { PropsWithChildren } from "react"


export const Row = (props: PropsWithChildren<GridProps >) => {
    const {children, ...g} = props
    const gProps:GridProps = {
        container: true, 
        direction: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        spacing: 0, 
        ...g
    }
    return (
        <Grid {...gProps}>
            {children}
        </Grid>
    )
}

export const Cell = (props:PropsWithChildren<GridProps>) => {
    const {children, ...g} = props 
    const gProps:GridProps = {
        item: true, 
        xs: true, 
        height: 'inherit',
        width: '100%',
        display: 'flex',
        ...g 
    }
    return (
        <Grid {...gProps}>
            {children}
        </Grid>
    )
}