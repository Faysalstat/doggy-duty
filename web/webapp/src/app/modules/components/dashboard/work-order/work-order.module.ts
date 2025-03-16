import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
  declarations: [ListComponent, CreateComponent, InvoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
    RouterModule.forChild([
      { path: 'history', component: ListComponent },
      { path: 'add', component: CreateComponent },
      { path: 'invoice', component: InvoiceComponent },
    ]),
  ],
})
export class WorkOrderModule {}
