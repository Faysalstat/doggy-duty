import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityDTO } from 'src/app/modules/dto/models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  communityList: CommunityDTO[] = [];
  constructor(private router:Router){

  }
  ngOnInit(): void {
    // Dummy data for testing
    this.communityList = [
      {
        communityName: 'Green Valley',
        communityAddress: '123 Green St',
        camOfcommunity: 'John Doe',
        gateCode: 'GV123',
        phone: '123-456-7890',
        email: 'admin@greenvalley.com',
        lockBoxCode: 'LB123',
        specialRequest: 'No pets allowed',
        noOfPetStation: 5,
        noOfGarbageBin: 10,
      },
      {
        communityName: 'Blue Ridge',
        communityAddress: '456 Blue St',
        camOfcommunity: 'Jane Smith',
        gateCode: 'BR456',
        phone: '987-654-3210',
        email: 'admin@blueridge.com',
        lockBoxCode: 'LB456',
        specialRequest: 'Install extra bins',
        noOfPetStation: 3,
        noOfGarbageBin: 7,
      },
    ];
  }
  addNew() {
    this.router.navigate(['community/add'])
  }

  editCommunity(community: CommunityDTO) {
    // this.serviceCreateForm.patchValue(community);
  }

  deleteCommunity(community: CommunityDTO) {
    // this.communityList = this.communityList.filter(c => c !== community);
  }
}
