import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
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
    let taskCompleteModel = {
      taskId: community.taskId,
      isBagRollReplaced: community.isBagRollReplaced,
      isBinReplaced: community.isBinReplaced,
      isNewStationInstalled:  community.isNewStationInstalled,
      isHandSanitizerReplaced:  community.isHandSanitizerReplaced,
      noOfBagRollReplaced:  community.noOfBagRollReplaced,
      noOfBinReplacement: community.noOfBinReplacement,
      noOfStationInstalled: community.noOfStationInstalled,
      noOfHandSanitizerReplacement: community.noOfHandSanitizerReplacement,
      chargePerBagRoll: community.chargePerBagRoll,
      chargePerBinReplacement: community.chargePerBinReplacement,
      chargePerNewStationInstallment: community.chargePerNewStationInstallment,
      chargePerHandSanitizer: community.chargePerHandSanitizer,
      totalBagReplacementPrice:  community.totalBagReplacementPrice,
      totalBinReplacementPrice: community.totalBinReplacementPrice,
      totalStationInstallationPrice: community.totalStationInstallationPrice,
      totalHandSanitizerReplacedPrice: community.totalHandSanitizerReplacedPrice,
      date: new Date(),
      isCancel: isCancel,
    };
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
    community.totalBagReplacementPrice = community.noOfBagRollReplaced * community.chargePerBagRoll;
    community.totalBinReplacementPrice = community.noOfBinReplacement * community.chargePerBinReplacement;
    community.totalStationInstallationPrice = community.noOfStationInstalled * community.chargePerNewStationInstallment;
    community.totalHandSanitizerReplacedPrice = community.noOfHandSanitizerReplacement * community.chargePerHandSanitizer;
  }
}
