import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  serviceList!:any[];
  constructor(
    private router:Router,
    private communityService:CommunityService
  ){}
  ngOnInit(): void {
      this.getAllServiceList(); 
  }
  getAllServiceList(){
    this.communityService.getAllService().subscribe({
      next:(res)=>{
        this.serviceList = res.body;
      }
    })
  }
  addNew(){
    this.router.navigate(['service/add'])
  }
}
