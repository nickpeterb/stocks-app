import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapper, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-ticker-search',
  standalone: true,
  imports: [TuiDataListWrapper, TuiFilterByInputPipe, TuiInputModule, ReactiveFormsModule],
  templateUrl: './ticker-search.component.html',
  styleUrl: './ticker-search.component.scss',
})
export class TickerSearchComponent {
  tickerSearchQuery = new FormControl<string>('');
  allTickers: string[] = ['random', 'AAPL', 'MSFT', 'GOOG'];

  @Output() tickerSelected = new EventEmitter<string>();

  onDropdownItemClick(ticker: string) {
    this.tickerSelected.emit(ticker);
  }
}
