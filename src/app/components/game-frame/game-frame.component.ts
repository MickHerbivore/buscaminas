import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-game-frame',
  standalone: true,
  imports: [NgFor, BoxComponent],
  templateUrl: './game-frame.component.html',
  styleUrl: './game-frame.component.css'
})
export class GameFrameComponent {

  public boxesX: number = 8;
  public boxesY: number = 8;
  public boxes: Box[][] = [];

  constructor() {
    this.boxes = this.createBoxes();
    this.putMines();
  }


  private createBoxes(): Box[][] {
    let boxes: Box[][] = [];
    for (let i = 0; i < this.boxesX; i++) {
      boxes[i] = [];
      for (let j = 0; j < this.boxesY; j++) {
        boxes[i][j] = {
          x: i,
          y: j,
          hasMine: false,
          isFlagged: false,
        };
      }
    }
    return boxes;
    
  }

  private putMines() {
    const mines = 10;
    for (let i = 0; i < mines; i++) {
      let x = Math.floor(Math.random() * this.boxesX);
      let y = Math.floor(Math.random() * this.boxesY);
      this.boxes[x][y].hasMine = true;
    }
  }

}
