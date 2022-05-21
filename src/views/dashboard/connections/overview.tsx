import { ArrowRight, Print } from "@mui/icons-material";
import { Box, BoxProps, Button, ButtonProps, Menu, MenuItem, MenuProps, Paper, PaperProps, Tooltip, Typography, TypographyProps } from "@mui/material";
import { useState } from "react";
import Column from "../../../components/column";
import MenuListItem from "../../../components/menu-item";
import Row from "../../../components/row";

export default function Overview(){
    const columnProps:BoxProps = {
        mx:3
    }
    return (
        <Column {...columnProps}>
            <Row>
                <StakeFinderBar/>
            </Row>
        </Column>
    )
}

function StakeFinderBar(){
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
                    <Tooltip arrow={true} title="Number of Stake Connections" placement="right">
                        <Box>
                            <Row {...counterProps}>
                                <ArrowRight fontSize="small" sx={{color: 'secondary.light'}} />
                                10 Stakes
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
                        Print Report
                    </MenuListItem>
                </Column>
            </Menu>
        </>
    )
}