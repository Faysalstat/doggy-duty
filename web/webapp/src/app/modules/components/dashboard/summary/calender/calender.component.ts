import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EventData } from 'src/app/modules/dto/models';
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
  scheduledDate: string = this.datePipe
    .transform(new Date(), 'yyyy-MM-dd')
    ?.toString()!;
  isEditMode: boolean = false;
  scheduledTime: string = this.datePipe
    .transform(new Date(), 'hh:mm a')
    ?.toString()!;
  selectedStatus: string = 'PENDING';
  hour: number = 0;
  minute: number = 0;
  ampm: string = 'AM';
  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private eventScheduleService: EventScheduleService,
    private messageService: MessageService
  ) {
    // Initialize any other properties if needed
  }
  ngOnInit(): void {
    // Any initialization logic can go here
    this.prepareForm(null);
    this.getAllEventSchedule();
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
    });
  }

  submitForm() {
    if (this.eventCreateForm.valid) {
      const formData = this.eventCreateForm.value;
      formData.scheduledDate = this.scheduledDate;
      formData.scheduledTime =
        this.hour.toString().padStart(2, '0') +
        ':' +
        this.minute.toString().padStart(2, '0') +
        ' ' +
        (this.hour >= 12 ? 'PM' : 'AM');
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
        this.scheduledDate = this.datePipe
          .transform(new Date(), 'hh:mm a')
          ?.toString()!;
        this.isEditMode = false;
        this.hour = 0;
        this.minute = 0;
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
        this.scheduledDate = this.datePipe
          .transform(new Date(), 'hh:mm a')
          ?.toString()!;
        this.isEditMode = false;
        this.hour = 0;
        this.minute = 0;
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
    this.eventScheduleService.getAllEventSchedule().subscribe({
      next: (res) => {
        console.log('Event List:', res);
        let events = res.body;
        this.eventList = res.body;
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
    console.log('Edit Event:', event);
    this.scheduledDate = event.scheduledDate!;
    this.hour = parseInt(event.scheduledTime!.split(':')[0]);
    this.minute = parseInt(event.scheduledTime!.split(':')[1].split(' ')[0]);
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
  onTimeSelect(event: any) {
    if (event.value) {
      this.scheduledTime = event;
    }
  }
}
