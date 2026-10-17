import { Component, input } from '@angular/core';
import { Button, ButtonSeverity } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [Button],
  templateUrl: './button.html',
})
export class AppButton {
  readonly label = input.required<string>();
  readonly variant = input<ButtonSeverity>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly outlined = input(false);
  readonly loading = input(false);
  readonly disabled = input(false);
}
