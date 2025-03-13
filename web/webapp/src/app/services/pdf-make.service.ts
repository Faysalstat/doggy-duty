import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root'
})
export class PdfMakeService {

  constructor() { }
  public async downloadWorkOrder(workOrder:any,date:string){
    const doc = new jsPDF();
    await this.buildWorkOrder(doc,workOrder);
    return doc.save("workOrder_"+date+"Printing_Copy");

  }
  async buildWorkOrder(doc:any,workOrder:any) {
    autoTable(doc, {
      body: [
        [
          {
            content: 'Doggy Duty',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#787878'
            }
          },
        ],
      ],
      theme: 'plain',
      // styles: {
      //   fillColor: '#3366ff'
      // }
    });
    autoTable(doc, {
      head: [['SN', 'Comunity Name', 'Address', 'Manager','Contact No', 'Garbage Bins QNT', 'Pet Station QNT']],
      body:workOrder.orders,
      theme: 'striped',
      headStyles:{
        fillColor: '#787878'
      }
    });
  
    
  }
}
