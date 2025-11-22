import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/services/community.service';
type Day =
  | 'saturday'
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday';

type Schedule = Record<string, string[]>;

@Component({
  selector: 'app-schedule-calender',
  templateUrl: './schedule-calender.component.html',
  styleUrls: ['./schedule-calender.component.scss'],
})
export class ScheduleCalenderComponent implements OnInit {
  // initialize structure with empty arrays for all 7 days
  schedule: Schedule = {
    saturday: [],
    sunday: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
  };

  weekDays = Object.keys(this.schedule);
  // ✅ Determine current day dynamically
  currentDay: Day = this.getCurrentDay();
  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.getCommunities()
  }
  private getCurrentDay(): Day {
    const days: Day[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    return days[new Date().getDay()];
  }

  getCommunities() {
    this.communityService.getAllCommunityByDate().subscribe({
      next: (res) => {
        let response = res.body;
        // map API data to structure
        response.forEach((item: any) => {
          const day = item.scheduledDay.toLowerCase() as Day;
          const communityName =
            item.communityServiceSchedule?.community?.communityName;

          if (day in this.schedule && communityName) {
            this.schedule[day].push(communityName);
          }
        });
      },
      error: (err) => {},
    });
  }
}
