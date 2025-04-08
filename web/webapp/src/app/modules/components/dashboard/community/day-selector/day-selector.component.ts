// day-selector.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.css']
})
export class DaySelectorComponent implements OnInit {
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  selectedDays: string[] = [];
  scheduleForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.scheduleForm = this.fb.group({
      days: [[]] // Initialize with an empty array
    });
  }

  ngOnInit(): void {}

  toggleDay(day: string): void {
    if (this.selectedDays.includes(day)) {
      this.selectedDays = this.selectedDays.filter(d => d !== day); // Unselect
    } else {
      this.selectedDays.push(day); // Select
    }
    this.scheduleForm.patchValue({ days: this.selectedDays });
  }

  updateSchedule(): void {
    const scheduleData = {
      days_of_week: this.scheduleForm.value.days.join(','),
      // Include other necessary data, like community_id or start_date if needed
    };

    // Replace with your actual API endpoint
    this.http.post('http://your-api-endpoint/schedule/update', scheduleData)
      .subscribe(response => {
        console.log('Schedule updated successfully', response);
      }, error => {
        console.error('Error updating schedule', error);
      });
  }
}
