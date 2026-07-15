import {
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { BoxComponent } from '../box/box.component';

interface BoardRow {
  label: string;
  cells: Box[];
}

function colLabel(n: number): string {
  let s = '';
  let i = n + 1;
  while (i > 0) {
    const mod = (i - 1) % 26;
    s = String.fromCharCode(65 + mod) + s;
    i = Math.floor((i - 1) / 26);
  }
  return s;
}

@Component({
  selector: 'app-boxes-frame',
  imports: [BoxComponent],
  templateUrl: './boxes-frame.component.html',
})
export class BoxesFrameComponent {
  public level = input.required<Level | null>();
  public boxes = input.required<Box[]>();
  public hasWon = input.required<boolean>();
  public isGameOver = input.required<boolean>();

  public boxClickedEvent = output<string>();
  public boxRightClickEvent = output<string>();

  protected readonly cellSize = computed(() => {
    const cols = this.level()?.columnsQuantity ?? 8;
    return `clamp(var(--board-cell-min), calc((100dvw - 5.5rem) / ${cols}), var(--board-cell-max))`;
  });

  protected readonly rows = computed<BoardRow[]>(() => {
    const boxes = this.boxes();
    const byRow = new Map<number, Box[]>();
    for (const b of boxes) {
      const arr = byRow.get(b.row) ?? [];
      arr.push(b);
      byRow.set(b.row, arr);
    }
    return [...byRow.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([rowIndex, cells]) => ({
        label: String(rowIndex + 1),
        cells: cells.sort((a, b) => a.column - b.column),
      }));
  });

  protected readonly colLabels = computed<string[]>(() => {
    const cols = this.level()?.columnsQuantity ?? 0;
    return Array.from({ length: cols }, (_, i) => colLabel(i));
  });

  protected boxClicked(boxId: string) {
    this.boxClickedEvent.emit(boxId);
  }

  protected boxRightClicked(boxId: string) {
    this.boxRightClickEvent.emit(boxId);
  }
}
