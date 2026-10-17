import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { Flag } from '../flag/flag';

@Component({
  selector: 'app-currency-select',
  imports: [Select, FormsModule, Flag],
  templateUrl: './currency-select.html',
  styleUrl: './currency-select.scss',
})
export class CurrencySelect {
  readonly value = model.required<string>();
  readonly currencies = input.required<any[]>();
  readonly label = input.required<string>();
}
