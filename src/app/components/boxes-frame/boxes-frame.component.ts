import { Component, input } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { BoxComponent } from '../box/box.component';

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
}
