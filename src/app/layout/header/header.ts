import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FxStore } from '../../features/fx/fx-store';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly store = inject(FxStore);
}
