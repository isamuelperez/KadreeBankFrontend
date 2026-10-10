import { TestBed } from '@angular/core/testing';
import { TransationService } from './transation-service';

describe('TransationService', () => {
  let service: TransationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
