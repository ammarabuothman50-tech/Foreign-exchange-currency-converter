import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { AreaChart } from '../area-chart/area-chart';
import { FxStore } from '../fx-store';
import { FxService } from '../services/fx.service';

@Component({
  selector: 'app-history-tab',
  imports: [DatePipe, DecimalPipe, AreaChart],
  templateUrl: './history-tab.html',
  styleUrl: './history-tab.scss',
})
export class HistoryTab {
  protected readonly store = inject(FxStore);
  private readonly fx = inject(FxService);

  protected readonly ranges = ['1D', '1W', '1M', '3M', '1Y', '5Y'];
  protected readonly range = signal('1M');

  protected readonly history = rxResource({
    params: () => ({ base: this.store.base(), quote: this.store.quote(), range: this.range() }),
    stream: ({ params }) => this.fx.getHistory(params.base, params.quote, params.range),
  });

  protected readonly stats = computed(() => {
    if (!this.history.hasValue()) return null;

    const points = this.history.value();

    const open = points[0].rate;
    const last = points[points.length - 1];
    const change = last.rate - open;
    return { open, last: last.rate, date: last.date, change, percent: (change / open) * 100 };
  });
}
