import {
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { Level } from '../../interfaces/level.interface';
import { LevelService } from '../../services/level.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-levels',
  imports: [LoadingSpinnerComponent],
  templateUrl: './levels.component.html',
})
export class LevelsComponent {
  private levelService = inject(LevelService);

  protected levels = this.levelService.levels;
  protected readonly loading = signal(false);

  public levelIdSelectedEvent = output<string>();

  onLevel(level: Level) {
    this.loading.set(true);
    this.levelIdSelectedEvent.emit(level.id);
  }
}
