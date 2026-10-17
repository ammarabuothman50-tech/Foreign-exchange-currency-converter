import { afterNextRender, Component, inject, viewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastService } from './core/services/toast.service';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly toastHost = viewChild.required('toastHost', { read: ViewContainerRef });

  constructor() {
    const toasts = inject(ToastService);
    afterNextRender(() => toasts.setHost(this.toastHost()));
  }
}
