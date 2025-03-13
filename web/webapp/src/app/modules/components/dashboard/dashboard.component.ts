import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';
import { TaskStatus } from '../../dto/models';
import { PdfMakeService } from 'src/app/services/pdf-make.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  communityList: any[] = [];
  expandedPanelIndex: number | null = null; // Track the index of the expanded panel
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService,
    private pdfMakeService:PdfMakeService
  ) {}

  ngOnInit() {
    this.fetchJobOrder();
  }
  fetchJobOrder() {
    const params: Map<string, any> = new Map();
    params.set('date','');
    params.set('status',TaskStatus.PENDING);
    this.communityService.getJobOrderByDate(params).subscribe({
      next: (res) => {
        this.communityList = res.body;
        this.communityList = this.communityList.map((community: any) => {
          return {
            ...community, // Spread the existing properties of the community
            isBagRollReplaced: false, // Add your first extra property
            noOfBagRollReplaced: 0, // Add your second extra property
            pricePerUnit:8.5
          };
        });
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    });
  }

  ngOnDestroy() {}
  getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return today.toLocaleDateString('en-GB', options);
  }

  onToggleChange(event: any,index:number) {
    // Handle any additional logic when the toggle changes, if necessary
    console.log('Toggle state changed:', event.checked);
  }
  togglePanel(index: number) {
    this.expandedPanelIndex = this.expandedPanelIndex === index ? null : index; // Toggle the panel index
  }
  completeTask(community:any){
    let taskCompleteModel = {
      taskId:community.taskId,
      isBagRollReplaced:community.isBagRollReplaced,
      noOfBagRollReplaced:community.noOfBagRollReplaced,
      date: new Date()
    }

    this.communityService.completeTask(taskCompleteModel).subscribe({
      next:(res)=>{
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail:"Successfully Updated"});
        this.fetchJobOrder();
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    })
  }
  calculateTotal(community:any){
    community.total = community.noOfBagRollReplaced * 8.5;
  }

  downloadWorkOrder() {
    let orders: any[] = [];
    let index = 1;
    // head: [['SN', 'Comunity Name', 'Address', 'Manager','Contact No', 'Garbage Bins QNT', 'Pet Station QNT']],
    this.communityList.forEach((community: any) => {
      let orderRow = [];
      orderRow.push(index);
      orderRow.push(community.communityName);
      orderRow.push(community.communityAddress);
      orderRow.push(community.camOfcommunity);
      orderRow.push(community.phone);
      orderRow.push(community.noOfGarbageBin);
      orderRow.push(community.noOfPetStation);
      index++;
      orders.push(orderRow);
    });
    let workOrderModel = {
      date: '',
      invoiceId: 'N/A',
      orders: orders
    };
    let today = new Date();
    let formatedDate = 
    today.getDate() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getFullYear();
    this.pdfMakeService.downloadWorkOrder(workOrderModel,formatedDate);
  }
}
