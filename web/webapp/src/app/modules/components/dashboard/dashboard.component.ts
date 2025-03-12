import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  communityList!: any[];
  expandedPanelIndex: number | null = null; // Track the index of the expanded panel
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchJobOrder();
  }
  fetchJobOrder() {
    this.communityService.getJobOrderByDate().subscribe({
      next: (res) => {
        this.communityList = res.body;
        this.communityList = this.communityList.map((community: any) => {
          return {
            ...community, // Spread the existing properties of the community
            isReplaceBagRoll: false, // Add your first extra property
            numberOfRolls: 0, // Add your second extra property
            pricePerUnit:8.5
          };
        });
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },
    });
  }

  ngOnDestroy() {}
  getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return today.toLocaleDateString('en-GB', options);
  }

  onToggleChange(event: any,index:number) {
    // Handle any additional logic when the toggle changes, if necessary
    console.log('Toggle state changed:', event.checked);
  }
  togglePanel(index: number) {
    this.expandedPanelIndex = this.expandedPanelIndex === index ? null : index; // Toggle the panel index
  }
  completeTask(){
    
  }
}
