import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { Flag } from '../flag/flag';
import { FxStore } from '../fx-store';

const CODES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'AED'];

@Component({
  selector: 'app-compare-tab',
  imports: [DecimalPipe, Flag],
  templateUrl: './compare-tab.html',
  styleUrl: './compare-tab.scss',
})
export class CompareTab {
  protected readonly store = inject(FxStore);

  protected readonly rows = computed(() => {
    const base = this.store.base();
    const amount = this.store.amount() ?? 0;
    const names = new Map(this.store.currencies().map((c: any) => [c.code, c.name]));

    return CODES.filter((code) => code !== base).map((code) => {
      const rate = this.store.rateFor(base, code);
      return { code, name: names.get(code), rate, total: rate && rate * amount };
    });
  });
}
