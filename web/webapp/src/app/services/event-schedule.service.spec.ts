import { TestBed } from '@angular/core/testing';

import { EventScheduleService } from './event-schedule.service';

describe('EventScheduleService', () => {
  let service: EventScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
