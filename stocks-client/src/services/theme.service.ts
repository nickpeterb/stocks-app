import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme$ = new BehaviorSubject<Theme>(this.getStoredTheme());

  getStoredTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme;
    return stored ?? 'light';
  }

  toggleTheme() {
    const newTheme = this.theme$.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this.theme$.next(newTheme);
  }
}
