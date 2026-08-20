import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxComponent } from './box.component';
import { Box } from '../../interfaces/box.interface';

describe('BoxComponent', () => {
  let component: BoxComponent;
  let fixture: ComponentFixture<BoxComponent>;

  const box: Box = {
    id: 'b1',
    row: 0,
    column: 0,
    isFlagged: false,
    isRevealed: false,
    minesAroundQuantity: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoxComponent);
    fixture.componentRef.setInput('box', box);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides mines while the game is still playing', () => {
    fixture.componentRef.setInput('box', { ...box, hasMine: true });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.cell-mine-ghost')).toBeNull();
    expect(el.querySelector('app-icon-mine')).toBeNull();
  });

  it('shows a ghost mine on a hidden cell when the game is over', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.componentRef.setInput('box', { ...box, hasMine: true });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.cell-hidden')).toBeTruthy();
    expect(el.querySelector('.cell-mine-ghost')).toBeTruthy();
    expect(el.querySelector('app-icon-mine')).toBeTruthy();
    expect(el.querySelector('app-icon-flag')).toBeNull();
  });

  it('crosses out a wrongly placed flag when the game is over', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.componentRef.setInput('box', { ...box, isFlagged: true });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.cell-wrong-flag')).toBeTruthy();
    expect(el.querySelector('app-icon-flag')).toBeTruthy();
    expect(el.querySelector('app-icon-mine')).toBeNull();
  });

  it('shows the mine over a correctly placed flag when the game is over', () => {
    fixture.componentRef.setInput('isGameOver', true);
    fixture.componentRef.setInput('box', { ...box, isFlagged: true, hasMine: true });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.cell-mine-ghost')).toBeTruthy();
    expect(el.querySelector('app-icon-mine')).toBeTruthy();
    expect(el.querySelector('.cell-wrong-flag')).toBeNull();
  });
});
