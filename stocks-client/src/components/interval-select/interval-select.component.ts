import { Component, EventEmitter, Output } from '@angular/core';
import { TuiButton, TuiGroup } from '@taiga-ui/core';
import { TimeSeriesInterval } from '../../models/time-series.types';

@Component({
  selector: 'app-interval-select',
  standalone: true,
  imports: [TuiButton, TuiGroup],
  templateUrl: './interval-select.component.html',
  styleUrl: './interval-select.component.scss',
})
export class IntervalSelectComponent {
  readonly intervals: TimeSeriesInterval[] = ['minute', 'hour', 'day', 'week', 'month'];

  selectedInterval: TimeSeriesInterval = 'hour';

  @Output() intervalSelected = new EventEmitter<TimeSeriesInterval>();

  select(interval: TimeSeriesInterval) {
    this.selectedInterval = interval;
    this.intervalSelected.emit(interval);
  }
}
