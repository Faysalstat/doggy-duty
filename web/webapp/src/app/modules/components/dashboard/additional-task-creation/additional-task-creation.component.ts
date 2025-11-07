import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-additional-task-creation',
  templateUrl: './additional-task-creation.component.html',
  styleUrls: ['./additional-task-creation.component.scss'],
  providers: [DatePipe],
})
export class AdditionalTaskCreationComponent implements OnInit {
  communityList: any[] = [];
  selectedCommunityId: any;
  taskModel: any = {};
  addtinalTaskList: any[] = [];
  taskDate: string = this.datePipe
    .transform(new Date(), 'yyyy-MM-dd')
    ?.toString()!;
  today = new Date();
  day: string = new Date().getDate().toString();
  month: string = (new Date().getMonth() + 1).toString();
  year: string = new Date().getFullYear().toString();
  months: any[] = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  years: string[] = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );
  constructor(
    private router: Router,
    private communityService: CommunityService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Fetch the community list from a service or API
    this.getAllCommunity();
  }

  getAllCommunity(){
    this.communityService.getAllCommunity().subscribe({
      next: (res) => {
        console.log(res);
        this.communityList = res.body;
        this.communityList = this.communityList.filter(community => community.isFlatRate === true);
        console.log(this.communityList);
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      },

    })
  }
  prepareDate(){
    this.taskDate = (this.year ? this.year : '0000') + '-' + (this.month ? this.month : '00') + '-' + (this.day ? ('0' + this.day).slice(-2) : '00');
  }
  addTask(){
    if(!this.selectedCommunityId){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a community' });
      return;
    }
    if(!this.taskDate || this.taskDate.startsWith('0000')){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a valid service date' });
      return;
    }
    if(!this.taskModel.serviceName || this.taskModel.serviceName.trim() === ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter a service name' });
      return;
    }
    if(!this.taskModel.serviceCharge || this.taskModel.serviceCharge <= 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please enter a valid service charge' });
      return;
    }
    const task = {
      serviceName: this.taskModel.serviceName,
      taskDate: this.taskDate,
      serviceCharge: this.taskModel.serviceCharge};
    this.addtinalTaskList.push(task);
    // reset form
    this.taskModel = {};
    this.day = new Date().getDate().toString();
    this.month = (new Date().getMonth() + 1).toString();
    this.year = new Date().getFullYear().toString();
    this.prepareDate();
  }
  onSubmit(){
    if(!this.selectedCommunityId){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a community' });
      return;
    }
    if(!this.taskDate || this.taskDate.startsWith('0000')){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select a valid service date' });
      return;
    }
    if(!this.addtinalTaskList || this.addtinalTaskList.length == 0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add at least one Task' });
      return;
    }
    const requestBody = {
      communityId: this.selectedCommunityId,
      taskDate: this.taskDate,
      additionalJobs: this.addtinalTaskList
    };

    console.log('Submitting Additional Tasks:', requestBody);
    this.communityService.addAdditionalTask(requestBody).subscribe({
      next:(res)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Successfully Created',
        });
        this.addtinalTaskList = []
      }
    })
  }
}
