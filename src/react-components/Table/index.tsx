import { Box } from "@mui/material"
import { TableBody } from "./body"
import useTable, { TableProps, TableContext } from "./context"
import { Header } from "./header"


export default function Table(params: TableProps){
    const value = useTable(params)
    return (
        <Box width="100%" height={'100%'}>
            <TableContext.Provider value={value}>
                <Header/>
                <TableBody/>
            </TableContext.Provider>
        </Box>

    )
}
