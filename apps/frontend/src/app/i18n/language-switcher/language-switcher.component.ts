import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Locale } from '../translations';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-flex items-center">
      <label class="sr-only" for="lang-select">{{ i18n.t('lang.label') }}</label>
      <select
        id="lang-select"
        class="font-mono text-xs uppercase tracking-wider pl-3 pr-7 py-1.5 rounded-pill
border border-soft-stroke bg-night text-ink
                hover:bg-table transition-colors
               select-none min-h-9 cursor-pointer appearance-none"
        (change)="onChange($event)"
        [attr.aria-label]="i18n.t('lang.label')">
        <option value="es" [selected]="i18n.locale() === 'es'">ES · Español</option>
        <option value="en" [selected]="i18n.locale() === 'en'">EN · English</option>
        <option value="zh" [selected]="i18n.locale() === 'zh'">中文 · 简体</option>
      </select>
      <span aria-hidden="true" class="pointer-events-none absolute right-2 text-soft-ink text-xs">▾</span>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(TranslationService);

  protected onChange(event: Event): void {
    this.i18n.setLocale((event.target as HTMLSelectElement).value as Locale);
  }
}
