import { Component, inject, signal } from '@angular/core';

import { CompareTab } from '../compare-tab/compare-tab';
import { ConverterCard } from '../converter-card/converter-card';
import { FavoritesTab } from '../favorites-tab/favorites-tab';
import { FxStore } from '../fx-store';
import { HistoryTab } from '../history-tab/history-tab';
import { LogTab } from '../log-tab/log-tab';
import { Ticker } from '../ticker/ticker';

type Tab = 'history' | 'compare' | 'favorites' | 'log';

@Component({
  selector: 'app-fx-page',
  imports: [CompareTab, ConverterCard, FavoritesTab, HistoryTab, LogTab, Ticker],
  templateUrl: './fx-page.html',
  styleUrl: './fx-page.scss',
})
export class FxPage {
  protected readonly store = inject(FxStore);
  protected readonly tab = signal<Tab>('history');
}
