import { Component, Input } from '@angular/core';
import { StockPriceValues } from '../../models/twelve-data.types';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data: StockPriceValues[] = [];
}
