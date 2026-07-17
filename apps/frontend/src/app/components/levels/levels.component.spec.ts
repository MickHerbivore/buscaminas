import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';

import { LevelsComponent } from './levels.component';
import { LevelService } from '../../services/level.service';
import type { Level } from '@buscaminas/shared';

function makeLevel(
  id: string,
  mines: number,
  rows = 8,
  cols = 8,
): Level {
  return { id, name: id, rowsQuantity: rows, columnsQuantity: cols, minesQuantity: mines };
}

describe('LevelsComponent', () => {
  let component: LevelsComponent;
  let fixture: ComponentFixture<LevelsComponent>;
  let levelsSignal: ReturnType<typeof signal<Level[]>>;

  beforeEach(async () => {
    levelsSignal = signal<Level[]>([]);
    await TestBed.configureTestingModule({
      imports: [LevelsComponent],
      providers: [
        provideHttpClient(),
        {
          provide: LevelService,
          useValue: { levels: levelsSignal, isLoading: signal(false) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the localized heading', () => {
    const heading = (fixture.nativeElement as HTMLElement).querySelector('h2');
    expect(heading?.textContent).toMatch(/Elige|Choose|选择/);
  });

  it('assigns tier dots by ascending minesQuantity', () => {
    levelsSignal.set([
      makeLevel('expert', 99, 16, 30),
      makeLevel('easy', 10, 8, 8),
      makeLevel('intermediate', 40, 16, 16),
    ]);
    fixture.detectChanges();

    expect(component.tierOf(makeLevel('easy', 10))).toEqual([true, false, false]);
    expect(component.tierOf(makeLevel('intermediate', 40))).toEqual([true, true, false]);
    expect(component.tierOf(makeLevel('expert', 99))).toEqual([true, true, true]);
  });

  it('renders one filled dot when only one level exists', () => {
    levelsSignal.set([makeLevel('solo', 5)]);
    fixture.detectChanges();

    expect(component.tierOf(makeLevel('solo', 5))).toEqual([true]);
  });

  it('derives five dots when five levels exist', () => {
    levelsSignal.set([
      makeLevel('a', 5),
      makeLevel('b', 10),
      makeLevel('c', 15),
      makeLevel('d', 20),
      makeLevel('e', 25),
    ]);
    fixture.detectChanges();

    expect(component.tierOf(makeLevel('c', 15))).toEqual([true, true, true, false, false]);
  });

  it('breaks ties by board size (smaller board first)', () => {
    levelsSignal.set([
      makeLevel('big', 10, 16, 16),
      makeLevel('small', 10, 8, 8),
    ]);
    fixture.detectChanges();

    expect(component.tierOf(makeLevel('small', 10, 8, 8))).toEqual([true, false]);
    expect(component.tierOf(makeLevel('big', 10, 16, 16))).toEqual([true, true]);
  });
});
