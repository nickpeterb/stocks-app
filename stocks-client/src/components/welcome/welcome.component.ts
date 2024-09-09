import { Component } from '@angular/core';
import { TickerSearchComponent } from '../ticker-search/ticker-search.component';
import { Router } from '@angular/router';
import { TwelveStockInfo } from '../../models/twelve-data.types';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [TickerSearchComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  onTickerSelection(ticker: TwelveStockInfo) {
    this.router.navigate(['ticker', ticker.symbol]);
  }
}
