import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';
import { SharedCompsModule } from '../shared-comps/shared-comps.module';
import { ToastModule } from 'primeng/toast';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarModule } from 'primeng/calendar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScheduleCalenderComponent } from './schedule-calender/schedule-calender.component';
@NgModule({
  declarations: [HomeComponent, CalenderComponent, ScheduleCalenderComponent],
  imports: [
    CommonModule,
    SharedCompsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
    MatDialogModule,
    CalendarModule,
    MatProgressSpinnerModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'calender', component: CalenderComponent },
      { path: 'schedule-calender', component: ScheduleCalenderComponent },
    ]),
  ],
})
export class SummaryModule {}
