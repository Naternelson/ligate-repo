import { Home, Settings, ChatBubble, Feed } from "@mui/icons-material";
import { Badge, Box, BoxProps, ButtonBase, Divider, IconButton, IconButtonProps, Paper, PaperProps, Stack, Tooltip, Typography } from "@mui/material";
import { ReactElement, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Column from "./column";

export default function DashboardSideBar(){
    const wrapper:PaperProps = {
        sx:{
            height: '100%',
            bgcolor: '#1d3b59',
            color: 'white',
        }
    }
    return (
        <Paper {...wrapper}>
            <SmallDisplay/>
        </Paper>
    )
}

function SmallDisplay(){
    const boxProps:BoxProps = {
        sx:{
            display: displayOn("xs","sm", "md", "lg", "xl"),
            width: '75px',
            bgcolor: 'inherit',
            overflow: 'auto'
        }
    }
    return (
        <Box {...boxProps}>
                <LigateLogo/>
                <LightDivier/>
                <ButtonLink title="Home" to="/" icon={<Home/>}/>
                <ButtonLink title="Settings" to="/settings" icon={<Settings/>}/>
                <LightDivier/>
                <Stack sx={{mt:1}}>
                    <ButtonLink title="Messages"  to="/chats" icon={<Badge color={"secondary"} variant={"dot"}><ChatBubble/> </Badge>}/>
                    <ButtonLink title="Stake Connections"  to="/connections" icon={<Feed/>}/>
                </Stack>
        </Box>
    )
}

interface ButtonLinkProps{
    title:string, 
    icon: ReactElement, 
    to: string
}
function ButtonLink(props: ButtonLinkProps){
    const location = useLocation()
    const navigate = useNavigate()
    const active = location.pathname === props.to
    const buttonProps:IconButtonProps = {
        onClick: () => navigate(props.to),
        sx: {textAlign: 'center', width: "100%", color:  active ? 'rgba(255,255,255,.90)' : 'rgba(255,255,255,.40)'}

    }
    return (
        <IconButton {...buttonProps}>
            <Tooltip title={props.title} arrow={true} placement={"right"}>
                {props.icon}
            </Tooltip>
        </IconButton>
    )
}

function LigateLogo(){
    const navigate = useNavigate()
    const boxProps:BoxProps= {
        width: '100&',
        textAlign: 'center'
    }
    const onClick = () => navigate("/")
    return (
        <Box {...boxProps}>
            <Tooltip title="Ligate" arrow={true} placement={"right"}>
                <ButtonBase onClick={onClick} sx={{p:1,m:0, width: '100%'}}>
                    <Typography sx={{color: 'warning.light', fontSize: '1.75rem', fontWeight: 'bold'}}>L</Typography>
                </ButtonBase>
            </Tooltip>

        </Box>
    )
}


function displayOn(...size:string[]){
    const display = {xs: 'none', sm: 'none', md: 'none', lg: 'none', xl: 'none'}
    const newDisplay = size.reduce((obj, s) => ({...obj, [s]: "block"}),{})
    return {...display, ...newDisplay }
}

function LightDivier(){
    return <Divider sx={{borderColor: 'rgba(117,117,117,.5)'}}/>
}
