import faker from "@faker-js/faker"
import { margin } from "@mui/system"
import pdf from "jspdf"
export default function createPDF(ref: React.MutableRefObject<any>){
    // console.log(ref.current.outerHTML)
    const doc = new pdf({unit: 'pt',format: 'letter'})
    doc.html(ref.current, {
        callback: (doc) => {
            addFooter(doc)
            addHeader(doc, true)
            doc.setProperties({title: 'Ligate Report'})
            doc.output("dataurlnewwindow", {filename: ('ligate-report-' + new Date().toISOString())})
        },
        margin: [72,72,72,72],
        

    })
}

function addFooter(doc:pdf){
    const pageCount = doc.getNumberOfPages()
    doc.setFontSize(8)
    for(let i = 1; i <=pageCount; i++) {
        doc.setPage(i)
        const text = "- LIGATE -\n" + 'Page ' + String(i) + ' of ' + String(pageCount)
        const x = toPt(8.5) /2 
        const y = toPt(11-.5)
        doc.text(text, x, y, {align: 'center'})
    }
}

function addHeader(doc:pdf, ignoreFirstPage:boolean=false){
    const pageCount = doc.getNumberOfPages()
    for(let i = 1; i <=pageCount; i++) {
        if(!ignoreFirstPage || i > 1 ){
            doc.setPage(i)
            doc.setFontSize(11)
            doc.setTextColor("#757575")
            const text = "LIGATE"
            const x = toPt(1) 
            const y = toPt(0.75)
            doc.text(text, x, y, {align: 'left', baseline: 'bottom'})
        }
    }
}

const toPt = (inches:number) => inches *72