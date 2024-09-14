import { TuiButton, TuiRoot } from '@taiga-ui/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AsyncPipe } from '@angular/common';
import { TickerSearchComponent } from '../components/ticker-search/ticker-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TuiRoot, TuiRoot, TuiButton, AsyncPipe, TickerSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'stocks-client';

  theme$ = this.themeService.theme$;

  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
