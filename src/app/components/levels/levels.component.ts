
import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';
import { LevelService } from '../../services/level.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-levels',
  imports: [LoadingSpinnerComponent],
  templateUrl: './levels.component.html',
})
export class LevelsComponent implements OnDestroy {

  private gameService = inject(GameService);
  private levelService = inject(LevelService);

  private initGameSubs: Subscription = new Subscription();

  public levels = this.levelService.levels;
  public loading: boolean = false;


  onLevel(level: Level) {
    this.gameService.prepareGame(level);

    this.loading = true;
    this.initGameSubs = this.gameService.initGame().subscribe();
  }

  ngOnDestroy(): void {
    this.initGameSubs.unsubscribe();
  }

}
