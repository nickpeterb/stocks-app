import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFilterByInputPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { TuiComboBoxModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { BackendService } from '../../services/backend.service';
import { AsyncPipe } from '@angular/common';
import { TuiLet } from '@taiga-ui/cdk/directives/let';
import { TuiDataList, TuiLoader } from '@taiga-ui/core';
import { debounceTime, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TwelveSearchResult } from '../../models/twelve-data.types';

@Component({
  selector: 'app-ticker-search',
  standalone: true,
  imports: [
    TuiLet,
    TuiLoader,
    TuiDataList,
    TuiFilterByInputPipe,
    TuiInputModule,
    ReactiveFormsModule,
    TuiComboBoxModule,
    TuiTextfieldControllerModule,
    AsyncPipe,
  ],
  templateUrl: './ticker-search.component.html',
  styleUrl: './ticker-search.component.scss',
})
export class TickerSearchComponent {
  selectedTicker = new FormControl<TwelveSearchResult | null>(null);
  tickerSearchQuery = '';
  allTickers: string[] = ['random', 'AAPL', 'MSFT', 'GOOG'];
  searchResults: { name: string }[] = [];

  @Output() tickerSelected = new EventEmitter<TwelveSearchResult>();

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {
    this.selectedTicker.valueChanges.pipe(takeUntilDestroyed()).subscribe((ticker) => {
      if (ticker) {
        this.tickerSelected.emit(ticker);
        this.router.navigate(['ticker', ticker?.symbol]);
      }
    });
  }

  search$ = new Subject<string | null>();

  items$: Observable<TwelveSearchResult[]> = this.search$.pipe(
    debounceTime(200),
    switchMap((query) => {
      if (!query) return of([]);
      return this.backendService.searchSymbols(query);
    }),
    startWith([])
  );

  searchStocks(query: string) {
    this.search$.next(query);
  }

  stringify = (item: TwelveSearchResult): string => `${item.symbol} - ${item.instrument_name}`;
}
