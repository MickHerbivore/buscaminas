import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslationService } from '../translation.service';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="font-mono text-xs uppercase tracking-wider px-3 py-1.5 rounded-pill
             border border-trazo-suave bg-noche hover:bg-tabula transition-colors
             text-tinta select-none min-h-9 inline-flex items-center gap-1.5"
      (click)="i18n.toggle()"
      [attr.aria-label]="i18n.t('lang.label')">
      <span aria-hidden="true" class="text-sm leading-none">⌖</span>
      <span class="hidden xs:inline">{{ i18n.locale() === 'es' ? 'ES' : 'EN' }}</span>
      <span class="sr-only">/ {{ i18n.locale() === 'es' ? 'EN' : 'ES' }}</span>
    </button>
  `,
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(TranslationService);
}
