import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Box } from '../interfaces/box.interface';
import { Level } from '../interfaces/level.interface';
import { LEVELS } from '../properties/properties';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private levelBSubject: BehaviorSubject<Level> = new BehaviorSubject({} as Level);
  private boxesBSubject: BehaviorSubject<Box[][]> = new BehaviorSubject<Box[][]>([]);
  private isGameOverBSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private hasWonBSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private flagsPlacedBSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private numberOfMinesBSbuject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  private columns: number = 8;
  private rows: number = 8;
  
  public currentLevel$ = this.levelBSubject.asObservable();
  public boxes$ = this.boxesBSubject.asObservable();
  public isGameOver$ = this.isGameOverBSubject.asObservable();
  public hasWon$ = this.hasWonBSubject.asObservable();
  public flagsPlaced$ = this.flagsPlacedBSubject.asObservable();
  public numberOfMines$ = this.numberOfMinesBSbuject.asObservable();


  public getLevels(): Level[] {
    return LEVELS;
  }

  public setLevel( level: Level ) {    
    this.levelBSubject.next( level );
    this.columns = level.cols;
    this.rows = level.rows;
    this.numberOfMinesBSbuject.next( level.mines );
    this.resetGame();
  }

  public resetGame() {
    this.initializeBoxes();
    this.putMines();
    this.putNumbers();
    this.isGameOverBSubject.next( false );
    this.hasWonBSubject.next( false );
    this.flagsPlacedBSubject.next( 0 );
  }

  public setGameOver() {
    this.isGameOverBSubject.next( true );
  }

  public palceFlag() {
    const flagsLeft = this.flagsPlacedBSubject.getValue() + 1;
    this.flagsPlacedBSubject.next( flagsLeft );
  }

  public removeFlag() {
    const flagsLeft = this.flagsPlacedBSubject.getValue() - 1;
    this.flagsPlacedBSubject.next( flagsLeft );
  }

  private initializeBoxes(): void {
    let boxes: Box[][] = [];
    for (let row = 0; row < this.rows; row++) {
      boxes[row] = [];
      for (let col = 0; col < this.columns; col++) {
        boxes[row][col] = {
          row: row,
          col: col,
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
    for (let i = 0; i < this.numberOfMinesBSbuject.getValue(); i++) {
      let row = Math.floor(Math.random() * this.rows);
      let col = Math.floor(Math.random() * this.columns);
      this.boxesBSubject.getValue()[row][col].hasMine = true;
    }
  }

  private putNumbers() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (!this.boxesBSubject.getValue()[row][col].hasMine) {
          this.boxesBSubject.getValue()[row][col].numberOfMinesAround = this.getNumberOfMinesAround(row, col);
        }
      }
    }
  }

  private getNumberOfMinesAround(row: number, col: number): number {
    let numberOfMines = 0;

    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        
        if (i >= 0 && i < this.rows 
          && j >= 0 && j < this.columns
          && this.boxesBSubject.getValue()[i][j].hasMine) {
            numberOfMines++;
        }

      }
    }
    
    return numberOfMines;
  }

  public validateWin() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        if (!this.boxesBSubject.getValue()[row][col].hasMine && !this.boxesBSubject.getValue()[row][col].isRotated) {
          return;
        }
      }
    }
    this.hasWonBSubject.next( true );
  }

  public rotateNeighbours(box: Box) {
    for (let row = box.row - 1; row <= box.row + 1; row++) {
      for (let col = box.col - 1; col <= box.col + 1; col++) {

        if (row >= 0 && row < this.rows 
          && col >= 0 && col < this.columns 
          && !this.boxesBSubject.getValue()[row][col].isRotated) {

          this.boxesBSubject.getValue()[row][col].isRotated = true;
          
          if (this.boxesBSubject.getValue()[row][col].numberOfMinesAround === 0) {
            this.rotateNeighbours(this.boxesBSubject.getValue()[row][col]); 
          }
        }

      }
    }
  }
}
