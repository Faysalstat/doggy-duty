// day-selector.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-day-selector',
  templateUrl: './day-selector.component.html',
  styleUrls: ['./day-selector.component.scss'],
})
export class DaySelectorComponent implements OnInit {
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  @Input() selectedDays: string[] = [];
  scheduleForm: FormGroup;
  constructor(private fb: FormBuilder) {
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
      daysOfWeek: this.scheduleForm.value.days.join(','),
      // Include other necessary data, like community_id or start_date if needed
    };

    console.log('Schedule Data:', scheduleData);
  }
}
