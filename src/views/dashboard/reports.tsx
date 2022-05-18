import { ArrowRight } from "@mui/icons-material";
import { Box, BoxProps, ButtonBase, ListItemText, Typography, ListItem, Paper, TextField, Stack, ListItemIcon, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import Column from "../../components/column";
import Row from "../../components/row";
import ReportListener, { useReportContext } from "../../listeners/report-view";

export default function ReportView(){
    const [active, setActive] = useState<string|null>(null)
    const wrapperProps:BoxProps = {
        overflow: 'auto'
    }
    return (
        <ReportListener>        
            <Box {...wrapperProps}>
                <Column>
                    <Paper sx={{m:3}}>
                        <Row>
                            <StakeList active={active} setActive={setActive}/>
                            <MemberSection  active={active}/>
                        </Row>
                    </Paper>
                </Column>
            </Box>
        </ReportListener>
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