import { Injectable } from '@angular/core';
import { Box } from '../interfaces/box.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public boxesBSubject: BehaviorSubject<Box[][]> = new BehaviorSubject<Box[][]>([]);
  public isGameOverBSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hasWonBSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private boxesX: number = 8;
  private boxesY: number = 8;
  private numberOfMines: number = 10;


  public resetGame() {
    this.initializeBoxes();
    this.putMines();
    this.putNumbers();
    this.isGameOverBSubject.next( false );
    this.hasWonBSubject.next( false );
  }

  private initializeBoxes(): void {
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
    
    this.boxesBSubject.next( boxes );    
  }

  private putMines() {
    for (let i = 0; i < this.numberOfMines; i++) {
      let x = Math.floor(Math.random() * this.boxesX);
      let y = Math.floor(Math.random() * this.boxesY);
      this.boxesBSubject.getValue()[x][y].hasMine = true;
    }
  }

  private putNumbers() {
    for (let i = 0; i < this.boxesX; i++) {
      for (let j = 0; j < this.boxesY; j++) {
        if (!this.boxesBSubject.getValue()[i][j].hasMine) {
          this.boxesBSubject.getValue()[i][j].numberOfMinesAround = this.getNumberOfMinesAround(i, j);
        }
      }
    }
  }

  private getNumberOfMinesAround(x: number, y: number): number {
    let numberOfMines = 0;
    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i < this.boxesX && j >= 0 && j < this.boxesY) {
          if (this.boxesBSubject.getValue()[i][j].hasMine) {
            numberOfMines++;
          }
        }
      }
    }
    return numberOfMines;
  }

  public validateWin() {
    for (let i = 0; i < this.boxesX; i++) {
      for (let j = 0; j < this.boxesY; j++) {
        if (!this.boxesBSubject.getValue()[i][j].hasMine && !this.boxesBSubject.getValue()[i][j].isRotated) {
          return;
        }
      }
    }
    this.hasWonBSubject.next( true );
  }

  public rotateNeighbours(box: Box) {
    for (let i = box.x - 1; i <= box.x + 1; i++) {
      for (let j = box.y - 1; j <= box.y + 1; j++) {

        if (i >= 0 && i < this.boxesX && j >= 0 && j < this.boxesY && !this.boxesBSubject.getValue()[i][j].isRotated) {
          this.boxesBSubject.getValue()[i][j].isRotated = true;
          
          if (this.boxesBSubject.getValue()[i][j].numberOfMinesAround === 0) {
            this.rotateNeighbours(this.boxesBSubject.getValue()[i][j]); 
          }
        }

      }
    }
  }
}
