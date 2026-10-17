import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FxStore } from './fx-store';
import { FxService } from './services/fx.service';

describe('FxStore', () => {
  let store: FxStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FxService,
          useValue: {
            getLatestRates: () => of({ EUR: 1, USD: 1.25, GBP: 0.85 }),
            getCurrencies: () => of([{ code: 'USD' }, { code: 'EUR' }, { code: 'XYZ' }]),
            getRate: (rates: any, base: string, quote: string) => rates[quote] / rates[base],
          },
        },
      ],
    });
    store = TestBed.inject(FxStore);
  });

  it('converts the amount with the cross rate', () => {
    store.amount.set(100);
    expect(store.rate()).toBe(0.8);
    expect(store.result()).toBe(80);
  });

  it('only lists currencies that have a rate', () => {
    expect(store.currencies().map((c: any) => c.code)).toEqual(['USD', 'EUR']);
  });

  it('swaps base and quote', () => {
    store.swap();
    expect(store.base()).toBe('EUR');
    expect(store.quote()).toBe('USD');
  });

  it('toggles the current pair as a favorite', () => {
    store.toggleFavorite();
    expect(store.isFavorite()).toBe(true);

    store.toggleFavorite();
    expect(store.favorites()).toEqual([]);
  });

  it('logs a conversion and clears the log', () => {
    store.logConversion();
    expect(store.log()[0]).toMatchObject({ base: 'USD', quote: 'EUR', amount: 1000, result: 800 });

    store.clearLog();
    expect(store.log()).toEqual([]);
  });

  it('does not log when there is no amount', () => {
    store.amount.set(null);
    store.logConversion();
    expect(store.log()).toEqual([]);
  });
});
