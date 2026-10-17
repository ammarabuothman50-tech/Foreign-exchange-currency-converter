import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AppButton } from '../../../shared/components/button/button';
import { FxStore } from '../fx-store';

@Component({
  selector: 'app-log-tab',
  imports: [DatePipe, DecimalPipe, AppButton],
  templateUrl: './log-tab.html',
  styleUrl: './log-tab.scss',
})
export class LogTab {
  protected readonly store = inject(FxStore);
}
