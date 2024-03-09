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
  public mines: number = 10;

  constructor() {
    this.boxes = this.createBoxes();
    this.putMines();
    this.putNumbers();
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
          isRotated: false,
          numberOfMinesAround: 0
        };
      }
    }
    return boxes;
    
  }

  private putMines() {
    for (let i = 0; i < this.mines; i++) {
      let x = Math.floor(Math.random() * this.boxesX);
      let y = Math.floor(Math.random() * this.boxesY);
      this.boxes[x][y].hasMine = true;
    }
  }

  public putNumbers() {
    for (let i = 0; i < this.boxesX; i++) {
      for (let j = 0; j < this.boxesY; j++) {
        if (!this.boxes[i][j].hasMine) {
          this.boxes[i][j].numberOfMinesAround = this.getNumberOfMinesAround(i, j);
        }
      }
    }
  }


  private getNumberOfMinesAround(x: number, y: number): number {
    let numberOfMines = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < this.boxesX && j >= 0 && j < this.boxesY) {
          if (this.boxes[i][j].hasMine) {
            numberOfMines++;
          }
        }
      }
    }
    return numberOfMines;
  }

}
