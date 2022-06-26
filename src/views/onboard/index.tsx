import { BoxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import Column from "../../components/column";
import Row from "../../components/row";

export default function OnboardLayout(){
    const boxProps:BoxProps = {
        height: '100vh',
        bgcolor: '#ebeff2',
        justifyContent:"center",
        alignItems:'center'
    }
    const colP: BoxProps = {
        maxWidth: '300px',
        p:3,
        sx: {bgcolor: 'white'}
    }
    return (
        <Row {...boxProps}>
            <Column {...colP}>
                <Outlet/>
            </Column>
        </Row>
        
    )
}