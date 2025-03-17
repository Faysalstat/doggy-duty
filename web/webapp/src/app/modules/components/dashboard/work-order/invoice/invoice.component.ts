import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { PdfMakeService } from 'src/app/services/pdf-make.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  invoices!: any[];
  queryForm!: FormGroup;
  communities!:any[];
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService,
    private pdfMakeService: PdfMakeService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.prepareForm();
    this.fetchAllCommunity()
  }
  fetchAllCommunity(){
    this.communityService.getAllCommunityDropdownList().subscribe({
      next: (res) => {
        this.communities = res.body;
        if(this.communities){
          this.queryForm
        .get('communityId')
        ?.setValue(this.communities[0].id);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    })
  }
  prepareForm() {
    this.queryForm = this.formBuilder.group({
      communityId:"",
      startDate: [new Date('2025-03-01')],
      endDate: [new Date()],
    });
    this.queryForm.get('startDate')?.valueChanges.subscribe((data) => {
      const formattedDate = this.formatToDateOnly(data);
      this.queryForm
        .get('startDate')
        ?.setValue(formattedDate, { emitEvent: false });
    });
    this.queryForm.get('endDate')?.valueChanges.subscribe((data) => {
      const formattedDate = this.formatToDateOnly(data);
      this.queryForm
        .get('endDate')
        ?.setValue(formattedDate, { emitEvent: false });
    });
  }
  fetchJobOrder() {
    const params: Map<string, any> = new Map();
    params.set('communityId', this.queryForm.get('communityId')?.value);
    params.set('startDate', this.queryForm.get('startDate')?.value);
    params.set('endDate', this.queryForm.get('endDate')?.value);
    params.set('status', 'pending');
    this.communityService.getBillByCommunity(params).subscribe({
      next: (res) => {
        this.invoices = res.body;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    });
  }

  getTotalAmount(): number {
    return this.invoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  }

  getInvoiceStatus(): string {
    return this.invoices?.some((inv) => inv.status === 'pending')
      ? 'pending'
      : 'completed';
  }

  getStatusClass(): string {
    return this.getInvoiceStatus() === 'pending'
      ? 'bg-warning text-dark'
      : 'bg-success';
  }

  getTotalPerTask(invoice: any) {
    return (
      invoice.task.noOfGarbageBin * invoice.task.chargePerGarbageBin +
      invoice.task.noOfPetStation * invoice.task.chargePerPetStation +
      invoice.task.noOfBagRollReplaced * invoice.task.chargePerBagRoll
    );
  }

  downloadInvoice() {
    this.pdfMakeService.generateInvoicePDF(this.invoices);
  }
  formatToDateOnly(input: any): string {
    if (!input) return '';
    return moment(input).format('YYYY-MM-DD');
  }

  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getDate()) +"/"+(newDate.getMonth()+1) + '/' + newDate.getFullYear()
    );
  }
}
