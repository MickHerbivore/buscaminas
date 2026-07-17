import { effect, Injectable, signal } from '@angular/core';
import { Locale, TranslationKey, translations } from './translations';

const STORAGE_KEY = 'buscaminas-locale';
const SUPPORTED: Locale[] = ['es', 'en', 'zh'];
const DEFAULT_LOCALE: Locale = 'es';

const LANG_ATTR: Record<Locale, string> = {
  es: 'es',
  en: 'en',
  zh: 'zh-Hans',
};

function isSupportedLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED as string[]).includes(value);
}

function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const nav = (navigator.language ?? '').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('en')) return 'en';
  if (nav.startsWith('es')) return 'es';
  return DEFAULT_LOCALE;
}

function readInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return detectLocale();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isSupportedLocale(stored)) return stored;
  return detectLocale();
}

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly _locale = signal<Locale>(readInitialLocale());

  readonly locale = this._locale.asReadonly();

  constructor() {
    effect(() => {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = LANG_ATTR[this._locale()];
      }
    });
  }

  setLocale(locale: Locale): void {
    this._locale.set(locale);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value = translations[this._locale()][key] ?? key;
    if (params) {
      value = value.replace(/\{(\w+)\}/g, (match, name) =>
        name in params ? String(params[name]) : match,
      );
    }
    return value;
  }
}
