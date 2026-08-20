import {
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { IconFlagComponent } from '../../shared/components/icon/icon-flag/icon-flag.component';
import { IconMineComponent } from '../../shared/components/icon/icon-mine/icon-mine.component';
import { TranslationService } from '../../i18n/translation.service';

function colLetter(n: number): string {
  let s = '';
  let i = n + 1;
  while (i > 0) {
    const mod = (i - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
}

@Component({
  selector: 'app-box',
  imports: [IconFlagComponent, IconMineComponent],
  templateUrl: './box.component.html',
})
export class BoxComponent {
  public box = input.required<Box>();
  public isGameOver = input(false);

  public clickEvent = output<string>();
  public rightClickEvent = output<string>();

  private readonly i18n = inject(TranslationService);

  protected readonly animDelay = computed(
    () => `${(this.box().row + this.box().column) * 30}ms`,
  );

  protected readonly coordinate = computed(
    () => `${colLetter(this.box().column)}${this.box().row + 1}`,
  );

  protected readonly ariaLabel = computed(() => {
    const b = this.box();
    const coord = this.coordinate();
    if (b.isRevealed) {
      if (b.hasMine) return `${coord} · ${this.i18n.t('box.mine')}`;
      const n = b.minesAroundQuantity ?? 0;
      if (n > 0) return `${coord} · ${this.i18n.t('box.minesNear', { n })}`;
      return `${coord} · ${this.i18n.t('box.empty')}`;
    }
    if (this.isGameOver()) {
      if (b.hasMine) return `${coord} · ${this.i18n.t('box.mineHidden')}`;
      if (b.isFlagged) return `${coord} · ${this.i18n.t('box.wrongFlag')}`;
    }
    if (b.isFlagged) return `${coord} · ${this.i18n.t('box.flagged')}`;
    return `${coord} · ${this.i18n.t('box.hidden')}`;
  });

  protected onClick() {
    this.clickEvent.emit(this.box().id);
  }

  protected onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.rightClickEvent.emit(this.box().id);
  }

  protected onKey(event: KeyboardEvent) {
    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        this.clickEvent.emit(this.box().id);
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        this.rightClickEvent.emit(this.box().id);
        break;
    }
  }
}
