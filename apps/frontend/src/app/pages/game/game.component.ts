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
  private readonly router = inject(Router);
  readonly store = inject(GameStore);

  constructor() {
    if (!this.store.gameId()) {
      this.router.navigate(['/']);
    }
  }

  protected boxClicked(boxId: string): void {
    const box = this.store.currentBoxes().find((b) => b.id === boxId);
    if (!box) return;
    if (box.isRotated) {
      if ((box.minesArroundQuantiy ?? 0) > 0) this.store.chord(boxId);
    } else {
      this.store.reveal(boxId);
    }
  }

  protected boxRightClicked(boxId: string): void {
    const box = this.store.currentBoxes().find((b) => b.id === boxId);
    if (!box || box.isRotated) return;
    this.store.flag(boxId);
  }
}
