import {  Visibility, VisibilityOff } from "@mui/icons-material";
import { Box,  Button,  ButtonProps,  ClickAwayListener, FormHelperText, IconButton, TextFieldProps, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TField from "../../../components/t-field";
import Typo from "../../../components/typo";
import { confirmLabel, emailInfoText, emailLabel, passwordInfoText, passwordLabel, firstNameLabel, lastNameLabel } from "./text";

export default function NewUserView(){
    const {password, firstName, lastName, email} = useNewUserForm()
    const [ready, setReady] = useState<boolean>(false)
    const [apiError, setApiError] = useState("")
    useEffect(()=>{
        const hasErrors = [password.value.trim() === "", email.value === "", password.error, email.error]
        if(hasErrors.some(e => !!e)) setReady(false)
        else setReady(true)
    }, [password.value, password.error, email.error, email.value])


    return (
            <Box>
                <Box>
                    <Typo>Create new account</Typo>
                </Box>
                <Box>
                    <NameField label={firstNameLabel} value={firstName.value} onChange={firstName.set}/>
                    <NameField label={lastNameLabel} value={lastName.value} onChange={lastName.set}/>
                    <EmailField value={email.value} onChange={email.set} error={email.error} setError={email.setError}/>
                    <PasswordGroup value={password.value} onChange={password.set} error={password.error} setError={password.setError}/>
                </Box>
                <FormHelperText error margin="dense" sx={{fontSize:'.65rem', px:2}}>{apiError}</FormHelperText>
                <FormSubmitButton ready={ready}/>
            </Box>
    )
}

function useNewUserForm(){
    const ready = useState<boolean>(false)

    const firstName = useState<string>("")
    const lastName = useState<string>("")

    const email = useState<string>("")
    const emailError = useState<boolean>(false)

    const password = useState<string>("")
    const passwordError = useState<boolean>(false)


    return {
        ready: formatState(ready), 
        firstName: formatState(firstName),
        lastName: formatState(lastName),
        email: formatState(email, emailError),
        password: formatState(password, passwordError)
    }
}
function formatState(state: [any, React.Dispatch<React.SetStateAction<any>>], error?: [boolean, React.Dispatch<React.SetStateAction<boolean>>] ){
    return {
        value: state[0],
        set: state[1],
        error: error === undefined ? false : error[0],
        setError: error === undefined ? () => {} : error[1]
    }
}


type EmailProps = {
    value: string, 
    onChange: (v: string) => void,
    error: boolean, 
    setError: (v:boolean) => void
}
function EmailField(props: EmailProps){
    const onChange = (e:any) => {
        const v = e.target.value 
        props.onChange(v)
    }
    const onFocus = () => props.setError(false)
    const onBlur = (e:any) => {
        const v:string = e.target.value 
        if(!v.match(/^\S+@\w{2,}\.\S{2,4}$/)) return props.setError(true)
        props.setError(false)
    }
    const p:TextFieldProps = {
        value: props.value,
        error: props.error,
        label: emailLabel, 
        onChange, onBlur, onFocus

    }
    return (
        <Tooltip title={props.error ? emailInfoText : ""}>
            <>
                <TField {...p}/>
            </>
            
        </Tooltip>
    )
}

interface NameFieldProps {
    value: string, 
    label: string,
    onChange: (v:string) => void
}

function NameField(props: NameFieldProps) {
    const p:TextFieldProps = {
        value: props.value,
        label: props.label, 
        onChange: (e:any) => {
            props.onChange(e.target.value)
        }
    }
    return (
        <TField {...p}/>
    )
}



type PasswordGroupProps = {
    value: string 
    onChange: (value: string) => void, 
    error: boolean, 
    setError: (value:boolean) => void
}
function PasswordGroup(props: PasswordGroupProps) {
    const [view, setView] = useState<boolean>(false)
    const [confirm, setConfirm] = useState<string>("")
    const [error, setError] = useState(false)
    const viewProps = {fontSize: 'small',sx:{color: 'grey.600'}}
    const viewIcon = view ? <VisibilityOff {...viewProps as any}/> : <Visibility {...viewProps as any}/>
    const onViewClick = () => setView(p => !p)
    
    const onPasswordFocus = () => {
        props.setError(false)
    }

    const onPasswordChange = (e: any) => {
        const v = e.target.value 
        confirm === v && setError(false)
        props.onChange(v)
    }

    const onPasswordBlur = (e:any) => {
        let v:string = e.target.value 
        v = v.trim().replaceAll(/\s+/g, " ")
        if(v.length < 6) return props.setError(true)
        if(v.length > 50) return props.setError(true)
        if(!v.match(/[A-Z]+/g)) return props.setError(true)
        if(!v.match(/[a-z]+/g)) return props.setError(true)
        if(!v.match(/\d+/g)) return props.setError(true)
        props.setError(false)
    }

    const onConfirmChange = (e:any) => {
        const v = e.target.value 
        v === props.value ? setError(false) : setError(true)
        setConfirm(v)
    }

    const pProps:TextFieldProps = {
        value: props.value, 
        label: passwordLabel,
        type: view ? 'text': 'password',
        error: props.error, 
        onChange: onPasswordChange, 
        onFocus: onPasswordFocus, 
        onBlur: onPasswordBlur,
        InputProps: {endAdornment: <Tooltip title={passwordInfoText}><IconButton onClick={onViewClick} disableRipple>{viewIcon}</IconButton></Tooltip>}
    }

    const cProps: TextFieldProps = {
        ...pProps, 
        error, 
        value: confirm,
        label: confirmLabel,
        onChange: onConfirmChange
    }


    return (
        <ClickAwayListener onClickAway={() => setView(false)}>
            <Box>
                <TField {...pProps}/>
                <TField {...cProps}/>
            </Box>
        </ClickAwayListener>

    )
}


interface SubmitButtonProps{
    ready:boolean
}
function FormSubmitButton(props: SubmitButtonProps){
    const nav = useNavigate()
    const bProps:ButtonProps = {
        disabled: !props.ready,
        fullWidth: true, 
        variant: 'contained',
        size: 'small',
        onClick: async () => {
            /**Insert API Call */
            nav("/onboard/select-role")
        },
        sx: {mt:2}
    }
    return (
        <Button {...bProps}>Submit</Button>
    )
}