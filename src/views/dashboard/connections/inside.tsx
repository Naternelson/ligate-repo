import { Box, BoxProps, Grid, Menu, MenuProps, Paper, PaperProps, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Column from "../../../components/column";
import DropDownMenu from "../../../components/drop-down-menu";
import MenuListItem from "../../../components/menu-item";
import Row from "../../../components/row";
import { AppDispatch, RootState } from "../../../store";
import { stakesAction } from "../../../store/stakes/slice";
import {useStakeMembers} from "../../../store/members/slice"

export default function InsideConnections(){
    const columnProps:BoxProps = {
        mx:3,
        pb:3
    }
    return (
        <Column {...columnProps}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <ActionBar/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MemberSection />
                </Grid>
                
            </Grid>
        </Column>
    )
}

function ActionBar(){
    const paperProps:PaperProps = {
        sx:{p:1, mt:3, mb:2, fontSize: ".8rem"},
        elevation:2
    }
    return (
        <Paper {...paperProps}>
            <StakeChoiceMenu/>
        </Paper>
    )
}

function MemberTable(){
    const focus = useSelector((s:RootState) => s.stakes.focus)
    const stakeMembers = useStakeMembers(focus||undefined)
    return(
        <Stack>
            
        </Stack>
    )
}

function StakeChoiceMenu(){
    const dispatch:AppDispatch = useDispatch()
    const focus = useSelector((s:RootState) => s.stakes.focus)
    const stakes = useSelector((s:RootState) => s.stakes.data)
    const stakeValues = useMemo(()=>{
        return Object.values(stakes).map(stake => {
            const {name, id} = stake 
            if(name && id) return {id, name}
            return null 
        })
    }, [Object.keys(stakes), Object.values(stakes)])
    const onClickHandler = (id:string) => () => {
        dispatch(stakesAction.focusStake(id))
    }
    const stakeName = !!focus ? (stakes[focus].name || "No Name Provided") : "Stakes"
    return (
        <DropDownMenu title={stakeName} menuProps={{anchorOrigin: {vertical: 'bottom', horizontal:'left'}, transformOrigin: {vertical: 'top', horizontal: 'left'}}}>
            {stakeValues.map(stake => {
                if(stake === null) return null 
                return <MenuListItem divider={true} key={stake.id} onClick={onClickHandler(stake.id)}>{stake.name}</MenuListItem>
            })}
        </DropDownMenu>
    )
}


function MemberSection(){
    return (
        <Column>
            "Im a member"
        </Column>
    )
}