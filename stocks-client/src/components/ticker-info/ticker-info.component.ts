import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ActivatedRoute } from '@angular/router';
import { TuiButton, TuiGroup, TuiHint } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../table/table.component';
import { BehaviorSubject, combineLatest, filter, map, mergeMap } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { AsyncPipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { IntervalSelectComponent } from '../interval-select/interval-select.component';

@Component({
  selector: 'app-ticker-info',
  standalone: true,
  imports: [ChartComponent, TuiGroup, TuiButton, TableComponent, AsyncPipe, TuiHint, IntervalSelectComponent],
  templateUrl: './ticker-info.component.html',
  styleUrl: './ticker-info.component.scss',
})
export class TickerInfoComponent {
  ticker$ = this.route.paramMap.pipe(map((res) => res.get('ticker')));

  interval$ = new BehaviorSubject<TimeSeriesInterval>('hour');

  data$ = combineLatest([this.ticker$, this.interval$]).pipe(
    takeUntilDestroyed(),
    filter(([ticker, interval]) => !!ticker && !!interval),
    mergeMap(([ticker, interval]) => {
      return this.backendService.getStockTimeSeries(ticker ?? 'ERROR', interval);
    })
  );

  dashboardTickers$ = this.dashboardService.savedTickers$;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    public dashboardService: DashboardService
  ) {}

  handleDashboardBtn(ticker: string) {
    const isAdded = this.dashboardTickers$.value.has(ticker);
    if (isAdded) this.dashboardService.delete(ticker);
    else this.dashboardService.add(ticker);
  }
}
