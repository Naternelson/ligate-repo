import { BoxProps, Checkbox, CheckboxProps, Grid } from "@mui/material";
import { useState } from "react";

export default function MemberTable(){

    return (
        <Grid>
            
        </Grid>
    )
}

interface TableHeaderColumns extends BoxProps{
    select: boolean,
    checked: boolean, 
    indeterminate: boolean, 
    name: boolean, 
    first: boolean,
    last: boolean, 
    activity: boolean, 
    address: boolean, 
    calling: boolean,
    pic: boolean,
    onSelectChange: any, 
    onNameClick: any, 
    onFirstClick: any, 
    onLastClick: any, 
    onActivityClick: any, 
    onAddressClick: any, 
    onPicClick: any, 
    onCallingClick: any
}

export function TableHeader(props: Partial<TableHeaderColumns>){
    const {checked, indeterminate, onSelectChange} = props 
    const [column, setColumn] = useState<string>("")

    return (
        <Grid container>
            {props.select && <SelectBox {...{checked, indeterminate, onChange: onSelectChange}}/>}

        </Grid>
    )
}


function SelectBox(props: CheckboxProps){
    return (
        <Grid item> 
            <Checkbox {...props}/>
        </Grid>
    )
}