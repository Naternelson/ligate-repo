import { ArrowDropDown, Notifications } from "@mui/icons-material";
import { Paper, PaperProps, Toolbar, Box, IconButton, Badge, Tooltip, ButtonBase, BoxProps, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Row from "./row";

export default function DashboardHeader() {
    const wrapperProps:PaperProps={
        sx: {borderRadius: 0, width: 'inherit'},
        elevation:2
    }
    return (<>
        <Paper {...wrapperProps}>
            <Toolbar sx={{justifyContent: 'space-between', width: 'inherit'}}>
                <Row justifyContent={"center"} alignItems="end"><Typography variant="body2" sx={{color: 'grey.600', fontWeight: 'bold'}}>Demo Stake</Typography><ArrowDropDown/></Row>
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
    const nav = useNavigate()
    const boxProps:BoxProps= {
        p:1,
        sx:{bgcolor: "primary.main"}
    }
    return (
        <ButtonBase onClick={() => nav("/profile")}>
            <Tooltip arrow={true} title="User Profile">
                <Box {...boxProps}>
                    <Typography sx={{color: 'white'}}>NN</Typography>
                </Box>
            </Tooltip>
        </ButtonBase>
    )
}