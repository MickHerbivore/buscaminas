import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-game',
  imports: [GameFrameComponent],
  templateUrl: './game.component.html',
})
export class GameComponent {
  readonly router = inject(Router);
  readonly store = inject(GameStore);

  constructor() {
    if (!this.store.gameId()) {
      this.router.navigate(['/']);
    }
  }

  startGame(): void {
    // TODO: Start game
  }

  resetGame(): void {
    this.store.resetGame();
  }
}
