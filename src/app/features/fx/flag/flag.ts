import { Component, input, linkedSignal } from '@angular/core';

@Component({
  selector: 'app-flag',
  templateUrl: './flag.html',
  styleUrl: './flag.scss',
})
export class Flag {
  readonly code = input.required<string>();

  protected readonly missing = linkedSignal({ source: this.code, computation: () => false });
}
