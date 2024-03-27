import { TestBed } from '@angular/core/testing';

import { TranHisService } from './tran-his.service';

describe('TranHisService', () => {
  let service: TranHisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranHisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
