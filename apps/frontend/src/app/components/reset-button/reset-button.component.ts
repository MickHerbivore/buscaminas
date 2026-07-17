import { Component, inject } from '@angular/core';
import { GameStore } from '../../store/game.store';
import { TransPipe } from '../../i18n/trans.pipe';

@Component({
  selector: 'app-reset-button',
  imports: [TransPipe],
  templateUrl: './reset-button.component.html',
})
export class ResetButtonComponent {
  private readonly store = inject(GameStore);

  protected resetGame(): void {
    this.store.newGame();
  }
}
