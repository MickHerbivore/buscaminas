import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Box, PatchBox } from '../interfaces/box.interface';
import { LevelService } from './level.service';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  private levelService = inject( LevelService );
  private http = inject( HttpClient );
  
  private currentLevel = this.levelService.currentLevel;
  public boxes = signal<Box[][]>([]);
  
  public boxesToPatch: PatchBox[] = [];
  
  
  public setBoxes( boxes: Box[][] | undefined ) {
    this.boxes.set( boxes ? [...boxes] : [] );
  }

  public updateBox( box: Box ) {
    if (!box.isFlagged && !box.hasMine && box.numberOfMinesAround === 0)
      this.rotateNeighbours( box );
    this.setBoxes( this.boxes() );
    
  }

  public initializeBoxes(): void {
    let boxes: Box[][] = [];
    for (let row = 0; row < this.currentLevel()!.rows; row++) {
      boxes[row] = [];
      for (let col = 0; col < this.currentLevel()!.cols; col++) {
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
    
    this.putMines( boxes );
    this.putNumbers( boxes );
    this.setBoxes( boxes );
  }

  private putMines( boxes: Box[][] ) {
    for (let i = 0; i < this.currentLevel()!.mines; i++) {
      let row = Math.floor(Math.random() * this.currentLevel()!.rows);
      let col = Math.floor(Math.random() * this.currentLevel()!.cols);
      
      if (boxes[row][col].hasMine) i--;
      
      boxes[row][col].hasMine = true;
    }
  }

  private putNumbers( boxes: Box[][] ) {
    for (let row = 0; row < this.currentLevel()!.rows; row++) {
      for (let col = 0; col < this.currentLevel()!.cols; col++) {
        if (!boxes[row][col].hasMine) {
          boxes[row][col].numberOfMinesAround = this.getNumberOfMinesAround(boxes, boxes[row][col]);
        }
      }
    }
  }

  private getNumberOfMinesAround( boxes: Box[][], box: Box ): number {
    let numberOfMines = 0;

    for (let i = box.row - 1; i <= box.row + 1; i++) {
      for (let j = box.col - 1; j <= box.col + 1; j++) {
        
        if (i >= 0 && i < this.currentLevel()!.rows 
          && j >= 0 && j < this.currentLevel()!.cols
          && boxes[i][j].hasMine) {
            numberOfMines++;
        }

      }
    }
    
    return numberOfMines;
  }

  private rotateNeighbours(box: Box) {
    if ( !this.levelService.currentLevel() ) return;

    for (let row = box.row - 1; row <= box.row + 1; row++) {
      for (let col = box.col - 1; col <= box.col + 1; col++) {

        if (row >= 0 && row < this.levelService.currentLevel()!.rows 
          && col >= 0 && col < this.levelService.currentLevel()!.cols 
          && !this.boxes()[row][col].isRotated) {

          this.boxes.update( box => {
            this.boxesToPatch.push(this.boxes()[row][col]);
            box[row][col].isRotated = true;
            return box;
          });
          
          if (this.boxes()[row][col].numberOfMinesAround === 0) {
            this.rotateNeighbours(this.boxes()[row][col]); 
          }
        }
      }
    }
  }

  public getBoxes( gameId: string ): Observable<Box[][]> {
    return this.http.get<Box[][]>(`${environment.apiUrl}${environment.boxesUri}${gameId}`)
    .pipe(
      tap({
        next: (boxes: Box[][]) => {
          this.setBoxes( boxes );
        }
      })
    );
  }

  public patchBoxes( gameId: string, box: PatchBox ) {
    return this.http.patch<boolean>(`${environment.apiUrl}${environment.boxesUri}${gameId}`, { boxes: [ box, ...this.boxesToPatch ] })
      .pipe(
        tap( () => {
          this.boxesToPatch = [];
        })
      );
  }

  public putBoxes( gameId: string, boxes: Box[][] ) {
    return this.http.put<boolean>(`${environment.apiUrl}${environment.boxesUri}${gameId}`, { boxes });
  }
}
