import { Component, inject, signal } from '@angular/core';
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

  protected level = this.store.level;
  protected boxes = this.store.boxes;
  protected hasWon = signal(false);
  protected isGameOver = signal(false);

  constructor() {
    if (!this.store.gameId()) {
      this.router.navigate(['/']);
    }
  }

  protected boxClicked(boxId: string) {
    console.log('boxClicked', boxId);
  }

  protected boxRightClicked(boxId: string) {
    console.log('boxRightClicked', boxId);
  }

  resetGame(): void {
    this.store.resetGame();
  }
}
