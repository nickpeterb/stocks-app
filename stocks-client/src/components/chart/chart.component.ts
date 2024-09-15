import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// Angular Chart Component
import { AgCharts } from 'ag-charts-angular';
// Chart Options Type Interface
import { AgChartOptions } from 'ag-charts-community';

import { ThemeService } from '../../services/theme.service';
import { StockPriceValues } from '../../models/twelve-data.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnChanges {
  baseChartOptions: AgChartOptions = {
    theme: 'ag-default',
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
      },
    ],
    axes: [
      {
        type: 'time',
        position: 'bottom',
        nice: true,
      },
      {
        type: 'number',
        position: 'left',
        nice: true,
        label: {
          format: '$#{.2f}',
        },
      },
    ],
  };
  chartOptions: AgChartOptions | null = null;

  @Input() data: StockPriceValues[] = [];

  constructor(private themeService: ThemeService) {
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
    const data: StockPriceValues[] = changes['data']?.currentValue;
    if (!data) return;

    this.chartOptions = {
      ...this.baseChartOptions,
      data: data,
    };
  }
}
