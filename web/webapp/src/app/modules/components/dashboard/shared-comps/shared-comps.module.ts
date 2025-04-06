import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { MaterialModule } from 'src/material.module';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CurrencyDirective } from 'src/app/directives/currency.directive';



@NgModule({
  declarations: [
    TaskDetailsComponent,CurrencyDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ToastModule,
    PanelMenuModule,
    
  ],
  exports: [
    TaskDetailsComponent,CurrencyDirective
  ]
})
export class SharedCompsModule { }
