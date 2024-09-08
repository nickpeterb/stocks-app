import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { BackendService } from '../../services/backend.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TickerSearchComponent } from '../ticker-search/ticker-search.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, ReactiveFormsModule, TickerSearchComponent, ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  dashboardTickers: string[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {}

  /*
  TODO
  - Get saved tickers from localStorage (guest) or user account
  - Granularity setting (Day, Month, Year)
  - Show grid "preview" charts with limited data (name, current price, chart line )
  - Show suggested stocks based on these slighlty greyed out with a plus button to quick add
  */
}
