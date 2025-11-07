import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { PdfMakeService } from 'src/app/services/pdf-make.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent {
  constructor(
    public dialogRef: MatDialogRef<InvoiceComponent>,
    private pdfMakeService: PdfMakeService,
    private communityService: CommunityService,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public invoice: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      newDate.getMonth() +
      1 +
      '/' +
      newDate.getDate() +
      '/' +
      newDate.getFullYear()
    );
  }

  getStatusClass(status: string): string {
    return status === 'pending' ? 'bg-warning text-dark' : 'bg-success';
  }

  downloadInvoice() {
    let tableData = this.prepareServiceTable(this.invoice);
    this.pdfMakeService.generateInvoicePDF(this.invoice, true, tableData);
  }
  payInvoice() {
    let tableData = this.prepareServiceTable(this.invoice);
    let status = this.invoice.status == 'pending' ? 'sent' : 'paid';
    let pdfData;
    if (this.invoice.status == 'pending') {
      pdfData = this.pdfMakeService.generateInvoicePDF(this.invoice, false, tableData);
    }
    this.communityService
      .payInvoice(this.invoice.id, status, pdfData)
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Invoice ' + status + ' successfully',
          });
          this.communityService.fetchInvoiceList.emit();
          this.dialogRef.close();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while paying invoice',
          });
        },
      });
  }

  prepareServiceTable(invoiceData: any) {
    let table = [];
    if (invoiceData.isFlatRate) {
      table = invoiceData?.additionalTasks.map((task: any) => [
        task.additionalTask ? 'Additional Task' : 'Regular Task',
        task.serviceDate,
        task.serviceName,
        '$' + task.serviceCharge,
        task.quantity,
      ]);
    } else {
      table = [
        [
          'Service of Pet Waste Station',
          '$' + invoiceData.costPerPetStations,
          invoiceData.totalPetStations,
          '$' +
            (
              invoiceData.costPerPetStations * invoiceData.totalPetStations
            ).toFixed(2),
        ],
        [
          'Garbage Bins',
          '$' + invoiceData.costPerGarbageBins,
          invoiceData.totalGarbageBins,
          '$' +
            (
              invoiceData.costPerGarbageBins * invoiceData.totalGarbageBins
            ).toFixed(2),
        ],
        [
          'Replacement of 10 Gal. Bin',
          '$' + invoiceData.costPerBinReplaced,
          invoiceData.totalBinReplaced,
          '$' +
            (
              invoiceData.costPerBinReplaced * invoiceData.totalBinReplaced
            ).toFixed(2),
        ],
        [
          'Hand Sanitizer Bottle Refill',
          '$' + invoiceData.costPerHandSanitizer,
          invoiceData.totalHandSanitizerReplaced,
          '$' +
            (
              invoiceData.costPerHandSanitizer *
              invoiceData.totalHandSanitizerReplaced
            ).toFixed(2),
        ],
        [
          'Pet Waste Station Dispenser Bag Refills (200 rolls)',
          '$' + invoiceData.costPerBagReplaced,
          invoiceData.totalBagReplaced,
          '$' +
            (
              invoiceData.costPerBagReplaced * invoiceData.totalBagReplaced
            ).toFixed(2),
        ],
        [
          '40 Gal Trash Bag',
          '$' + invoiceData.costPerTrashBag,
          invoiceData.totalTrashBagReplaced,
          '$' +
            (
              invoiceData.costPerTrashBag * invoiceData.totalTrashBagReplaced
            ).toFixed(2),
        ],
        ['Tax (7%)', '--', '--', '$' + invoiceData.taxAmount.toFixed(2)],
      ];
    }

    return table;
  }
}
