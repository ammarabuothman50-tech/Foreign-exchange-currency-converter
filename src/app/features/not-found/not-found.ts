import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AppButton } from '../../shared/components/button/button';

@Component({
  selector: 'app-not-found',
  imports: [AppButton],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  protected readonly router = inject(Router);
}
