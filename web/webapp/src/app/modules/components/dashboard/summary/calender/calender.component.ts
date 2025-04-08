import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { scheduled } from 'rxjs';
import { EventData } from 'src/app/modules/dto/models';
import { EventScheduleService } from 'src/app/services/event-schedule.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  providers: [DatePipe,MessageService],
})
export class CalenderComponent implements OnInit {
  eventCreateForm!: FormGroup;
  scheduledDate: string = this.datePipe
    .transform(new Date(), 'yyyy-MM-dd')
    ?.toString()!;
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
  }
  prepareForm(eventData: any) {
    if (!eventData) {
      eventData = new EventData();
    }
    this.eventCreateForm = this.formBuilder.group({
      id: [eventData.id],
      title: [eventData.title],
      description: [eventData.description],
      scheduledDate: [eventData.scheduledDate],
    });
  }

  submitForm() {
    if (this.eventCreateForm.valid) {
      const formData = this.eventCreateForm .value;
      formData.scheduledDate = this.scheduledDate;
      console.log('Form Data:', formData);
      this.eventScheduleService
        .createEventSchedule(formData)
        .subscribe({
          next: (res) => {
            console.log('Event Created:', res);
            this.eventCreateForm.reset();
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
    } else {
      console.log('Form is invalid');
      this.messageService.add({
        severity: 'warning',
        summary: 'Invalid Form',
        detail: 'Please fill in all required fields.'
      });
    }
  }
  onDateChange(event: any) {
    if (event.value) {
      this.scheduledDate = this.datePipe
        .transform(event.value, 'yyyy-MM-dd')
        ?.toString()!;
      console.log('Raw Date From Picker', event.value);
      console.log('Formatted Date:', this.scheduledDate);
    }
  }
}
