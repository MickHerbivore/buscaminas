import {
  Component,
  computed,
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

  private readonly tierMap = computed(() => {
    const sorted = [...this.levels()].sort(
      (a, b) =>
        a.minesQuantity - b.minesQuantity ||
        a.rowsQuantity * a.columnsQuantity - b.rowsQuantity * b.columnsQuantity,
    );
    const total = sorted.length;
    const map = new Map<string, { filled: number; total: number }>();
    sorted.forEach((level, index) => {
      map.set(level.id, { filled: index + 1, total });
    });
    return map;
  });

  tierOf(level: Level): boolean[] {
    const tier = this.tierMap().get(level.id);
    if (!tier) return [true];
    return Array.from({ length: tier.total }, (_, i) => i < tier.filled);
  }
}
