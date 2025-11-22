import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root',
})
export class PdfMakeService {
  constructor() {}
  public async getPDF(workOrder: any, date: string) {
    const doc = new jsPDF();
    await this.buildWorkOrder(doc, workOrder);
    const base64PDF = doc.output('datauristring');
    return base64PDF;
  }
  public async downloadWorkOrder(workOrder: any, date: string) {
    const doc = new jsPDF();
    await this.buildWorkOrder(doc, workOrder);
    return doc.save('workOrder_' + date + 'Printing_Copy');
  }
  async buildWorkOrder(doc: any, workOrder: any) {
    autoTable(doc, {
      body: [
        [
          {
            content: 'Doggy Duty',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#787878',
            },
          },
        ],
      ],
      theme: 'plain',
      // styles: {
      //   fillColor: '#3366ff'
      // }
    });
    autoTable(doc, {
      head: [
        [
          'SN',
          'Comunity Name',
          'Address',
          'Manager',
          'Contact No',
          'Garbage Bins QNT',
          'Pet Station QNT',
        ],
      ],
      body: workOrder.orders,
      theme: 'striped',
      headStyles: {
        fillColor: '#787878',
      },
    });
  }

  generateInvoicePDF(invoiceData: any, print: boolean,tableData:any[]) {
    const doc = new jsPDF();
    doc.addImage("assets/img/logo.png", "PNG", 5, 5, 80, 30); // Increased the size of the logo
    doc.line(5, 40, 200,40); // Adjusted the line position to be below the larger logo

    // doc.text('', 10, 55); // Adding a line break before the autoTable

    autoTable(doc, {
      startY: 50, // Start the table below the line
      body: [
      [
        {
        content:
          'Reference: #INV' +
          invoiceData.id +
          '\nDate: ' +
          invoiceData.invoiceDate,
        styles: {
          halign: 'left',
        },
        },
      ],
      ],
      theme: 'plain',
    });
    autoTable(doc, {
      startY: 50, // Start the table below the line
      body: [
        [
          {
            content: 'Bill To:',
            styles: {
              halign: 'right',
              fontSize: 12,
            },
          },
        ],
      ],
      theme: 'plain',
    });
    autoTable(doc, {
      startY: 52, // Start the table below the line
      body: [
        [
          {
            content:
              '\n' +invoiceData.community.communityName+
              '\n' +invoiceData.community.communityAddress+
               '\nPhone:' + invoiceData.community.phone +
              '\nEmail: ' + invoiceData.community.email,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    

    autoTable(doc, {
      body: [
        [
          {
            content: 'Services',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Name of the Service', 'Rate', { content: 'Quantity', styles: { halign: 'center' } }, { content: 'Amount', styles: { halign: 'right' } }]],
      body: tableData,
      theme: 'striped',
      headStyles: {
      fillColor: '#343a40',
      },
      columnStyles: {
      2: { halign: 'center' }, // Right align the quantity column
      3: { halign: 'right' }, // Right align the amount column
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Amount due:',
            styles: {
              halign: 'right',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: '$'+(invoiceData.totalAmount +invoiceData.taxAmount).toFixed(2),
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content: 'status: ' + invoiceData.status,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });
    const pdfBlob = doc.output('blob');
    if(print){
      doc.save(`Invoice_${invoiceData.id}.pdf`);
    }
    return pdfBlob;
  }

  // getTotalAmount(invoices:any[]): number {
  //   return invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  // }
  getInvoiceStatus(invoices:any[]): string {
    return invoices?.some((inv) => inv.status === 'pending')
      ? 'pending'
      : 'completed';
  }

  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getMonth()+1)+"/"+(newDate.getDate()) + '/' + newDate.getFullYear()
    );
  }

//   generatePDF(invoice: any) {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(22);
//     doc.text('Invoice', 14, 22);

//     // Add invoice details
//     doc.setFontSize(12);
//     doc.text(`Invoice Date: ${invoice.invoiceDate}`, 14, 40);
//     doc.text(`Status: ${invoice.status}`, 14, 50);
    
//     // Community details
//     doc.text('Community Details:', 14, 70);
//     doc.text(`Community Name: ${invoice.community.communityName}`, 14, 80);
//     doc.text(`Address: ${invoice.community.communityAddress}`, 14, 90);
//     doc.text(`Phone: ${invoice.community.phone}`, 14, 100);
//     doc.text(`Email: ${invoice.community.email}`, 14, 110);

//     // Add a horizontal line
//     doc.line(14, 115, 200, 115);

//     // Table of Costs
//     autoTable(doc, {
//       head: [['Item', 'Quantity', 'Cost per Unit', 'Total']],
//       body: [
//         ['Garbage Bins', invoice.totalGarbageBins, invoice.costPerGarbageBins, invoice.totalGarbageBins * invoice.costPerGarbageBins],
//         ['Pet Stations', invoice.totalPetStations, invoice.costPerPetStations, invoice.totalPetStations * invoice.costPerPetStations],
//         ['Bag Replacements', invoice.totalBagReplaced, invoice.costPerBagReplaced, invoice.totalBagReplaced * invoice.costPerBagReplaced],
//       ],
//       startY: 120,
//     });

//     // Total Amount
//     doc.setFontSize(12);
//     doc.text(`Total Amount: $${invoice.totalAmount}`, 14, doc.autoTable.previous.finalY + 10);

//     // Save the PDF
//     doc.save('invoice.pdf');
//   }


}
