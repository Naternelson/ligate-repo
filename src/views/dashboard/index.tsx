import { Box, BoxProps } from "@mui/material"
import { Outlet } from "react-router-dom"
import DashboardSideBar from "../../components/dashboard-side-bar"
import Row from "../../components/row"

export default function DashboardLayout(){
    const boxProps:BoxProps = {
        height: '100vh',
        bgcolor: '#c9cdd1'
    }
    return (
        <Row {...boxProps}>
            <DashboardSideBar/>
            <Outlet/>
        </Row>

    )
}