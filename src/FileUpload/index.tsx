import { Button,Box, TextField, Input } from "@mui/material";
import { getApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions, httpsCallable } from "firebase/functions";
import { useRef, useState } from "react";
import  parseCSV  from "./parseCSV";

export default function FileUploadField() {
    const [file, setFile] = useState<string | File>("")
    const onSubmit = () => {
        const formData = new FormData()
        formData.append("file", file)
        const fns = getFunctions()
        if(typeof file !== "string") parseCSV(file).then((result) => {
            // console.log(result)
        }).catch((e) => console.error(e))
        // connectFunctionsEmulator(fns, "localhost", 5000)
        // const csvFileUpload = httpsCallable(fns, "csvFileUpload")
        
        // console.log(formData.getAll("file")) 

        // csvFileUpload(formData).then(res => {
        //     console.log(res)
        // }).catch(err => {
        //     console.error(err)
        // })
    }
    const fileInput = useRef<any>(null)
    const handleFileInput = (e:any) => {
        const target = e.target.files[0]
        setFile(target)
    }   

    // const buttonClick = () => {
    //     console.log(fileInput)
    //     console.log(fileInput.current.click)
    //     if(fileInput.current) fileInput.current.click() 
    // }

    return (
        <Box>
            <Input ref={fileInput} type="file" onChange={handleFileInput}/>
            <Button onClick={onSubmit}>Click Me</Button>
        </Box>    
    )
} 