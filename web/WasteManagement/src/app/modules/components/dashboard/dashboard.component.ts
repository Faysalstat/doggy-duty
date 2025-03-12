import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    jobList!:any[];
    constructor() {}

  ngOnInit() {
    this.jobList = [{
        communityName: "Greenwood Heights",
        address: "123 Main St, Springfield",
        contactNo: "+1 234-567-8901",
        services: ["Garbage Collection", "Disposal Bag Collection"]
      },
      {
        communityName: "Sunset Valley",
        address: "456 Elm St, Riverdale",
        contactNo: "+1 987-654-3210",
        services: ["Garbage Collection"]
      },
      {
        communityName: "Lakeside Residences",
        address: "789 Oak St, Lakeshore",
        contactNo: "+1 555-123-4567",
        services: ["Garbage Collection", "Disposal Bag Collection"]
      },
      {
        communityName: "Hilltop Gardens",
        address: "101 Pine St, Mountainview",
        contactNo: "+1 222-333-4444",
        services: ["Disposal Bag Collection"]
      }]
  }

  ngOnDestroy() {}
  getFormattedDate(): string {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return today.toLocaleDateString('en-GB', options);
}
}
