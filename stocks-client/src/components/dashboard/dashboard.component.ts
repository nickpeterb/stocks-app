import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TickerSearchComponent } from '../ticker-search/ticker-search.component';
import { MiniChartComponent } from '../mini-chart/mini-chart.component';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule, TickerSearchComponent, MiniChartComponent, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  dashboardTickers$ = this.dashboardService.savedTickers$;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
