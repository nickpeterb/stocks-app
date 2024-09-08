import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticker-info',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './ticker-info.component.html',
  styleUrl: './ticker-info.component.scss',
})
export class TickerInfoComponent implements OnInit {
  ticker: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.ticker = this.route.snapshot.paramMap.get('ticker');
  }
}
