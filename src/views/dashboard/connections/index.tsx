import { ArrowRight } from "@mui/icons-material";
import { Box, BoxProps, ButtonBase, ListItemText, Typography, ListItem, Paper, TextField, Stack, ListItemIcon, Tabs, Tab, Divider, Button } from "@mui/material";
import { useState } from "react";
import AppTabWrapper, { AppTabs, AppTab, TabPanel } from "../../../components/app-tabs";
import Column from "../../../components/column";
import ReportListener, { useReportContext } from "../../../listeners/report-view";
import { clear } from "../../../models/firestore-test";
import seed from "../../../models/seed";

export default function ConnectionsView(){
    const [active, setActive] = useState<string|null>(null)
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
                        <OverviewBlock/>
                    </TabPanel>
                    {/* <Paper sx={{m:3}}>
                        <Row>
                            <StakeList active={active} setActive={setActive}/>
                            <MemberSection  active={active}/>
                        </Row>
                    </Paper> */}
                    </AppTabWrapper>
                </Column>
            </Box>
        </ReportListener>
    )
}


function TitleBlock(){
    const wrapperProps:BoxProps = {
        p:3
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

function OverviewBlock(){
    return (
        <Box sx={{mx:5}}>
            <Button onClick={()=> seed() }>Seed</Button>
            <Button onClick={()=> clear() }>Clear</Button>
        </Box>
    )
}



interface StakeListProps{
    setActive: any, 
    active:null |string
}
function StakeList(props:StakeListProps) {
    const {stakes} = useReportContext()
    if(!stakes) return null
    return (
            <Column sx={{p:2}} gap={1} >
                <Typography variant="body2" align="center">Stakes</Typography>
                <TextField variant="standard" margin={"none"} size={"small"} inputProps={{sx: {fontSize: '.85rem',p:.25}}} placeholder="search"/>
                <Stack  gap={0.1}>
                    {Object.values(stakes).map((obj:any, index:number, arr:any[]) => {
                        const isLast = (index === (arr.length-1))
                        return <ButtonBase onClick={()=> props.setActive(obj.id)} key={obj.id} sx={{width: '100%'}}>
                            <ListItem divider={!isLast} sx={{py:0}} selected={props.active === obj.id}>
                                <ListItemText primaryTypographyProps={{sx:{fontSize: '.8rem'}}} primary={obj.name.data}/>
                                <ListItemIcon><ArrowRight/></ListItemIcon>
                            </ListItem>
                        </ButtonBase>
                    })}
                </Stack>

            </Column>


    )
}

function MemberSection(props:any){

    const [view, setView] = useState(0)
    return (
        <Box>
            <Typography>Members</Typography>
            <Tabs value={view}onChange={(_e:any, newValue:number) => setView(newValue)}>
                <Tab label={"Inside"}/>
                <Tab label={"Outside"}/>
            </Tabs>
            {view === 0 && <MyMembers/>}
        </Box>
    )
}

function MyMembers(){
    const {myMembers}  = useReportContext()

    return (
        <Stack>

        </Stack>
    )
}