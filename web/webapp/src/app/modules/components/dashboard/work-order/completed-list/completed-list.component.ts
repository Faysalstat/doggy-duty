import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-completed-list',
  templateUrl: './completed-list.component.html',
  styleUrls: ['./completed-list.component.scss']
})
export class CompletedListComponent implements OnInit {
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
    params.set('status','completed,cancelled');
    this.communityService.getAllTask(params).subscribe({
      next: (res) => {
        this.communityList = res.body;
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