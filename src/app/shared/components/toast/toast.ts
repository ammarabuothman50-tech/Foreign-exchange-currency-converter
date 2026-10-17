import { Component, input } from '@angular/core';

export type ToastType = 'success' | 'error';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  host: { '[class]': 'type()', role: 'status' },
})
export class Toast {
  readonly message = input.required<string>();
  readonly type = input<ToastType>('success');
}
