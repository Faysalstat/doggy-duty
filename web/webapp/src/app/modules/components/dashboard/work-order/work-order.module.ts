import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { InvoiceComponent } from './invoice/invoice.component';
import { CompletedListComponent } from './completed-list/completed-list.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedCompsModule } from '../shared-comps/shared-comps.module';

@NgModule({
  declarations: [ListComponent, CreateComponent, InvoiceComponent, CompletedListComponent, InvoiceListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
    SharedCompsModule,
    RouterModule.forChild([
      { path: 'history', component:CompletedListComponent  },
      { path: 'due-list', component: ListComponent },
      { path: 'add', component: CreateComponent },
      { path: 'invoice', component: InvoiceListComponent },
    ]),
  ],
})
export class WorkOrderModule {}
