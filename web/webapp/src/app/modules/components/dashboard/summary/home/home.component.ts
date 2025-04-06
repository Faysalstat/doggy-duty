import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  selectedDate: Date = new Date(new Date().getFullYear(), 0, 1);
  selectedYear: string = new Date().getFullYear().toString();
  totalEarnings: number = 0;
  totalTaxCollected: number = 0;
  startYear: number = 2023;
  maxYear: number = new Date().getFullYear();
  minYear: number = 2023;
  constructor(private communityService: CommunityService) {}
  ngOnInit(): void {
    this.fetchSummary();
  }
  fetchSummary() {
    const params: Map<string, any> = new Map();
    params.set('selectedYear',this.selectedYear);
    this.communityService.getSummary(params).subscribe({
      next: (res) => {
        console.log(res);
        this.totalEarnings = res.body.totalAmountGetPaid;
        this.totalTaxCollected = res.body.totalTaxCollected;
      },
    });
  }
  chooseYear(normalizedYear: Date, datepicker: any) {
    this.selectedDate = new Date(normalizedYear.getFullYear(), 0);
    this.selectedYear = normalizedYear.getFullYear().toString();
    datepicker.close(); // Close after selecting year
    this.fetchSummary(); // Fetch summary after selecting year
  }
}
