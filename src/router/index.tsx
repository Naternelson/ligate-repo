import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import DashboardLayout from "../views/dashboard";

export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"element={<DashboardLayout/>}>
                    <Route path="*" element={<Box>Hi there</Box>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}