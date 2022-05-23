import { ArrowDropDown, Notifications } from "@mui/icons-material";
import { Paper, PaperProps, Toolbar, Box, IconButton, Badge, Tooltip, ButtonBase, BoxProps, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Row from "./row";

export default function DashboardHeader() {
    const {name:stakeName} = useSelector((s:any) => s.currentStake.stake)
    const wrapperProps:PaperProps={
        sx: {borderRadius: 0, width: 'inherit'},
        elevation:2
    }
    return (<>
        <Paper {...wrapperProps}>
            <Toolbar sx={{justifyContent: 'space-between', width: 'inherit'}}>
                <Row justifyContent={"center"} alignItems="end"><Typography variant="body2" sx={{color: 'grey.600', fontWeight: 'bold'}}>{stakeName}</Typography><ArrowDropDown/></Row>
                <Row gap={2}>
                    <NotificationIcon/>
                    <ProfileIcon/>
                </Row>
                
            </Toolbar>
        </Paper>
    </>

    )
}

function NotificationIcon(){

    return <IconButton>
        <Tooltip arrow={true} title="Notifications">
            <Badge variant="dot" color="secondary"><Notifications/> </Badge>
        </Tooltip>
    </IconButton>
}

function ProfileIcon(){
    const {name, profileImg} = useSelector((s:any) => s.user)
    const nav = useNavigate()
    const boxProps:BoxProps= {
        p:1,
        sx:{bgcolor: "primary.main"}
    }
    const display = String(name?.first || "" + name?.last || "")
    return (
        <ButtonBase onClick={() => nav("/settings")}>
            <Tooltip arrow={true} title="User Profile">
                <Box>
                    {profileImg && <Avatar src={profileImg} alt="profile"/>}
                    {!profileImg && <Box {...boxProps}>
                        <Typography sx={{color: 'white', textTransform: "capitalize" }}>{display}</Typography>
                    </Box>}
                </Box>
            </Tooltip>
        </ButtonBase>
    )
}

type AvatarProps = BoxProps & {src:string, alt:string}
function Avatar(props: AvatarProps){
    const boxProps:BoxProps<"img"> = {
        component:"img",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        src: props.src, 
        alt: props.alt
    }
    return (
        <Box {...boxProps}/>
    )
}