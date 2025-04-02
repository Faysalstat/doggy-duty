import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  totalEarnings: number = 0;
  totalTaxCollected: number = 0;
  constructor(private communityService: CommunityService) {}
  ngOnInit(): void {
    this.fetchSummary();
  }
  fetchSummary() {
    this.communityService.getSummary().subscribe({
      next: (res) => {
        console.log(res);
        this.totalEarnings = res.body.totalAmountGetPaid;
        this.totalTaxCollected = res.body.totalTaxCollected;
      },
    });
  }
}
