import { Box, BoxProps } from "@mui/material"
import { Outlet } from "react-router-dom"
import Column from "../../components/column"
import DashboardHeader from "../../components/dashboard-header"
import DashboardSideBar from "../../components/dashboard-side-bar"
import Row from "../../components/row"

export default function DashboardLayout(){
    const boxProps:BoxProps = {
        height: '100vh',
        bgcolor: '#ebeff2'
    }
    return (
        <Row {...boxProps}>
            <DashboardSideBar/>
            <Column flex={1}>
                <DashboardHeader/>
                <Outlet/>
            </Column>
        </Row>

    )
}