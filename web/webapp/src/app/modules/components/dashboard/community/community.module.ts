import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SharedCompsModule } from '../shared-comps/shared-comps.module';
import { DaySelectorComponent } from './day-selector/day-selector.component';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CreateComponent, ListComponent, DaySelectorComponent],
  imports: [
    CommonModule,
    SharedCompsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastModule,
    MatDialogModule,
    RouterModule.forChild([
      { path: 'list', component: ListComponent },
      { path: 'add', component: CreateComponent },
      { path: 'edit/:id', component: CreateComponent },
    ]),
  ],
  providers: [MessageService,DialogService],
})
export class CommunityModule {}
