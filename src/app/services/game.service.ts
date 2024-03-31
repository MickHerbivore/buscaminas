import { Injectable, computed, inject } from '@angular/core';
import { Level } from '../interfaces/level.interface';
import { LEVELS } from '../properties/properties';
import { BoxesService } from './boxes.service';
import { LevelService } from './level.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  private boxesService = inject( BoxesService );
  private levelService = inject( LevelService );

  public numberOfMines = computed( () => this.levelService.currentLevel()?.mines );  
  public flagsPlaced = computed( () => {
    return this.boxesService.boxes().reduce( (acc, row) => acc + row.filter( box => box.isFlagged ).length, 0 );
  });


  public initGame() {
    if (localStorage.getItem('boxes') && localStorage.getItem('level')) {
      this.boxesService.setBoxes( JSON.parse(localStorage.getItem('boxes')!) );
      const lvl = LEVELS.find( level => level.name == localStorage.getItem('level') );
      this.levelService.setLevel( lvl! );
    }
  }

  public clearGame() {
    this.boxesService.setBoxes( undefined )
    this.levelService.setLevel( undefined );
  }
  
  public prepareGame( level: Level ) {
    this.levelService.setLevel( level );
    this.resetGame( );
  }
  
  public resetGame( ) {
    if ( !this.levelService.currentLevel() ) return;

    this.boxesService.initializeBoxes();
  }
}
