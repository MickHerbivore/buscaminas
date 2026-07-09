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
    isRotated: false,
    minesArroundQuantiy: 0,
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
});
