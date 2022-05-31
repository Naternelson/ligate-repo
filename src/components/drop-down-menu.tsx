import { ArrowDropDown } from "@mui/icons-material";
import { MenuProps, ButtonBase, Menu, ButtonBaseProps } from "@mui/material";
import { PropsWithChildren, ReactNode, useState } from "react";
import MenuListItem from "./menu-item";

type DropDownMenuProps = {
    buttonProps?: Exclude<ButtonBaseProps, "onClick">
    menuProps?: Exclude<Partial<MenuProps>, "onClose">
    title:string,
    endIcon?: ReactNode,
    startIcon?: ReactNode,
    position?: "top-left" | "top" | "top-right" | "right" | "bottom-right" | "bottom" | "bottom-left" | "left"
}

export default function DropDownMenu(props:PropsWithChildren<DropDownMenuProps>){
    const {children, title, menuProps, endIcon, startIcon, buttonProps, position} = props 
    const [anchor, setAnchor] = useState<HTMLButtonElement|null>(null)
    const mProps:MenuProps = {
        open: !!anchor, 
        onClose: () => setAnchor(null),
        anchorEl: anchor, 
        anchorOrigin: {
            vertical: "bottom",
            horizontal: 'right'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'right'
        }, 
        MenuListProps: {
            dense: true, 
            sx:{p:0,m:0, fontSize: '.7rem', bgcolor: 'rgba(0,0,0,.01'}
        },
        onClick:() => setAnchor(null),
        ...(menuProps||{})
    }
    
    const bProps:ButtonBaseProps = {
        disableRipple: true, 
        sx:{fontSize: 'inherit', fontColor: 'grey.600'},
        onClick: (e) => {
            setAnchor(e.currentTarget)
        },
        ...(buttonProps||{})
    }
    return (
        <>
            <ButtonBase {...bProps}>
                {!!startIcon ? startIcon : null}
                {title}
                {!!endIcon ? endIcon : <ArrowDropDown fontSize="small"/>}
            </ButtonBase>
            <Menu {...mProps}>
                {!!children && children}
            </Menu>
        </>
    )
}

// function PositionProps(position:DropDownMenuProps["position"]){
//     if(position===undefined) return {}
//     const isBottom = ["bottom", "bottom-left", "bottom-right"].includes(position)
//     const isTop = !isBottom 
//     const isLeft = ["left", "bottom-left", "top-left"].includes(position)
//     const isRight = !isLeft
//     const transformOrigin:MenuProps["transformOrigin"] = {
//         vertical: []
//     }
// }