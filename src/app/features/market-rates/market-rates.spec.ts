import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketRates } from './market-rates';

describe('MarketRates', () => {
  let component: MarketRates;
  let fixture: ComponentFixture<MarketRates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketRates],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketRates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
