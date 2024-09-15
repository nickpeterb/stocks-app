import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// Angular Chart Component
import { AgCharts } from 'ag-charts-angular';
// Chart Options Type Interface
import { AgChartOptions } from 'ag-charts-community';

import { DateTime } from 'luxon';
import { BackendService } from '../../services/backend.service';
import { ThemeService } from '../../services/theme.service';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [AgCharts, TableComponent],
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
        // label: {
        //   formatter: function (params: any) {
        //     const date = new Date(params.value); // Convert milliseconds to Date object
        //     return date.toLocaleDateString(); // Format as 'MM/DD/YYYY' or localized format
        //   },
        // },
        nice: true,
      },
      {
        type: 'number',
        position: 'left',
        // title: { text: 'Price' },
        nice: true,
      },
    ],
  };
  chartOptions: AgChartOptions | null = null;

  @Input() ticker: string | null = null;
  @Input() interval: TimeSeriesInterval | null = null;

  constructor(
    private backendService: BackendService,
    private themeService: ThemeService
  ) {
    this.themeService.theme$.subscribe((newTheme) => {
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
        data: res.values.map((value) => ({
          ...value,
          close: parseFloat(value.close),
          datetime: DateTime.fromSQL(value.datetime).toMillis(),
        })),
      };
    });
  }
}
