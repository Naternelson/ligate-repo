import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardLayout from "../views/dashboard/index";
import ReportView from "../views/dashboard/connections";
import CreatePDF from "../views/pdf";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"element={<DashboardLayout/>}>
                    <Route path="connections" element={<ReportView/>}/>
                    
                    <Route path="*" element={<Box>Hi there</Box>}/>
                </Route>
                <Route path="/pdf" element={<CreatePDF/>}/>
            </Routes>
        </BrowserRouter>
    )
}