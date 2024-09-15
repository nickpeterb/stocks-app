import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiButton, TuiGroup } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-ticker-info',
  standalone: true,
  imports: [ChartComponent, TuiGroup, TuiButton, TableComponent],
  templateUrl: './ticker-info.component.html',
  styleUrl: './ticker-info.component.scss',
})
export class TickerInfoComponent {
  ticker: string | null = null;

  intervals: TimeSeriesInterval[] = ['minute', 'hour', 'day', 'week', 'month'];
  currInterval: TimeSeriesInterval = 'hour';

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((res) => {
      this.ticker = res.get('ticker');
    });
  }

  selectInterval(interval: TimeSeriesInterval) {
    this.currInterval = interval;
  }
}
