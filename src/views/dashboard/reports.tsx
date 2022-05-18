import { Box, BoxProps, ButtonBase, Typography } from "@mui/material";
import Column from "../../components/column";
import ReportListener, { useReportContext } from "../../listeners/report-view";

export default function ReportView(){
    const wrapperProps:BoxProps = {
        overflow: 'auto'
    }
    return (
        <ReportListener>        
            <Box {...wrapperProps}>
                <Column>
                    <StakeList/>
                </Column>
            </Box>
        </ReportListener>
    )
}

function StakeList() {
    const {stakes} = useReportContext()
    if(!stakes) return null
    return (
        <Column>
            {Object.values(stakes).map((obj:any) => {
                return <ButtonBase key={obj.id} sx={{width: '100%'}}>
                    <Typography>{obj.name.data}</Typography>
                </ButtonBase>
            })}
        </Column>
    )
}