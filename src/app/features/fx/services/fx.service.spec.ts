import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_CONFIG } from '../../../core/config/api-config.token';
import { FxService } from './fx.service';

const API = 'http://test/graphql';

describe('FxService', () => {
  let service: FxService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_CONFIG, useValue: { baseUrl: API, apiKey: 'test' } },
      ],
    });
    service = TestBed.inject(FxService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns latest rates with EUR added', () => {
    let rates: any;
    service.getLatestRates().subscribe((value) => (rates = value));

    http.expectOne(API).flush({ data: { latest: [{ quoteCurrency: 'USD', quote: 1.2 }] } });

    expect(rates).toEqual({ EUR: 1, USD: 1.2 });
  });

  it('throws when the response has GraphQL errors', () => {
    let error: any;
    service.getCurrencies().subscribe({ error: (e) => (error = e) });

    http.expectOne(API).flush({ data: null, errors: [{ message: 'Please upgrade' }] });

    expect(error.message).toBe('Please upgrade');
  });

  it('calculates a cross rate', () => {
    expect(service.getRate({ EUR: 1, USD: 1.25, GBP: 0.85 }, 'USD', 'GBP')).toBeCloseTo(0.68);
  });

  it('builds one aliased query for the history range', () => {
    let points: any[] = [];
    service.getHistory('USD', 'EUR', '1D').subscribe((value) => (points = value));

    const req = http.expectOne(API);
    expect(req.request.body.variables).toEqual({ quotes: ['USD'] });
    expect(req.request.body.query).toContain('d0: historical');
    expect(req.request.body.query).toContain('d1: historical');

    req.flush({
      data: {
        d0: [{ quoteCurrency: 'USD', quote: 1.25 }],
        d1: [{ quoteCurrency: 'USD', quote: 1.0 }],
      },
    });

    expect(points.map((p) => p.rate)).toEqual([0.8, 1]);
  });
});
