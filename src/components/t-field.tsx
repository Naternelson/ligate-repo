import { TextField, TextFieldProps } from "@mui/material";

export default function TField(props: TextFieldProps) {
    const ilp = props.InputLabelProps || {}
    const ip = props.InputProps || {}
    const fSize= ".75rem"
    const p:TextFieldProps = {
        fullWidth: true, 
        variant: 'outlined',
        size: "small",
        margin: 'dense',
        InputLabelProps: {sx: {fontSize:fSize}, ...ilp},
        InputProps: {sx: {fontSize: fSize}, ...ip},
        inputProps: {sx: {fontSize: fSize}},
        ...props
    }
    return (
        <TextField {...p}/>
    )
}