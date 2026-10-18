import { inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { CurrenciesGQL, LatestGQL } from './fx.generated';

@Injectable({ providedIn: 'root' })
export class FxService {
  private apollo = inject(Apollo);
  private currenciesGql = inject(CurrenciesGQL);
  private latestGql = inject(LatestGQL);

  getCurrencies() {
    return this.currenciesGql.fetch().pipe(map((res) => res.data!.currencies));
  }

  getLatestRates() {
    return this.latestGql.fetch().pipe(map((res) => this.toRates(res.data!.latest)));
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

    const query = gql`
      query History($quotes: [String!]) {
        ${fields}
      }
    `;

    return this.apollo.query<any, any>({ query, variables: { quotes } }).pipe(
      map((res) =>
        dates.map((date, i) => ({
          date,
          rate: this.getRate(this.toRates(res.data['d' + i]), base, quote),
        })),
      ),
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
