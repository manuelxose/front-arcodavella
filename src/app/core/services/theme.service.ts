// src/app/core/services/theme.service.ts
import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/theme.model';
import { effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public theme = signal<Theme>({ mode: 'light', color: 'red' }); // Cambiado a 'light' y 'red'

  constructor() {
    this.loadTheme();
    effect(() => {
      this.setTheme();
    });
  }

  private loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.theme.set(JSON.parse(theme));
    }
  }

  private setTheme() {
    localStorage.setItem('theme', JSON.stringify(this.theme()));
    this.setThemeClass();
  }

  public get isDark(): boolean {
    return this.theme().mode === 'dark';
  }

  private setThemeClass() {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.className = this.theme().mode;
      htmlElement.setAttribute('data-theme', this.theme().color);
    }
  }
}
