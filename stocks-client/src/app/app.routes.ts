import { Routes } from '@angular/router';
import { TickerInfoComponent } from '../components/ticker-info/ticker-info.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'ticker/:ticker', component: TickerInfoComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  // { path: '', pathMatch: 'full', component: WelcomeComponent },
];
