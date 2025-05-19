import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EventData } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';
import { EventScheduleService } from 'src/app/services/event-schedule.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  providers: [DatePipe, MessageService],
})
export class CalenderComponent implements OnInit {
  eventCreateForm!: FormGroup;
  eventList!: EventData[];
  scheduledDate!: string ;
  isEditMode: boolean = false;
  selectedStatus: string = 'active';
  communityList: any[] = [];
  showCommunityField: boolean = false;
  selectedCommunity: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private eventScheduleService: EventScheduleService,
    private messageService: MessageService,
    private communityService: CommunityService
  ) {
    // Initialize any other properties if needed
    const transformedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.scheduledDate = transformedDate ? transformedDate : '';
  }
  ngOnInit(): void {
    // Any initialization logic can go here
    this.prepareForm(null);
    this.getAllEventSchedule();
    this.getAllCommunity();
  }
  prepareForm(eventData: any) {
    if (!eventData) {
      eventData = new EventData();
    }
    this.eventCreateForm = this.formBuilder.group({
      id: [eventData.id],
      title: [eventData.title, Validators.required],
      description: [eventData.description, Validators.required],
      scheduledDate: [eventData.scheduledDate],
      communityName:[eventData.communityName]
    });
  }
  getAllCommunity(){
    this.communityService.getAllCommunity().subscribe({
      next: (res) => {
        if(res.body && res.body.length > 0){
          this.communityList = [{label: 'Select a Community', value: ''}];
          let communities = res.body;
          communities.map((elem:any)=>{
              let community = { label: elem.communityName, value: elem.communityName }
              this.communityList.push(community);
          })
          this.communityList.push({label: 'Other', value: 'Other'});
        }

      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },

    })
  }
  submitForm() {
    if (this.eventCreateForm.valid) {
      const formData = this.eventCreateForm.value;
      formData.scheduledDate = this.datePipe.transform(this.scheduledDate, 'MM-dd-yyyy')!;
      if (this.isEditMode) {
        this.updateEventSchedule(formData);
      } else {
        this.createEventSchedule(formData);
      }
      console.log('Form Submitted:', formData);
    } else {
      console.log('Form is invalid');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
      });
    }
  }
  createEventSchedule(payload: any) {
    console.log('Form Data:', payload);
    this.eventScheduleService.createEventSchedule(payload).subscribe({
      next: (res) => {
        console.log('Event Created:', res);
        this.eventCreateForm.reset();
        this.scheduledDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')?.toString()!;
        this.isEditMode = false;
        this.getAllEventSchedule();
        this.messageService.add({
          severity: 'success',
          summary: 'Created',
          detail: 'Successfully Created',
        });
      },
      error: (err) => {
        console.error('Error creating event:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
  updateEventSchedule(payload: any) {
    this.eventScheduleService.updateEventSchedule(payload).subscribe({
      next: (res) => {
        console.log('Event Updated:', res);
        this.eventCreateForm.reset();
        this.scheduledDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')?.toString()!;
        this.isEditMode = false;
        this.getAllEventSchedule();
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Successfully Updated',
        });
      },
      error: (err) => {
        console.error('Error updating event:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
  onDateChange(event: any) {
    if (event.value) {
      this.scheduledDate = this.datePipe
        .transform(event, 'MM-dd-yyyy')
        ?.toString()!;
      console.log('Raw Date From Picker', event.value);
      console.log('Formatted Date:', this.scheduledDate);
    }
  }
  onStatusChange(event: any) {
    console.log('Selected Status:', event.value);
  }
  getAllEventSchedule() {
    const params: Map<string, any> = new Map();
    params.set('status',this.selectedStatus);
    params.set('scheduledDate','');
    this.eventScheduleService.getAllEventSchedule(params).subscribe({
      next: (res) => {
        console.log('Event List:', res);
        let events = res.body;
        this.eventList = events.map((event: EventData) => ({
          ...event,
          scheduledDate: this.datePipe.transform(event.scheduledDate, 'yyyy-MM-dd'),
        }));
      },
      error: (err) => {
        console.error('Error fetching event list:', err);
      },
    });
  }
  deleteEventSchedule(id: number) {
    this.eventScheduleService.deleteEventSchedule(id).subscribe({
      next: (res) => {
        console.log('Event Deleted:', res);
        this.getAllEventSchedule();
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Successfully Deleted',
        });
      },
      error: (err) => {
        console.error('Error deleting event:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message,
        });
      },
    });
  }
  editEventSchedule(event: EventData) {
    this.isEditMode = true;
    this.showCommunityField = true;
    console.log('Edit Event:', event);
    this.selectedCommunity = '';
    this.scheduledDate = event.scheduledDate!;
    this.prepareForm(event);
  }
  resetForm() {
    this.isEditMode = false;
    this.eventCreateForm.reset();
    this.scheduledDate = this.datePipe
      .transform(new Date(), 'yyyy-MM-dd')
      ?.toString()!;
    console.log('Form Reset');
  }
  onSelectCommunity(event:any){
    console.log('Selected Community:', event);
    if(event.value === "Other"){
      this.showCommunityField = true;
      this.eventCreateForm.patchValue({communityName: ''});
    }else{
      this.showCommunityField = false;
      this.eventCreateForm.patchValue({communityName: event.value});
    }
  }
}
