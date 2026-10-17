import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { API_CONFIG } from '../../../core/config/api-config.token';

@Injectable({ providedIn: 'root' })
export class FxService {
  private http = inject(HttpClient);
  private url = inject(API_CONFIG).baseUrl;

  getCurrencies() {
    const query = `
      query {
        currencies {
          code
          name
        }
      }
    `;

    return this.http.post<any>(this.url, { query }).pipe(
      map((res) => {
        if (res.errors) throw new Error(res.errors[0].message);
        return res.data.currencies;
      }),
    );
  }

  getLatestRates() {
    const query = `
      query {
        latest {
          quoteCurrency
          quote
        }
      }
    `;

    return this.http.post<any>(this.url, { query }).pipe(
      map((res) => {
        if (res.errors) throw new Error(res.errors[0].message);
        return this.toRates(res.data.latest);
      }),
    );
  }

  getHistory(base: string, quote: string, range: string) {
    const dates = this.getDates(range);
    const quotes = [base, quote].filter((code) => code !== 'EUR');

    let fields = '';
    dates.forEach((date, i) => {
      fields += `
        d${i}: historical(date: "${date}", quoteCurrencies: $quotes) {
          quoteCurrency
          quote
        }
      `;
    });

    const query = `
      query History($quotes: [String!]) {
        ${fields}
      }
    `;

    return this.http.post<any>(this.url, { query, variables: { quotes } }).pipe(
      map((res) => {
        if (res.errors) throw new Error(res.errors[0].message);
        return dates.map((date, i) => ({
          date,
          rate: this.getRate(this.toRates(res.data['d' + i]), base, quote),
        }));
      }),
    );
  }

  getRate(rates: any, base: string, quote: string) {
    return rates[quote] / rates[base];
  }

  private toRates(list: any[]) {
    const rates: any = { EUR: 1 };
    list.forEach((item) => (rates[item.quoteCurrency] = item.quote));
    return rates;
  }

  private getDates(range: string) {
    const ranges: any = {
      '1D': { days: 1, step: 1 },
      '1W': { days: 7, step: 1 },
      '1M': { days: 30, step: 1 },
      '3M': { days: 90, step: 3 },
      '1Y': { days: 365, step: 7 },
      '5Y': { days: 1825, step: 30 },
    };

    const { days, step } = ranges[range];
    const dates = [];

    for (let i = days; i >= 0; i -= step) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().slice(0, 10));
    }

    return dates;
  }
}
