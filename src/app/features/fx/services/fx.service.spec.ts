import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { firstValueFrom } from 'rxjs';

import { FxService } from './fx.service';

describe('FxService', () => {
  let service: FxService;
  let apollo: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ApolloTestingModule] });
    service = TestBed.inject(FxService);
    apollo = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => apollo.verify());

  it('returns latest rates with EUR added', async () => {
    const rates = firstValueFrom(service.getLatestRates());

    apollo.expectOne('Latest').flush({ data: { latest: [{ quoteCurrency: 'USD', quote: 1.2 }] } });

    expect(await rates).toEqual({ EUR: 1, USD: 1.2 });
  });

  it('throws when the response has GraphQL errors', async () => {
    const currencies = firstValueFrom(service.getCurrencies());

    apollo.expectOne('Currencies').flush({ errors: [{ message: 'Please upgrade' }] });

    await expect(currencies).rejects.toThrow('Please upgrade');
  });

  it('calculates a cross rate', () => {
    expect(service.getRate({ EUR: 1, USD: 1.25, GBP: 0.85 }, 'USD', 'GBP')).toBeCloseTo(0.68);
  });

  it('builds one aliased query for the history range', async () => {
    const points = firstValueFrom(service.getHistory('USD', 'EUR', '1D'));

    const op = apollo.expectOne('History');
    expect(op.operation.variables).toEqual({ quotes: ['USD'] });

    op.flush({
      data: {
        d0: [{ quoteCurrency: 'USD', quote: 1.25 }],
        d1: [{ quoteCurrency: 'USD', quote: 1.0 }],
      },
    });

    expect((await points).map((p) => p.rate)).toEqual([0.8, 1]);
  });
});
