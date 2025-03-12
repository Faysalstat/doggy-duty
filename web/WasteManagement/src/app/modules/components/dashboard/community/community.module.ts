import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent
  ],
  imports: [
      CommonModule,
      ReactiveFormsModule,
      MaterialModule,
      ToastModule,
      RouterModule.forChild([
              { path: 'list', component: ListComponent },
              { path: 'add', component: CreateComponent },
          ])
    ],
    providers:[MessageService]
})
export class CommunityModule { }
