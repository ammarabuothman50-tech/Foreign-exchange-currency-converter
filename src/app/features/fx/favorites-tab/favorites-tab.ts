import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AppButton } from '../../../shared/components/button/button';
import { FxStore } from '../fx-store';

@Component({
  selector: 'app-favorites-tab',
  imports: [DecimalPipe, AppButton],
  templateUrl: './favorites-tab.html',
  styleUrl: './favorites-tab.scss',
})
export class FavoritesTab {
  protected readonly store = inject(FxStore);
}
