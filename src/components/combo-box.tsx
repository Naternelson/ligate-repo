import { Autocomplete, AutocompleteChangeReason, AutocompleteInputChangeReason, AutocompleteProps, AutocompleteRenderInputParams, AutocompleteRenderOptionState, Box, Stack, TextField, TextFieldProps } from "@mui/material";
import React from "react";


export type ComboBoxOptions = {
    freeSolo?: boolean 
    options: {label: string, id: any}[],
    onChange?: any,
    onInputChange?: any
    noOptions?: string,
    value?:string,
    label?:string
}
export default function ComboBox(props: ComboBoxOptions){
    const {label} = props
    const renderInput = (params:AutocompleteRenderInputParams) => {
        const InputProps = {
            ...params.InputProps,
            style: {fontSize: '.75rem'},
            
        }
        const props:TextFieldProps = {...params,InputProps, label, margin: 'dense', InputLabelProps: {style: {fontSize: '.75rem'}}, size: 'small'}
        return <TextField {...props} />
    }
    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: {id:any, label:string}) =>{
        return <Box component="li" sx={{fontSize: '.75rem', borderBottom: 1, borderColor: 'grey.300'}} {...props}>{option.label}</Box>
    }

    const p = {
        selectOnFocus:true, 
        clearOnBlur: true, 
        autoSelect:true, 
        handleHomeEndKeys: true,
        isOptionEqualToValue: (option: {label:string, id:any}, value:any) => {
            return option.id === value
        }, 
        renderInput, 
        renderOption,
        ...props
    }
    return (
        <Autocomplete {...p} />
    )
}