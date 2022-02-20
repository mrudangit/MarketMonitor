import { TestBed } from '@angular/core/testing';

import { MarketDataService } from './market-data.service';

describe('MarketDataService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ teardown: { destroyAfterEach: false } })
  );

  it('should be created', () => {
    const service: MarketDataService = TestBed.get(MarketDataService);
    expect(service).toBeTruthy();
  });
});
