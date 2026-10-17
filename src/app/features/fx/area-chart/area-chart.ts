import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

const WIDTH = 1000;
const HEIGHT = 300;

@Component({
  selector: 'app-area-chart',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './area-chart.html',
  styleUrl: './area-chart.scss',
})
export class AreaChart {
  readonly points = input.required<{ date: string; rate: number }[]>();

  protected readonly chart = computed(() => {
    const points = this.points();
    const rates = points.map((point) => point.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const last = points.length - 1;

    const coords = points.map((point, i) => {
      const x = (i / last) * WIDTH;
      const y = HEIGHT - ((point.rate - min) / (max - min || 1)) * HEIGHT;
      return `${x},${y}`;
    });

    const line = `M${coords.join(' L')}`;
    const ticks = new Set([0, 0.25, 0.5, 0.75, 1].map((step) => Math.round(step * last)));

    return {
      line,
      area: `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`,
      min,
      max,
      mid: (min + max) / 2,
      dates: [...ticks].map((i) => points[i].date),
    };
  });
}
