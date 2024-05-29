import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { BoxesService } from '../../services/boxes.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-reset-button',
  standalone: true,
  imports: [],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.css',
})
export class ResetButtonComponent implements OnDestroy {
  private gameService = inject(GameService);
  private boxesService = inject(BoxesService);

  private resetBoxesSubs: Subscription = new Subscription();

  public resetGame() {
    this.gameService.resetGame();
    this.resetBoxes();
  }

  private resetBoxes() {
    this.resetBoxesSubs = this.boxesService
      .putBoxes(this.gameService.gameId()!, this.boxesService.boxes())
      .subscribe();
  }

  ngOnDestroy() {
    this.resetBoxesSubs.unsubscribe();
  }
}
