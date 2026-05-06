import { TestBed } from '@angular/core/testing';

import { Mandi } from './mandi';

describe('Mandi', () => {
  let service: Mandi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mandi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
