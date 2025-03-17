import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  communityList!: any[];
  constructor(
    private communityService: CommunityService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.fetchJobOrder();
  }
  fetchJobOrder() {
    const params: Map<string, any> = new Map();
    // params.set('date', '');
    params.set('status','');
    this.communityService.getAllTask(params).subscribe({
      next: (res) => {
        this.communityList = res.body;
        // this.communityList = this.communityList.map((community: any) => {
        //   return {
        //     ...community, // Spread the existing properties of the community
        //     isBagRollReplaced: false, // Add your first extra property
        //     noOfBagRollReplaced: 0, // Add your second extra property
        //     pricePerUnit: 8.5,
        //   };
        // });
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
  applyFilter(date: any) {
    let newDate = new Date(date);
    return (
      (newDate.getDate()) +"/"+(newDate.getMonth()+1) + '/' + newDate.getFullYear()
    );
  }
}
