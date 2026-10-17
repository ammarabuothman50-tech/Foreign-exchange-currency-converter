import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of } from 'rxjs';

import { FxService } from '../services/fx.service';

const PAIRS = [
  ['EUR', 'USD'],
  ['USD', 'JPY'],
  ['GBP', 'USD'],
  ['USD', 'CHF'],
  ['EUR', 'GBP'],
  ['AUD', 'USD'],
  ['USD', 'CAD'],
  ['USD', 'CNY'],
];

@Component({
  selector: 'app-ticker',
  imports: [DecimalPipe],
  templateUrl: './ticker.html',
  styleUrl: './ticker.scss',
})
export class Ticker {
  private readonly fx = inject(FxService);

  private readonly items = toSignal(
    forkJoin(
      PAIRS.map(([base, quote]) =>
        this.fx.getHistory(base, quote, '1D').pipe(
          map((points) => {
            const open = points[0].rate;
            const last = points[points.length - 1].rate;
            return { pair: `${base}/${quote}`, rate: last, change: ((last - open) / open) * 100 };
          }),
        ),
      ),
    ).pipe(catchError(() => of([]))),
    { initialValue: [] },
  );

  protected readonly loop = computed(() => [...this.items(), ...this.items()]);
}
