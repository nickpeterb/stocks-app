import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { AgCharts } from 'ag-charts-angular';
import { ThemeService } from '../../services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BackendService } from '../../services/backend.service';
import { TimeSeriesInterval } from '../../models/time-series.types';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './mini-chart.component.html',
  styleUrl: './mini-chart.component.scss',
})
export class MiniChartComponent {
  baseChartOptions: AgChartOptions = {
    theme: 'ag-default',
    height: 200,
    width: 300,
    background: { visible: false },
    series: [
      {
        type: 'line',
        xKey: 'datetime',
        yKey: 'close',
        yName: 'Price',
        interpolation: {
          type: 'smooth',
        },
        marker: {
          enabled: false,
        },
      },
    ],
    axes: [
      {
        type: 'time',
        position: 'bottom',
      },
      {
        type: 'number',
        position: 'left',
      },
    ],
  };
  chartOptions: AgChartOptions | null = null;

  @Input() ticker: string | null = null;
  @Input() interval: TimeSeriesInterval | null = null;

  @Output() lastPrice = new EventEmitter<number>();

  constructor(
    private themeService: ThemeService,
    private backendService: BackendService
  ) {
    this.themeService.theme$.pipe(takeUntilDestroyed()).subscribe((newTheme) => {
      const agTheme = newTheme === 'light' ? 'ag-default' : 'ag-default-dark';
      this.baseChartOptions.theme = agTheme;
      this.chartOptions = {
        ...this.chartOptions,
        theme: agTheme,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const ticker = changes['ticker']?.currentValue ?? this.ticker;
    const interval = changes['interval']?.currentValue ?? this.interval;
    if (!ticker || !interval) return;

    this.backendService.getStockTimeSeries(ticker, interval).subscribe((res) => {
      this.chartOptions = {
        ...this.baseChartOptions,
        data: res.values,
      };
      this.lastPrice.next(res.values[0].close);
    });
  }
}
