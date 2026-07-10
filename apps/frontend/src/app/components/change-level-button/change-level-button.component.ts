import {
  Component,
  inject,
  signal,
} from '@angular/core';
import { GameStore } from '../../store/game.store';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-change-level-button',
  imports: [LoadingSpinnerComponent],
  templateUrl: './change-level-button.component.html',
})
export class ChangeLevelButtonComponent {
  private readonly store = inject(GameStore);

  protected readonly loading = signal(false);

  protected onChangeLevel(): void {
    this.loading.set(true);
    this.store.changeLevel();
  }
}
