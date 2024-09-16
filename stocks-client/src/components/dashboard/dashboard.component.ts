import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TickerSearchComponent } from '../ticker-search/ticker-search.component';
import { MiniChartComponent } from '../mini-chart/mini-chart.component';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { TuiButton, TuiGroup } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';
import { IntervalSelectComponent } from '../interval-select/interval-select.component';
import { WebsocketService } from '../../services/websocket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartComponent,
    ReactiveFormsModule,
    TickerSearchComponent,
    MiniChartComponent,
    AsyncPipe,
    TuiGroup,
    TuiButton,
    IntervalSelectComponent,
    CurrencyPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardTickers$ = this.dashboardService.savedTickers$;

  interval: TimeSeriesInterval = 'hour';

  currentPrices: Record<string, number> = {};

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService,
    private router: Router
  ) {
    this.websocketService.stockUpdates$.pipe(takeUntilDestroyed()).subscribe((res) => {
      console.log(res);
      this.currentPrices[res.symbol] = res.price;

      const tickerElem = document.getElementById('ticker-' + res.symbol);
      tickerElem?.classList.add('flash');
      setTimeout(() => tickerElem?.classList.remove('flash'), 2000);
    });
  }

  ngOnInit(): void {
    for (const ticker of this.dashboardTickers$.value) {
      this.websocketService.subscribeToStock(ticker);
    }
  }

  ngOnDestroy(): void {
    this.websocketService.closeConnection();
  }

  goToTickerInfo(ticker: string) {
    this.router.navigate(['ticker', ticker]);
  }

  /*
  TODO
  - Get saved tickers from localStorage (guest) or user account
  - Granularity setting (Day, Month, Year)
  - Show grid "preview" charts with limited data (name, current price, chart line )
  - Show suggested stocks based on these slighlty greyed out with a plus button to quick add
  */
}
