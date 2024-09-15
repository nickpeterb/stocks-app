import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ActivatedRoute } from '@angular/router';
import { TuiButton, TuiGroup } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../table/table.component';
import { BehaviorSubject, combineLatest, filter, map, mergeMap } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ticker-info',
  standalone: true,
  imports: [ChartComponent, TuiGroup, TuiButton, TableComponent, AsyncPipe],
  templateUrl: './ticker-info.component.html',
  styleUrl: './ticker-info.component.scss',
})
export class TickerInfoComponent {
  ticker$ = this.route.paramMap.pipe(map((res) => res.get('ticker')));

  intervals: TimeSeriesInterval[] = ['minute', 'hour', 'day', 'week', 'month'];
  interval$ = new BehaviorSubject<TimeSeriesInterval>('hour');

  data$ = combineLatest([this.ticker$, this.interval$]).pipe(
    takeUntilDestroyed(),
    filter(([ticker, interval]) => !!ticker && !!interval),
    mergeMap(([ticker, interval]) => {
      return this.backendService.getStockTimeSeries(ticker ?? 'ERROR', interval);
    })
  );

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService
  ) {}
}
