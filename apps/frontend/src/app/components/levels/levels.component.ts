import {
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { Level } from '../../interfaces/level.interface';
import { LevelService } from '../../services/level.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TransPipe } from '../../i18n/trans.pipe';

@Component({
  selector: 'app-levels',
  imports: [LoadingSpinnerComponent, TransPipe],
  templateUrl: './levels.component.html',
})
export class LevelsComponent {
  private levelService = inject(LevelService);

  protected readonly levels = this.levelService.levels;
  protected readonly levelsLoading = this.levelService.isLoading;
  protected readonly submittedId = signal<string | null>(null);

  public levelIdSelectedEvent = output<string>();

  onLevel(level: Level) {
    if (this.submittedId() !== null) return;
    this.submittedId.set(level.id);
    this.levelIdSelectedEvent.emit(level.id);
  }

  density(level: Level): number {
    const total = level.rowsQuantity * level.columnsQuantity;
    if (total <= 0) return 0;
    return Math.round((level.minesQuantity / total) * 100);
  }
}
