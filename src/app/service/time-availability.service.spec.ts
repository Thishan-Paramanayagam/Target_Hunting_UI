import { TestBed } from '@angular/core/testing';

import { TimeAvailabilityService } from './time-availability.service';

describe('TimeAvailabilityService', () => {
  let service: TimeAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
