import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
  providedIn: 'root',
})
export class PdfMakeService {
  constructor() {}
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

  generateInvoicePDF(invoiceData: any) {
    const doc = new jsPDF();

  // Add title
  doc.setFontSize(22);
  doc.text('Invoice', 14, 20);

  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoiceData.id}`, 14, 40);
  doc.text(`Date: ${invoiceData.invoiceDate}`, 14, 50);
  doc.text(`Status: ${invoiceData.status}`, 14, 60);

  // Define the community details
  const communityDetails = [
    { label: 'Community Name', value: invoiceData.community.communityName },
    { label: 'Address', value: invoiceData.community.communityAddress },
    { label: 'Phone', value: invoiceData.community.phone },
    { label: 'Email', value: invoiceData.community.email },
    { label: 'Gate Code', value: invoiceData.community.gateCode },
    { label: 'CAM', value: invoiceData.community.camOfcommunity },
    { label: 'Lock Box Code', value: invoiceData.community.lockBoxCode },
    { label: 'Special Request', value: invoiceData.community.specialRequest },
  ];

  // Add community details to the table
  autoTable(doc, {
    head: [['Description', 'Details']],
    body: communityDetails.map(item => [item.label, item.value]),
    startY: 70,
    theme: 'grid',
    columnStyles: {
      0: { halign: 'left', cellWidth: 80 },
      1: { halign: 'right', cellWidth: 100 },
    },
    styles: {
      fontSize: 12,
    },
  });

  // Itemized costs
  const items = [
    { label: 'Total Garbage Bins', amount: invoiceData.totalGarbageBins * invoiceData.costPerGarbageBins },
    { label: 'Total Pet Stations', amount: invoiceData.totalPetStations * invoiceData.costPerPetStations },
    { label: 'Total Bags Replaced', amount: invoiceData.totalBagReplaced * invoiceData.costPerBagReplaced },
  ];

  // Add itemized costs to table
  // autoTable(doc, {
  //   head: [['Description', 'Amount']],
  //   body: items.map(item => [item.label, `$${item.amount.toFixed(2)}`]),
  //   startY: doc.lastAutoTable.finalY + 10,
  //   theme: 'grid',
  //   styles: {
  //     fontSize: 12,
  //   },
  // });

  // Calculate the Y position after the table
  // const finalY = doc.lastAutoTable.finalY;

  // // Total Amount
  // doc.setFontSize(14);
  // doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`, 14, finalY + 20);

  // Footer
  // doc.text(`Thank you for your business!`, 14, finalY + 40);

  // Save the PDF
  doc.save(`Invoice_${invoiceData.id}.pdf`);
  }

  getTotalAmount(invoices:any[]): number {
    return invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  }
  getInvoiceStatus(invoices:any[]): string {
    return invoices?.some((inv) => inv.status === 'pending')
      ? 'pending'
      : 'completed';
  }

  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getDate()) +"/"+(newDate.getMonth()+1) + '/' + newDate.getFullYear()
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
