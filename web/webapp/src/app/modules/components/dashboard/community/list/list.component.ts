import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommunityDTO } from 'src/app/modules/dto/models';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  communityList: any[] = [];
  constructor(private router:Router,private communityService:CommunityService,private messageService: MessageService){

  }
  ngOnInit(): void {
    this.getAllCommunity();
  }
  getAllCommunity(){
    this.communityService.getAllCommunity().subscribe({
      next: (res) => {
        this.communityList = res.body;
      },
      error:(err)=>{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.measse });
      },

    })
  }
  addNew() {
    this.router.navigate(['community/add'])
  }

  editCommunity(communityId: any) {
    this.router.navigate(['community/edit', communityId]); // Navigate to the edit route with the item ID
  }

  deleteCommunity(community: CommunityDTO) {
    // this.communityList = this.communityList.filter(c => c !== community);
  }
}
