import faker from "@faker-js/faker"
import { Check, CheckBox, Error } from "@mui/icons-material"
import { Box, Button, Typography, BoxProps, Grid, Divider } from "@mui/material"
import { borderColor } from "@mui/system"
import React, { useRef } from "react"
import createPDF from "../../services/create-pdf"
import PDFWrapper from "../../services/pdf-wrapper"
import { range } from "../../utility/range"

export default function CreatePDF(){
    const ref = useRef()
    const onClick = () => createPDF(ref)
    const stakeName = faker.address.streetName() + " YSA Stake"
    return (
        <Box>
            <Box sx={{display: 'flex', justifyContent: 'end'}}>
                <Button onClick={onClick}>
                    Create PDF
                </Button>
            </Box>


            <PDFWrapper containerProps={{sx:{display: 'flex', flexDirection: 'column', fontSize:8, flex: 1 }}} ref={ref}>
                <>
                    <PDFTitle title={stakeName}/>
                    {range(5).map(i => {
                        return <StakeSection title={stakeName}/>
                    })}
                </>
                
            </PDFWrapper>
            
        </Box>

    )
}

interface PdfTitleProps {
    title: string
}

function PDFTitle(props: PdfTitleProps){
    const location = "Ogden UT"
    return (
        <Box sx={{borderBottom:2, borderColor: 'grey.400',p:1}}>
            <Typography sx={{color: 'primary.dark', fontSize:"1rem"}} variant="h5">{props.title}</Typography>
            <Typography sx={{color: 'grey.700', lineHeight:1}} variant="caption">{location}</Typography>
        </Box>
    )
}

interface StakeSectionProps extends PdfTitleProps {}

function StakeSection(props: StakeSectionProps){
    
    const wrapperProps:BoxProps = {
        ml:2,
        borderBottom: 1,
        borderColor: 'grey.300',
        mb:2
    }
    const stakeName = faker.address.streetName() + " Stake"
    const location = faker.address.cityName() + " UT"
    return (
        <Box {...wrapperProps}>
            <Typography sx={{color: 'grey.70', fontSize: '.6rem'}} variant="h6">{stakeName}</Typography>
            <Typography sx={{color: 'grey.500', fontSize: '.4rem'}} variant="caption">{location}</Typography>
            <Box width="100%">
                <Typography align="center" sx={{width: '100%', letterSpacing: "1px", fontSize: '.5rem'}}>{"WITHIN " + props.title.toUpperCase()}</Typography>
                <MembersTable count={5} blanks={3}/>
            </Box>
            <Box width="100%" my={2}>
                <Typography align="center" sx={{width: '100%', letterSpacing: "1px", fontSize: '.5rem'}}>{"WITHIN " + stakeName.toUpperCase()}</Typography>
                <MembersTable count={5} blanks={3}/>
            </Box>
            <Divider/>
        </Box>
    )
}

interface MembersTableProps{
    count: number,
    blanks?:number
}
function MembersTable(props: MembersTableProps){
    const randomBool = () => (Math.random() - .5) >=0
    const randomInt = (int:number, from:number = 0) => Math.floor(Math.random() * int) + from 
    const itemSx = {sx: {color: 'grey.800', fontSize: '.5rem'}}
    return (
        <Box>
            <Grid container columnSpacing={1} bgcolor="#bddaf2" sx={{px:.3, py:.2,mb:.2, borderBottom: 1, borderColor:'grey.600', alignItems: 'center'}}>
                <Grid item xs={3} textAlign="left" {...itemSx}>Name</Grid>
                <Grid item xs={3} textAlign="left" {...itemSx}>Ward</Grid>
                <Grid item xs={2} textAlign="center" {...itemSx}>Address</Grid>
                <Grid item xs={2} textAlign="center" {...itemSx}>Activity Status</Grid>
                <Grid item xs={2} textAlign="center" {...itemSx}>Calling Status</Grid>
            </Grid>
            {range(randomInt(7,1)).map((i, index, arr) => {
                const name = faker.name.firstName() + " " + faker.name.lastName()
                const wardName = faker.address.streetName() + " Ward"
                const randomBoolIcon = () => randomBool() ? "True" : "False"
                const randomStatus = ()  => {
                    const choices = ["Active", "Non-attending", "Unknown"]
                    return choices[randomInt(choices.length)]
                }
                return <Grid container columnSpacing={1} sx={{p:.2, borderBottom:1, borderColor: 'grey.300'}} alignItems="center">
                    <Grid item xs={3} textAlign="left">{name}</Grid>
                    <Grid item xs={3} textAlign="left">{wardName}</Grid>
                    <Grid item xs={2} textAlign="center">{randomBoolIcon()}</Grid>
                    <Grid item xs={2} textAlign="center">{randomStatus()}</Grid>
                    <Grid item xs={2} textAlign="center" >{randomBoolIcon()}</Grid>
                </Grid>
            })}
            {range(props.blanks || 0).map((i, index, arr) => {
                const name = faker.name.firstName() + " " + faker.name.lastName()
                const wardName = faker.address.streetName() + "Ward"
                const randomBoolIcon = () => randomBool() ? "True" : "False"
                const randomStatus = ()  => {
                    const choices = ["Active", "Non-attending", "Unknown"]
                    return choices[randomInt(choices.length)]
                }
                return <Grid container columnSpacing={1} sx={{p:.2, borderBottom:1, borderColor: 'grey.300'}} alignItems="center">
                    <Grid item xs={3} textAlign="left" sx={{py:.8}}></Grid>
                    <Grid item xs={3} textAlign="left"></Grid>
                    <Grid item xs={2} textAlign="center"></Grid>
                    <Grid item xs={2} textAlign="center"></Grid>
                    <Grid item xs={2} textAlign="center" ></Grid>
                </Grid>
            })}
        </Box>
        
    )
}