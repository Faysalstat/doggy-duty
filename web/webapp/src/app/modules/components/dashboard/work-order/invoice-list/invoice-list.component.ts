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
  communityList:any[] = [];
  queryBody:any;

  constructor(
    private communityService: CommunityService,
    private messageService: MessageService,
    private dialog: MatDialog,
    
  ) {
    this.queryBody={
      communityId:'',
      status:'',
      startDate: new Date('01-01-2023'),
      endDate: new Date()

    }
  }

  ngOnInit(): void {
    this.fetchAllInvoice();
    this.getAllCommunity();
    this.communityService.fetchInvoiceList.subscribe(() => {
      this.fetchAllInvoice();
    }
    );
  }
  getAllCommunity(){
    this.communityService.getAllCommunity().subscribe({
      next: (res) => {
        if(res.body && res.body.length > 0){
          this.communityList = [];
          let communities = res.body;
          this.communityList.push({label: 'All', value: ''});
          communities.map((elem:any)=>{
              let community = { label: elem.communityName, value: elem.id }
              this.communityList.push(community);
          })
        }

      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },

    })
  }
  fetchAllInvoice() {
    const params: Map<string, any> = new Map();
    params.set('communityId',this.queryBody.communityId);
    params.set('status',this.queryBody.status);
    params.set('startDate', this.queryBody.startDate ? this.queryBody.startDate : '');
    params.set('endDate', this.queryBody.endDate ? this.queryBody.endDate : '');
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
