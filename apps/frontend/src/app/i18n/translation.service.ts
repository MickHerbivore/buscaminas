import { effect, Injectable, signal } from '@angular/core';
import { Locale, TranslationKey, translations } from './translations';

const STORAGE_KEY = 'buscaminas-locale';
const SUPPORTED: Locale[] = ['es', 'en'];

function readInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'es';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED.includes(stored as Locale)) return stored as Locale;
  return 'es';
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _locale = signal<Locale>(readInitialLocale());

  readonly locale = this._locale.asReadonly();

  constructor() {
    effect(() => {
      const locale = this._locale();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, locale);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = locale;
      }
    });
  }

  setLocale(locale: Locale): void {
    this._locale.set(locale);
  }

  toggle(): void {
    this._locale.update((l) => (l === 'es' ? 'en' : 'es'));
  }

  t(key: TranslationKey): string {
    return translations[this._locale()][key] ?? key;
  }
}
