import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ActivatedRoute } from '@angular/router';
import { TuiButton, TuiGroup, TuiHint } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from '../table/table.component';
import { BehaviorSubject, combineLatest, filter, map, mergeMap, tap } from 'rxjs';
import { BackendService } from '../../services/backend.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { IntervalSelectComponent } from '../interval-select/interval-select.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-ticker-info',
  standalone: true,
  imports: [
    ChartComponent,
    TuiGroup,
    TuiButton,
    TableComponent,
    AsyncPipe,
    TuiHint,
    IntervalSelectComponent,
    CurrencyPipe,
  ],
  templateUrl: './ticker-info.component.html',
  styleUrl: './ticker-info.component.scss',
})
export class TickerInfoComponent implements OnInit {
  ticker$ = this.route.paramMap.pipe(map((res) => res.get('ticker')));

  interval$ = new BehaviorSubject<TimeSeriesInterval>('hour');

  data$ = combineLatest([this.ticker$, this.interval$]).pipe(
    takeUntilDestroyed(),
    filter(([ticker, interval]) => !!ticker && !!interval),
    mergeMap(([ticker, interval]) => {
      return this.backendService.getStockTimeSeries(ticker ?? 'ERROR', interval);
    }),
    tap((res) => (this.currentPrice = res.values[0].close))
  );

  dashboardTickers$ = this.dashboardService.savedTickers$;

  currentPrice: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private backendService: BackendService,
    public dashboardService: DashboardService,
    private websocketService: WebsocketService
  ) {
    combineLatest([this.websocketService.stockUpdates$, this.ticker$])
      .pipe(
        takeUntilDestroyed(),
        filter(([updates, ticker]) => updates.symbol === ticker)
      )
      .subscribe(([res]) => {
        this.currentPrice = res.price;

        const priceElem = document.getElementById('price-' + res.symbol);
        priceElem?.classList.add('flash');
        setTimeout(() => priceElem?.classList.remove('flash'), 1000);
      });
  }

  ngOnInit(): void {
    this.ticker$.subscribe((ticker) => {
      if (ticker) this.websocketService.subscribeToStock(ticker);
    });
  }

  handleDashboardBtn(ticker: string) {
    const isAdded = this.dashboardTickers$.value.has(ticker);
    if (isAdded) this.dashboardService.delete(ticker);
    else this.dashboardService.add(ticker);
  }
}
