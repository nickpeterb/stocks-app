import { Routes } from '@angular/router';
import { TickerInfoComponent } from '../components/ticker-info/ticker-info.component';
import { WelcomeComponent } from '../components/welcome/welcome.component';

export const routes: Routes = [
  // For later when I set up the dashboard
  //   { path: 'dashboard', component: DashboardComponent },
  //   { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'ticker/:ticker', component: TickerInfoComponent },
  { path: '', pathMatch: 'full', component: WelcomeComponent },
];
