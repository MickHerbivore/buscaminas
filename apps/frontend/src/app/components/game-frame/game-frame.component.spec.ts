import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { GameFrameComponent } from './game-frame.component';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';

describe('GameFrameComponent', () => {
  let component: GameFrameComponent;
  let fixture: ComponentFixture<GameFrameComponent>;

  const level: Level = {
    id: 'l1',
    name: 'Easy',
    rowsQuantity: 2,
    columnsQuantity: 2,
    minesQuantity: 1,
  };
  const boxes: Box[] = [
    {
      id: 'b1',
      row: 0,
      column: 0,
      isFlagged: false,
      isRevealed: false,
      minesAroundQuantity: 0,
    },
    {
      id: 'b2',
      row: 0,
      column: 1,
      isFlagged: false,
      isRevealed: false,
      minesAroundQuantity: 0,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFrameComponent],
      providers: [provideHttpClient(withXhr()), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GameFrameComponent);
    fixture.componentRef.setInput('level', level);
    fixture.componentRef.setInput('boxes', boxes);
    fixture.componentRef.setInput('hasWon', false);
    fixture.componentRef.setInput('isGameOver', false);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
