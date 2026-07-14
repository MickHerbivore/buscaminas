import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationKey } from './translations';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'trans',
  pure: false,
})
export class TransPipe implements PipeTransform {
  private readonly i18n = inject(TranslationService);

  transform(key: TranslationKey): string {
    return this.i18n.t(key);
  }
}
