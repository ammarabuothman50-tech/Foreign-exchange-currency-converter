import { Injectable, ViewContainerRef } from '@angular/core';

import { Toast, ToastType } from '../../shared/components/toast/toast';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private host?: ViewContainerRef;

  setHost(host: ViewContainerRef): void {
    this.host = host;
  }

  show(message: string, type: ToastType = 'success'): void {
    if (!this.host) return;

    const toast = this.host.createComponent(Toast);
    toast.setInput('message', message);
    toast.setInput('type', type);
    setTimeout(() => toast.destroy(), 3000);
  }
}
