import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-change-level-button',
  standalone: true,
  imports: [],
  templateUrl: './change-level-button.component.html',
  styleUrl: './change-level-button.component.css'
})
export class ChangeLevelButtonComponent implements OnDestroy {

  private gameService = inject( GameService );
  
  private deleteSubs: Subscription = new Subscription();

  public onChangeLevel() {
    this.deleteGame();
  }
  
  private deleteGame() {
    this.deleteSubs = this.gameService.deleteGame().subscribe({
      next: () => {
        this.gameService.clearGame();
      },
      error: (error) => {
        console.error('Error deleting game', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.deleteSubs.unsubscribe();
  }

}
