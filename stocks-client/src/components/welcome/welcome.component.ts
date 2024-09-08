import { Component } from '@angular/core';
import { TickerSearchComponent } from '../ticker-search/ticker-search.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [TickerSearchComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  constructor(private router: Router) {}

  onTickerSelection(ticker: string) {
    this.router.navigate(['ticker', ticker]);
  }
}
