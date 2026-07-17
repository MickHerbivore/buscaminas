import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { BoxComponent } from '../box/box.component';

interface BoardRow {
  cells: Box[];
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

  private readonly scrollerRef = viewChild<ElementRef<HTMLDivElement>>('scroller');
  private readonly destroyRef = inject(DestroyRef);
  private ro?: ResizeObserver;

  protected readonly shadowStart = signal(false);
  protected readonly shadowEnd = signal(false);

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
      .map(([, cells]) => ({
        cells: cells.sort((a, b) => a.column - b.column),
      }));
  });

  constructor() {
    effect(() => {
      const el = this.scrollerRef()?.nativeElement;
      this.ro?.disconnect();
      if (!el) {
        this.shadowStart.set(false);
        this.shadowEnd.set(false);
        return;
      }
      this.updateShadows();
      this.ro = new ResizeObserver(() => this.updateShadows());
      this.ro.observe(el);
      const content = el.firstElementChild;
      if (content) this.ro.observe(content);
    });
    this.destroyRef.onDestroy(() => this.ro?.disconnect());
  }

  protected onScroll(): void {
    this.updateShadows();
  }

  private updateShadows(): void {
    const el = this.scrollerRef()?.nativeElement;
    if (!el) return;
    this.shadowStart.set(el.scrollLeft > 1);
    this.shadowEnd.set(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  protected boxClicked(boxId: string) {
    this.boxClickedEvent.emit(boxId);
  }

  protected boxRightClicked(boxId: string) {
    this.boxRightClickEvent.emit(boxId);
  }
}
