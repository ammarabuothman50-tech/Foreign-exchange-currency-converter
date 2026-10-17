import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';

import { ToastService } from '../../core/services/toast.service';
import { FxService } from './services/fx.service';

interface Pair {
  base: string;
  quote: string;
}

interface Conversion extends Pair {
  amount: number;
  result: number;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class FxStore {
  private readonly fx = inject(FxService);
  private readonly toast = inject(ToastService);

  readonly base = signal('USD');
  readonly quote = signal('EUR');
  readonly amount = signal<number | null>(1000);
  readonly favorites = signal<Pair[]>(read('fx.favorites'));
  readonly log = signal<Conversion[]>(read('fx.log'));

  readonly rates = toSignal(
    this.fx.getLatestRates().pipe(catchError(() => this.fail('Could not load rates'))),
  );

  private readonly allCurrencies = toSignal(
    this.fx.getCurrencies().pipe(catchError(() => this.fail('Could not load currencies'))),
    { initialValue: [] },
  );

  readonly currencies = computed(() => {
    const rates = this.rates();
    return rates ? this.allCurrencies().filter((currency: any) => currency.code in rates) : [];
  });

  readonly rate = computed(() => this.rateFor(this.base(), this.quote()));

  readonly result = computed(() => {
    const amount = this.amount();
    const rate = this.rate();
    return amount && rate ? amount * rate : null;
  });

  readonly isFavorite = computed(() =>
    this.favorites().some((pair) => pair.base === this.base() && pair.quote === this.quote()),
  );

  constructor() {
    effect(() => localStorage.setItem('fx.favorites', JSON.stringify(this.favorites())));
    effect(() => localStorage.setItem('fx.log', JSON.stringify(this.log())));
  }

  rateFor(base: string, quote: string): number | null {
    const rates = this.rates();
    return rates ? this.fx.getRate(rates, base, quote) : null;
  }

  select(pair: Pair): void {
    this.base.set(pair.base);
    this.quote.set(pair.quote);
  }

  swap(): void {
    this.select({ base: this.quote(), quote: this.base() });
  }

  toggleFavorite(): void {
    const base = this.base();
    const quote = this.quote();

    if (this.isFavorite()) {
      this.favorites.update((list) => list.filter((p) => p.base !== base || p.quote !== quote));
    } else {
      this.favorites.update((list) => [...list, { base, quote }]);
    }
  }

  removeFavorite(pair: Pair): void {
    this.favorites.update((list) => list.filter((p) => p !== pair));
  }

  logConversion(): void {
    const amount = this.amount();
    const result = this.result();
    if (!amount || !result) return;

    const entry = {
      base: this.base(),
      quote: this.quote(),
      amount,
      result,
      date: new Date().toISOString(),
    };
    this.log.update((list) => [entry, ...list]);
  }

  clearLog(): void {
    this.log.set([]);
  }

  private fail(message: string) {
    this.toast.show(message, 'error');
    return EMPTY;
  }
}

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  } catch {
    return [];
  }
}
