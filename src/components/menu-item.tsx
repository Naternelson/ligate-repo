import { MenuItem, MenuItemProps } from "@mui/material";
import { PropsWithChildren } from "react";

export default function MenuListItem(props:PropsWithChildren<MenuItemProps>){
    const {children, ...mi} = props 

    const menuItemProps:MenuItemProps = {
        ...mi,
        sx:{fontSize: 'inherit', ...(props.sx||{})},
    }
    return (
    <MenuItem {...menuItemProps}>
        {children}
    </MenuItem>
    )
}