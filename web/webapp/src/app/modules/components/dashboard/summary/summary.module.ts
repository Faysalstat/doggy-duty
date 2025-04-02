import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';

@NgModule({
  declarations: [HomeComponent, CalenderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
      { path: 'calender', component: CalenderComponent },
    ]),
  ],
})
export class SummaryModule {}
