import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  communityList!: any[];
  expandedPanelIndex: number | null = null; // Track the index of the expanded panel
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.fetchJobOrder();
  }
  fetchJobOrder() {
    const params: Map<string, any> = new Map();
    params.set('status','pending');
    this.communityService.getAllTask(params).subscribe({
      next: (res) => {
        this.communityList = res.body;
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
  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getDate()) +"/"+(newDate.getMonth()+1) + '/' + newDate.getFullYear()
    );
  }
  onToggleChange(event: any,index:number) {
    console.log('Toggle state changed:', event.checked);
  }
  togglePanel(index: number) {
    this.expandedPanelIndex = this.expandedPanelIndex === index ? null : index; // Toggle the panel index
  }
  completeTask(community:any,isCancel:boolean){
    let taskCompleteModel = {
      taskId:community.taskId,
      isBagRollReplaced:community.isBagRollReplaced,
      noOfBagRollReplaced:community.noOfBagRollReplaced,
      date: new Date(),
      isCancel:isCancel
    }

    this.communityService.completeTask(taskCompleteModel).subscribe({
      next:(res)=>{
        console.log(res);
        this.messageService.add({ severity: 'success', summary: 'Completed', detail:"Task Completed"});
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
}
