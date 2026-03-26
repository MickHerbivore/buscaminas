
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameStore } from '../../store/game.store';

@Component({
  selector: 'app-main',
  imports: [LevelsComponent],
  templateUrl: './main.component.html',
})
export class MainComponent {
  private gameStore = inject(GameStore);
  private router = inject(Router);

  public gameId = this.gameStore.gameId;

  constructor() {
    if (this.gameId()) {
      this.router.navigate(['game']);
    }
  }

  createGame(levelId: string) {
    this.gameStore.createGame(levelId);
  }
}
