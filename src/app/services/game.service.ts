import { Injectable, computed, inject } from '@angular/core';
import { Box } from '../interfaces/box.interface';
import { Level } from '../interfaces/level.interface';
import { ACTION_FLAG, ACTION_ROTATE, LEVELS, STORAGE_BOXES, STORAGE_LEVEL } from '../properties/properties';
import { BoxesService } from './boxes.service';
import { GameStateService } from './game-state.service';
import { LevelService } from './level.service';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  private boxesService = inject( BoxesService );
  private levelService = inject( LevelService );
  private gameStateService = inject( GameStateService );
  private timerService = inject( TimerService );

  public numberOfMines = computed( () => this.levelService.currentLevel()?.mines );  
  public flagsPlaced = computed( () => {
    return this.boxesService.boxes().reduce( (acc, row) => acc + row.filter( box => box.isFlagged ).length, 0 );
  });


  public initGame() {
    if (localStorage.getItem(STORAGE_BOXES) && localStorage.getItem(STORAGE_LEVEL)) {
      this.boxesService.setBoxes( JSON.parse(localStorage.getItem(STORAGE_BOXES)!) );
      const lvl = LEVELS.find( level => level.name == localStorage.getItem(STORAGE_LEVEL) );
      this.levelService.setLevel( lvl! );
    }
  }

  public clearGame() {
    this.boxesService.setBoxes( undefined )
    this.levelService.setLevel( undefined );
    this.timerService.resetTimer();
  }
  
  public prepareGame( level: Level ) {
    this.levelService.setLevel( level );
    this.resetGame( );
  }
  
  public resetGame( ) {
    if ( !this.levelService.currentLevel() ) return;

    this.timerService.resetTimer();
    this.boxesService.initializeBoxes();
  }

  public makeMove( action: string, box: Box ) {

    switch (action) {
      case ACTION_FLAG:
        box.isFlagged = !box.isFlagged;
        break;

      case ACTION_ROTATE:
        if (box.isFlagged) return;
    
        if (!this.gameStateService.playing())
          this.timerService.startTimer();
    
        box.isRotated = true;
        break;
    }

    this.boxesService.updateBox( box );
  }
}
