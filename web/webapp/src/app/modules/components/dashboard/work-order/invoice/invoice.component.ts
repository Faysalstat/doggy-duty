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
    @Inject(MAT_DIALOG_DATA) public invoice: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getDate()) +"/"+(newDate.getMonth()+1) + '/' + newDate.getFullYear()
    );
  }
 


  getStatusClass(status:string): string {
    return status === 'pending'
      ? 'bg-warning text-dark'
      : 'bg-success';
  }

  downloadInvoice() {
    this.pdfMakeService.generateInvoicePDF(this.invoice);
  }

}
