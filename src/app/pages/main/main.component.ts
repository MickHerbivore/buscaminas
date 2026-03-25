
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-main',
  imports: [LevelsComponent],
  templateUrl: './main.component.html',
})
export class MainComponent {
  private gameService = inject(GameService);
  private router = inject(Router);

  public gameId = this.gameService.gameId;

  constructor() {
    if (this.gameId()) {
      this.router.navigate(['game']);
    }
  }

  createGame(levelId: string) {
    this.gameService.createGame(levelId)
      .pipe(take(1))
      .subscribe({
        next: ({ id: gameId }) => {
          console.log('Game created with ID:', gameId);
          this.router.navigate(['game']);
        },
        error: (err) => {
          console.error('Failed to create game:', err);
        },
      })
  }
}
