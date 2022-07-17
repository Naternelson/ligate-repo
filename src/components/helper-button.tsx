import { ButtonBase, ButtonBaseProps, ButtonProps } from "@mui/material";
import { blue } from "@mui/material/colors";
import { PropsWithChildren } from "react";

export default function HelperButton(props:PropsWithChildren<ButtonBaseProps>){
    const {children, sx, ...otherProps} = props
    
    const p:ButtonBaseProps = { 
        ...otherProps,
        sx: {backgroundColor: 'primary.main', py:.75, px: 1, fontSize: '.6rem', color: blue['50'], borderRadius: 25, ...(sx||{})}
    }
    return (
        <ButtonBase {...p}>
            {children}
        </ButtonBase>
    )
}