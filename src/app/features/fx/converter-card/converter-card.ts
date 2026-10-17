import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppButton } from '../../../shared/components/button/button';
import { CurrencySelect } from '../currency-select/currency-select';
import { FxStore } from '../fx-store';

@Component({
  selector: 'app-converter-card',
  imports: [DecimalPipe, FormsModule, AppButton, CurrencySelect],
  templateUrl: './converter-card.html',
  styleUrl: './converter-card.scss',
})
export class ConverterCard {
  protected readonly store = inject(FxStore);
}
