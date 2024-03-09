import { Component, Input } from '@angular/core';
import { Box } from '../../interfaces/box.interface';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  @Input()
  public box: Box = {} as Box;

  public opened: boolean = false;
  public flagged: boolean = false;

  constructor() {
  }

  open() {
    this.opened = true;
  }

  flag() {
    this.flagged = !this.flagged;
  }

  hasFlag() {
    return this.flagged;
  }

  isOpened() {
    return this.opened;
  }

  isClosed() {
    return !this.opened;
  }

  isFlagged() {
    return this.flagged;
  }

}
