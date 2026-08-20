import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { GameFrameComponent } from './game-frame.component';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { TranslationService } from '../../i18n/translation.service';

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

  function viewBoardButton(): HTMLButtonElement {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    return [...buttons].find((b: HTMLButtonElement) =>
      b.textContent?.includes('Ver tablero'),
    ) as HTMLButtonElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameFrameComponent],
      providers: [provideHttpClient(withXhr()), provideRouter([])],
    }).compileComponents();

    TestBed.inject(TranslationService).setLocale('es');

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

  it('shows the lose overlay when the game is over', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('[role="status"]');
    expect(status).toBeTruthy();
    expect(status.textContent).toContain('¡Pierdes!');
    expect(viewBoardButton()).toBeTruthy();
  });

  it('dismisses the lose overlay and reveals the board', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.detectChanges();

    viewBoardButton().click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-reset-button')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('¡Pierdes!');
  });

  it('resets the dismissed overlay on a new game', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.detectChanges();
    viewBoardButton().click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();

    fixture.componentRef.setInput('isGameOver', false);
    fixture.detectChanges();
    fixture.componentRef.setInput('isGameOver', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('dismisses the win overlay and removes confetti', () => {
    fixture.componentRef.setInput('hasWon', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-confetti')).toBeTruthy();

    viewBoardButton().click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-confetti')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-reset-button')).toBeTruthy();
  });
});
