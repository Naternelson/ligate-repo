import faker from "@faker-js/faker";
import { ArrowDropDown } from "@mui/icons-material";
import { Box, ButtonBase, Collapse, CollapseProps, ListItem, ListItemText, Paper, Stack, Typography, TypographyProps } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ListItemCollapse, { ListItemCollapseProps } from "../../../components/list-item-collapse";
import Typo from "../../../components/typo";
import { range } from "../../../utility/range";

export default function HomeView(){
    
    return (
        <Box display={'flex'} flexDirection="column" gap={2} py={2}>
            <StakeHeaderBar/>
            <WardList/>
        </Box>
    )
}

function StakeHeaderBar(){
    const {name:stakeName} = useSelector((s:any) => s.currentStake.stake)
    const titleProps: TypographyProps = {variant: 'h1', align: 'center', sx: {fontSize: "2rem", color: 'grey.700'}}
    return (
        <Paper>
            <Box py={2}>
                <Typography {...titleProps}>{stakeName}</Typography>
            </Box>
            
        </Paper>
    )
}

function WardList(){
    const [focus, setFocus] = useState<number>(-1)
    const [selected, setSelected] = useState<{[key: number]: boolean}>(dummyWards.reduce((obj, _ward, i) => {
        return {...obj, [i]: false}
    }, {}))
    
    return (
        <Paper>
            <Stack>
               {dummyWards.map((w, i, arr) => {
                    const wardListItemProps: WardListItemProps = {
                        title:w, selected: i === focus, divider: !lastEl(i, arr),
                        onClick: () => {
                            setSelected((p) => ({...p, [i]: !p[i]}))
                            setFocus(p => p === i ? -1 : i)
                        }
                    }
                    return <WardListItem key={i} {...wardListItemProps}/>
               })} 
            </Stack>
        </Paper>
    )
}

type WardListItemProps = {title: string, selected: boolean, onClick: any, divider?: boolean}
function WardListItem(props:WardListItemProps){
    const {title, selected, onClick, divider} = props 
    const liColl: ListItemCollapseProps = {
        primary: <Typography>{title}</Typography>,
        enter: selected, 
        onClick,
        divider 
    }
    return (
        <ListItemCollapse {...liColl}>
            <Box>
                <Typo>Hi there!!</Typo>
            </Box>
        </ListItemCollapse>)
}



const dummyWards = range(10).map(()=> faker.address.streetName() + ' YSA Ward')
const lastEl = (index:number, arr: Array<any>) => {
    return index === (arr.length - 1)
}

const dummyMembers = dummyWards.map(() => {
    return range(10).map(()=>{
        const hasCalling = Math.random() >= .5
        return {
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            activity: Math.random() >= .5,
            address: Math.random() >= .66,
            hasCalling, 
            calling: hasCalling && faker.word.noun()
        }
    })
})