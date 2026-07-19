import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameStore } from '../../store/game.store';
import { IconCompassComponent } from '../../shared/components/icon/icon-compass/icon-compass.component';
import { TransPipe } from '../../i18n/trans.pipe';

@Component({
  selector: 'app-main',
  imports: [LevelsComponent, IconCompassComponent, TransPipe],
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
    void this.gameStore.createGame(levelId);
  }
}
