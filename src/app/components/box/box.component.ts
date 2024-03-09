import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Box } from '../../interfaces/box.interface';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  @Input()
  public box: Box = {} as Box;
  @Input()
  public isGameOver: boolean = false;
  @Output()
  public gameOverEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  public onRightClick() {
    if (this.isGameOver) return;

    this.box.isFlagged = !this.box.isFlagged;
    return false;
  }

  public onClick() {
    if (this.isGameOver) return;

    this.box.isRotated = true;

    if (this.box.hasMine) {
      this.gameOverEvent.emit(true);
    }
  }

}
