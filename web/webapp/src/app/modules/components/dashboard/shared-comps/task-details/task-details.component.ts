import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TASK_CONFIG } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent {
  @Input() communityList!: any[];
  @Output() fetchListEmmiter: EventEmitter<any> = new EventEmitter();
  expandedPanelIndex: number | null = null; // Track the index of the expanded panel
  taskConfigs = TASK_CONFIG;
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}
  onToggleChange(event: any, index: number) {
    console.log('Toggle state changed:', event.checked);
  }
  togglePanel(index: number) {
    this.expandedPanelIndex = this.expandedPanelIndex === index ? null : index; // Toggle the panel index
  }
  completeTask(community: any, isCancel: boolean) {
    let taskCompleteModel: any = {
      taskId: community.taskId,
      date: community.scheduledDate,
      isCancel,
    };
    // Dynamically add all toggle, number, price, and total fields from config
    this.taskConfigs.forEach((task) => {
      taskCompleteModel[task.toggleKey] = community[task.toggleKey];
      taskCompleteModel[task.numberKey] = community[task.numberKey];
      taskCompleteModel[task.priceKey] = community[task.priceKey];
      taskCompleteModel[task.totalKey] = community[task.totalKey];
    });
    this.communityService.completeTask(taskCompleteModel).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Completed',
          detail: 'Task Completed',
        });
        this.fetchListEmmiter.emit();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.measse,
        });
      },
    });
  }
  calculateTotal(community: any) {
    this.taskConfigs.forEach((task) => {
      const quantity = Number(community[task.numberKey]) || 0;
      const price = Number(community[task.priceKey]) || 0;
      community[task.totalKey] = quantity * price;
    });
  }
}
