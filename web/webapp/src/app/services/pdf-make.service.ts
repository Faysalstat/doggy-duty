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

  generateInvoicePDF(invoices: any) {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    autoTable(doc, {
      body: [
        [
          {
            content: 'Invoice',
            styles: {
              halign: 'left',
              fontSize: 16,
            },
          },
          {
            content: invoices[0].task.community.communityName,

            styles: {
              halign: 'right',
              fontSize: 16,
              cellWidth: 100, // Set a fixed width for this cell
              overflow: 'linebreak', // Allow text to wrap
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
            content: `Date: ${invoices[0].taskCompletionDate}`,
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              'Address:' +
              invoices[0].task.community.communityAddress +
              '\n' +
              `Phone: ${invoices[0].task.community.phone}` +
              '\n' +
              `Email: ${invoices[0].task.community.email}` +
              '\n',

            styles: {
              halign: 'right',
              cellWidth: 100, // Set a fixed width for this cell
              overflow: 'linebreak', // Allow text to wrap
            },
          },
        ],
      ],
      theme: 'plain',
    });

    // Add a horizontal line
    doc.setDrawColor(0);
    doc.line(14, 52, 196, 52); // Draw line from (x1, y1) to (x2, y2)

    // Add Task Details header
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('Task Details', 14, 60);

    // Define the columns for the table
    const columns = [
      { title: 'Community Name', dataKey: 'communityName' },
      { title: 'Date', dataKey: 'date' },
      { title: 'Garbage Bin QNT', dataKey: 'garbageBinQnt' },
      { title: 'Garbage Bin Rate', dataKey: 'garbageBinRate' },
      { title: 'Pet Station QNT', dataKey: 'petStationQnt' },
      { title: 'Pet Station Rate', dataKey: 'petStationRate' },
      { title: 'Bag Roll Replaced QNT', dataKey: 'bagRollQnt' },
      { title: 'Bag Roll Rate', dataKey: 'bagRollRate' },
      { title: 'Total', dataKey: 'total' },
    ];

    // Prepare the rows for the table
    const rows = invoices.map((invoice: any) => ({
      communityName: invoice.task.community.communityName,
      date: invoice.taskCompletionDate,
      garbageBinQnt: invoice.task.noOfGarbageBin,
      garbageBinRate: `$${invoice.task.chargePerGarbageBin}`,
      petStationQnt: invoice.task.noOfPetStation,
      petStationRate: `$${invoice.task.chargePerPetStation}`,
      bagRollQnt: invoice.task.noOfBagRollReplaced,
      bagRollRate: `$${invoice.task.chargePerBagRoll}`,
      total:
        `$` +
        (invoice.task.noOfGarbageBin * invoice.task.chargePerGarbageBin +
          invoice.task.noOfPetStation * invoice.task.chargePerPetStation +
          invoice.task.noOfBagRollReplaced * invoice.task.chargePerBagRoll), // Ensure this function is defined to calculate the total
    }));

    // Add the table to the PDF
    autoTable(doc, {
      head: [columns.map((col) => col.title)],
      body: rows.map((row: any) => columns.map((col) => row[col.dataKey])),
      startY: 70, // Start Y position for the table
      theme: 'grid', // Use a grid theme
      headStyles: { fillColor: [40, 40, 40] }, // Dark header
      styles: { cellPadding: 2, fontSize: 8 },
    });

    // Add additional community details below the table

    // Ensure additionalY is calculated safely
    autoTable(doc, {
      // startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 30, // Start after previous table
      body: [
        [
          { content: 'Gate Code:', styles: { fontStyle: 'bold' } },
          { content: invoices[0].task.community.gateCode },
        ],
        [
          { content: 'Lock Box Code:', styles: { fontStyle: 'bold' } },
          { content: invoices[0].task.community.lockBoxCode },
        ],
        [
          {
            content: 'Total Amount:',
            styles: { fontStyle: 'bold', fontSize: 14 },
          },
          {
            content: `$${this.getTotalAmount(invoices)}`,
            styles: { fontSize: 14, textColor: '#28a745' },
          },
        ],
        [
          { content: 'Status:', styles: { fontStyle: 'bold', fontSize: 14 } },
          {
            content: this.getInvoiceStatus(invoices),
            styles: { fontSize: 14, textColor: '#dc3545' },
          },
        ],
      ],
      
      theme: 'plain', // No borders, just clean formatting
      columnStyles: {
        0: { cellWidth: 50 }, // First column fixed width
        1: { cellWidth: 'auto' }, // Let content wrap
      },
    });

    // Save the PDF
    doc.save('invoice.pdf');
  }

  getTotalAmount(invoices:any[]): number {
    return invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  }
  getInvoiceStatus(invoices:any[]): string {
    return invoices?.some((inv) => inv.status === 'pending')
      ? 'pending'
      : 'completed';
  }
}
