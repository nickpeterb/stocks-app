import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerSearchComponent } from './ticker-search.component';

describe('TickerSearchComponent', () => {
  let component: TickerSearchComponent;
  let fixture: ComponentFixture<TickerSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickerSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TickerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
