import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { PdfMakeService } from 'src/app/services/pdf-make.service';
import { InvoiceComponent } from '../invoice/invoice.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  
  invoiceList:any[] = [];
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService,
    private dialog: MatDialog,
    
  ) {}

  ngOnInit(): void {
    this.fetchAllInvoice();
    this.communityService.fetchInvoiceList.subscribe(() => {
      this.fetchAllInvoice();
    }
    );
  }

  fetchAllInvoice() {
    const params: Map<string, any> = new Map();
    params.set('communityId','');
    params.set('status','');
    // fetch all invoices
    this.communityService.getAllInvoice(params).subscribe({
      next: (res:any) => {
        this.invoiceList = res.body;
        if(res.body && res.body.length > 0){
          this.invoiceList.forEach((invoice:any) => {
            invoice.taxAmount = invoice.totalAmount * 0.07;
          }
          );
        }
      },
      error: (err:any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    })
  }
  showInvoice(invoice:any){
    console.log(invoice);
    this.dialog.open(InvoiceComponent, {
      width: '800px',
      data: invoice,
      panelClass: 'custom-dialog-container'
    });
  }

}
