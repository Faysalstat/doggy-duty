import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateServiceComponent } from './create-service/create-service.component';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';



@NgModule({
  declarations: [
    CreateServiceComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
            { path: 'list', component: ListComponent },
            { path: 'add', component: CreateServiceComponent },
        ])
  ]
})
export class JobServiceModule { }
