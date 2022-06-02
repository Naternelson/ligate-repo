import { Box, BoxProps } from "@mui/material";
import { forwardRef, PropsWithChildren, PropsWithRef } from "react";

interface PDFWrapperProps {
    containerProps?: BoxProps,
    width?: number, 
    height?: number, 
}
const PDFWrapper = forwardRef((props:PropsWithChildren<PDFWrapperProps>, ref) => {
    const {children, containerProps, width, height} = props
    const wWidth = width ? toPt(width) : toPt(8.5-2)
    const wHeight = height ? toPt(height) : toPt(11-2)
    const wrapperProps:BoxProps ={
        width: wWidth,
        minHeight: wHeight
    }
    const wrapperWrapper:BoxProps = {
        visibility: 'visible',
        maxWidth: "100vw",
        maxHeight: "100vh",
        position: 'absolute',
        top: 0,
        zIndex: -1000,
        overflow: 'hidden'

    }
    return (
        <Box {...wrapperWrapper}>
            <Box {...wrapperProps}>
                <Box ref={ref} {...(containerProps||{})}>
                    {children}
                </Box>
            </Box>
        </Box>

    )
})
export default PDFWrapper

const toPt = (inches:number) => inches * 72