import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';


@Component({
    selector: 'app-change-level-button',
    imports: [LoadingSpinnerComponent],
    templateUrl: './change-level-button.component.html',
    styleUrl: './change-level-button.component.css'
})
export class ChangeLevelButtonComponent implements OnDestroy {

  private gameService = inject( GameService );
  
  private deleteSubs: Subscription = new Subscription();

  public loading: boolean = false;

  public onChangeLevel() {
    this.loading = true;
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
