import { Component, inject } from '@angular/core';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-reset-button',
  imports: [],
  templateUrl: './reset-button.component.html',
})
export class ResetButtonComponent {
  private readonly store = inject(GameStore);

  protected resetGame(): void {
    this.store.newGame();
  }
}
