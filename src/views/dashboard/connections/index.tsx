import { Box, BoxProps, Typography, Divider } from "@mui/material";
import AppTabWrapper, { AppTabs, AppTab, TabPanel } from "../../../components/app-tabs";
import Column from "../../../components/column";
import ReportListener from "../../../listeners/report-view";
import Overview from "./overview";

export default function ConnectionsView(){
    const wrapperProps:BoxProps = {
        overflow: 'auto'
    }
    return (
        <ReportListener>        
            <Box {...wrapperProps}>
                <Column>
                <AppTabWrapper>
                    <TitleBlock/>
                    <TabPanel value={0}>
                        <Overview/>
                    </TabPanel>
                    </AppTabWrapper>
                </Column>
            </Box>
        </ReportListener>
    )
}


function TitleBlock(){
    const wrapperProps:BoxProps = {
        mx:3,
        mt:3
    }
    return (
        <Box {...wrapperProps}>
            <Typography variant="h1" sx={{color: "rgba(0,0,0,.5)", fontSize: "2.5rem"}}>Connections</Typography>
            <AppTabs>
                <AppTab label={"Overview"}/>
                <AppTab label={"In my stake"}/>
                <AppTab label={"Out of my stake"}/>
            </AppTabs>
            <Divider/>
        </Box>
        
    )
}

