import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
// Angular Chart Component
import { AgCharts } from 'ag-charts-angular';
// Chart Options Type Interface
import { AgChartOptions } from 'ag-charts-community';

import { DateTime } from 'luxon';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent implements OnChanges {
  // Chart Options

  baseChartOptions: AgChartOptions = {
    // Series: Defines which chart type and data to use
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'value',
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
        title: { text: 'Date' },
        label: {
          formatter: function (params: any) {
            const date = new Date(params.value); // Convert milliseconds to Date object
            return date.toLocaleDateString(); // Format as 'MM/DD/YYYY' or localized format
          },
        },
        nice: true,
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Value' },
        nice: true,
      },
    ],
  };
  chartOptions: AgChartOptions | null = null;

  @Input() ticker: string | null = null;
  startDate: number = DateTime.now().startOf('day').minus({ month: 1 }).toMillis();
  endDate: number = DateTime.now().startOf('day').toMillis();

  constructor(private backendService: BackendService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const ticker = changes['ticker'].currentValue;
    if (!ticker) return;
    this.backendService.getRandomTimeSeries(this.startDate, this.endDate).subscribe((res) => {
      this.chartOptions = {
        ...this.baseChartOptions,
        data: res,
      };
    });
  }
}
