import { ArrowRight, Delete, Print } from "@mui/icons-material";
import { Box, BoxProps, Button, ButtonProps, Menu, Stack, MenuProps, Paper, PaperProps, Tooltip, Typography, TypographyProps, Grid, ListItem, Checkbox, CheckboxProps, IconButton, ListItemProps, ButtonBase } from "@mui/material";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Column from "../../../components/column";
import MenuListItem from "../../../components/menu-item";
import Row from "../../../components/row";
import { UnitType } from "../../../store/current-stake/slice";
import { stakesAction} from "../../../store/stakes/slice";

export default function Overview(){
    const columnProps:BoxProps = {
        mx:3,
        pb:3
    }
    return (
        <Column {...columnProps}>
            <Row>
                <StakeFinderBar/>
            </Row>
            <Row>
                <StakeList/>
            </Row>
        </Column>
    )
}

function StakeFinderBar(){
    const stakes = useSelector((s:any) => s.stakes.data)
    const stakeCount = Object.keys(stakes).length
    const paperProps:PaperProps = {
        sx:{p:1, mt:3, mb:2, width: {xs: '100%', md: '50%',  lg: '30%'}},
        elevation:5,
        
    }
    const tProps:TypographyProps = {
        sx:{fontSize: '.9rem'}
    }
    const counterProps:BoxProps = {
        sx:{fontSize: '.7rem', color:"secondary.main", alignItems:'center', justifyContent:'center'}
    }
    const rowProps:BoxProps = {
        gap:2,
        justifyContent:'space-between'
    }

    return (
        <Paper {...paperProps}>
            <Row {...rowProps}>
                <Box>
                    <Typography {...tProps}>Stakes</Typography>
                    <Tooltip arrow={true} title="Number of Stake Connections">
                        <Box>
                            <Row {...counterProps}>
                                <ArrowRight fontSize="small" sx={{color: 'secondary.light'}} />
                                {!!stakeCount && stakeCount > 1  && `${stakeCount} Stakes`}
                                {!!stakeCount && stakeCount === 1  && `${stakeCount} Stake`}
                                {!stakeCount && "- Stakes"} 
                            </Row>
                        </Box>
                    </Tooltip>
                </Box>
                <PrintReportButton/>
            </Row>

            
        </Paper>
    )
}


function PrintReportButton(){
    const [anchor,setAnchor] = useState<null | HTMLButtonElement>(null)
    const selected: {[id:string]: boolean} = useSelector((s:any) => s.stakes.selected)
    const hasSelected = Object.values(selected).some((s:boolean) => !!s)
    const open = !!anchor
    const reportButton:ButtonProps = {
        variant: 'text',
        disableRipple:true, 
        disableFocusRipple:true,
        size: 'small',
        endIcon: <Print fontSize="small"/>,
        sx: {textTransform: 'none', fontSize: '.7rem', px: .5, m:0,  lineHeight: 1, color: 'grey.600'},
        onClick:(e) => setAnchor(e.currentTarget)
    }
    const menuProps:MenuProps = {
        open,
        anchorEl: anchor,
        onClose: () => setAnchor(null),
        MenuListProps: {sx:{p:0,m:0, fontSize: '.7rem', bgcolor: 'rgba(0,0,0,.01'}},
        anchorOrigin:{
            vertical: 'bottom',
            horizontal: 'right'
        },
        transformOrigin:{
            vertical: 'top',
            horizontal: 'right'
        }
    }
    return (
        <>
            <Button {...reportButton}>
                Print
            </Button>
            <Menu {...menuProps}>
                <Column>
                    <MenuListItem divider={true} disableRipple>
                        Print All
                    </MenuListItem>
                    {!!hasSelected && <MenuListItem divider={true} disableRipple>
                            Print Selected
                        </MenuListItem>
                    }
                </Column>
            </Menu>
        </>
    )
}


function StakeList(){
    const stakes = useSelector((s:any) => s.stakes.data)
    const stakeIds:string[] = Object.keys(stakes)
    return (
        <Paper sx={{width: '100%', display: 'flex',pb:1}}>
            <Column sx={{flex: 1}}>
                <StakeHeader/>
                {stakeIds.map((id, index, arr) => {
                    const notLast = index !== (arr.length -1)
                    return <StakeItem key={id} id={id} divider={notLast}/>
                })}
            </Column>
        </Paper>

    )
}


function StakeHeader(){
    const dispatch = useDispatch()
    const stakes = useSelector((s:any) => s.stakes.data)
    const selected = useSelector((s:any) => s.stakes.selected)
    const selectedValues = Object.values(selected)
    const ids = Object.keys(stakes)
    const [checked, indeterminate] = useMemo(()=>{
        const numSelected = selectedValues.reduce((count:number, value) => count = value ? count+1 : count, 0)
        const totalNumber = ids.length
        const hasSelected = numSelected > 0
        const allSelected = numSelected === totalNumber
        const checked = allSelected && hasSelected 
        const indeterminate = !checked && hasSelected 
        return [checked, indeterminate]
    }, [selectedValues, ids])


    const checkboxProps:CheckboxProps = {
        disableRipple:true, 
        size: 'small',
        checked:checked,
        indeterminate,
        sx:{p:0},
        onClick:() => {
            if(checked || indeterminate) dispatch(stakesAction.unselectAll())
            else dispatch(stakesAction.selectAll())
        }
    }
    const listItemProps:ListItemProps = {
        disablePadding: true,
        divider:true,
        sx:{fontSize: '.8rem', flex:1, px:{xs: 1, md: 5},mb:1, color: 'grey.700', fontWeight: 'bold', py:1, bgcolor: 'rgba(156, 39, 176, 0.15)',},
        onDoubleClick: (...args) => {
            console.log(args)
        }
    }
    return (
        <ListItem {...listItemProps}>
                <Grid container gap={1} sx={{ justifyContent:'start'}}>
                    <Grid item>
                        <Row alignItems= 'center' justifyContent= 'center'>
                            <Checkbox {...checkboxProps}/>
                        </Row>
                    </Grid>
                    <Grid item xs={4}>
                        <Row alignItems= 'center' >
                            Stake Name
                        </Row>
                    </Grid>
                    <Grid display={{xs: "none", md: "block"}} item xs={4}>
                        <Row alignItems= 'center'>
                            Address
                        </Row>
                    </Grid>
                    
                    <Grid item xs>
                        <Row alignItems= 'center' justifyContent= 'end' gap={1}>
                            Actions
                        </Row>
                    </Grid>
                </Grid>
        </ListItem>
    )
}

type StakeListItem = {id:string, divider?:boolean} & BoxProps
function StakeItem(props: StakeListItem){
    const dispatch = useDispatch()
    const stake = useSelector((s:any) => s.stakes.data[props.id])
    const selected = useSelector((s:any) => s.stakes.selected[props.id]) || false 
    const checkboxProps:CheckboxProps = {
        disableRipple:true, 
        size: 'small',
        checked:selected,
        sx:{p:0},
        onClick:() => {
            selected && dispatch(stakesAction.unselectStakes([props.id]))
            !selected && dispatch(stakesAction.selectStakes([props.id]))
        }
    }
    const onDeleteClick = () => {
        dispatch(stakesAction.removeStakes([props.id]))
    }
    const listItemProps:ListItemProps = {
        disablePadding: true, 
        divider: props.divider, 
        selected,
        sx:{fontSize: '.8rem', flex:1, px:{xs: 1, md: 5}, py:.25},
        onDoubleClick: (...args) => {
            console.log(args)
        }
    }
    return (
        <ListItem {...listItemProps}>
                <Grid container gap={1} sx={{ justifyContent:'start'}}>
                    <Grid item>
                        <Row alignItems= 'center' justifyContent= 'center' gap={1}>
                            <Checkbox {...checkboxProps}/>
                        </Row>
                    </Grid>
                    <Grid item xs={8} md={4}>
                        <ButtonBase sx={{fontSize: 'inherit'}} disableRipple>
                            <Row alignItems= 'center' gap={1}>
                                <UnitTypeIcon type={stake.type} language={stake.language}/>
                                {stake.name}
                                
                            </Row>
                        </ButtonBase>
                    </Grid>
                    <Grid item display={{xs: "none", md: "block"}} md={4}>
                        <Row alignItems= 'center'>
                            {`${stake.address.city}, ${stake.address.state} `}
                        </Row>
                    </Grid>
                    
                    <Grid item xs>
                        <Row alignItems= 'center' justifyContent= 'end' gap={1}>
                            <IconButton sx={{p:0}} onClick={() =>{}}>
                                <Print fontSize="small" sx={{fontColor: 'grey.600'}}/>
                            </IconButton>
                            <Tooltip title="Remove Stake">
                                <IconButton sx={{p:0}} onClick={onDeleteClick}>
                                    <Delete fontSize="small" sx={{fontColor: 'grey.600'}}/>
                                </IconButton>
                            </Tooltip>
                        </Row>
                    </Grid>
                </Grid>
        </ListItem>

    )
}


type UnitTypeIconProps = {type: Exclude<UnitType, null>, language?:string}
function UnitTypeIcon(props:UnitTypeIconProps){
    const {type} = props
    let title:string = props.type
    let displayText = ""
    let bgcolor = ""
    switch(type){
        case 'Standard':
            displayText = "ST"
            bgcolor = "primary.main"
            break;
        case "YSA":
            displayText = "YSA";
            bgcolor = "warning.main"
            break;
        case "Married Student":
            displayText = "MS"
            bgcolor = "info.main"
            break
        case "Single Adult":
            displayText = "SA"
            bgcolor = "warning.dark"
            break
        case "Special Language" : 
            displayText = "SL"
            title = props.language ? `${title}: ${props.language}` : title
            bgcolor = "secondary.main"
            break;
        case "Temp" : 
            displayText = "TP"
            title = "Temp Stake"
            bgcolor = "grey.700"
            break;
        default :
            displayText = "OT"
            bgcolor = "grey.600"
    }
    const boxProps:BoxProps = {
        bgcolor, 
        borderRadius: '50%',
        width: "20px",
        height: "20px",
        fontSize: '.6rem',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    }
    return (
        
            <Row {...boxProps}>
                <Tooltip arrow={true} title={title} placement="right">
                    <Typography sx={{fontSize:".5rem", lineHeight:1}}>{displayText}</Typography>
                </Tooltip>
            </Row>
        
    )
}