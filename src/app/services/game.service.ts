import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Box } from '../interfaces/box.interface';
import { Game, GameResponse, InitGame } from '../interfaces/game.interface';
import { Level } from '../interfaces/level.interface';
import { ACTION_FLAG, ACTION_ROTATE, LEVELS, STORAGE_GAME_ID } from '../properties/properties';
import { BoxesService } from './boxes.service';
import { LevelService } from './level.service';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  
  private boxesService = inject( BoxesService );
  private levelService = inject( LevelService );
  private timerService = inject( TimerService );

  private http = inject( HttpClient );

  public gameId = signal<string | null>( null );
  public numberOfMines = computed( () => this.levelService.currentLevel()?.mines );  
  public flagsPlaced = computed( () => {
    return this.boxesService.boxes().reduce( (acc, row) => acc + row.filter( box => box.isFlagged ).length, 0 );
  });

  private e = effect(() => {
    if (this.gameId())
      localStorage.setItem(STORAGE_GAME_ID, this.gameId()!);
  });

  
  public clearGame() {
    this.boxesService.setBoxes( undefined )
    this.levelService.setLevel( undefined );
    this.timerService.resetTimer();
    this.gameId.set( null );
    localStorage.removeItem(STORAGE_GAME_ID);
  }
  
  public prepareGame( level: Level ) {
    this.levelService.setLevel( level );
    this.resetGame( );
  }
  
  public resetGame( ) {
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
        
        box.isRotated = true;
        break;
    }
    
    this.boxesService.updateBox( box );
  }

  public getGame( ) {
    return this.http.get<GameResponse>(`${environment.apiUrl}${environment.gameUri}${this.gameId()}`)
    .pipe(
      tap((game: GameResponse) => this.handleGame(game)),
      switchMap( () => this.boxesService.getBoxes( this.gameId()! )),
    );
  }

  private handleGame(game: GameResponse) {
    console.log('Game', game);
    
    this.timerService.setStartTime(game.startDate);
    this.timerService.setCurrentTime(game.currentTime);
    const level = LEVELS.find(level => level.name === game.level);
    if (level) {
      this.levelService.setLevel(level);
    } else {
      console.error('Level not found for game', game);
    }
  }

  public initGame() {
    const initGame: InitGame = {
      level: this.levelService.currentLevel()!.name,
      rows: this.levelService.currentLevel()!.rows,
      cols: this.levelService.currentLevel()!.cols,
      boxes: this.boxesService.boxes()
    };

    return this.http.post<string>(`${environment.apiUrl}${environment.initGameUri}`, initGame)
      .pipe(
        tap(( gameId ) => this.gameId.set( gameId )),
      )
  }

  public startGame() {
    return this.http.post<Game>(`${environment.apiUrl}${environment.startGameUri}`, { gameId: this.gameId() })
      .pipe(
        tap((response: Game) => {
          this.timerService.setStartTime( response.startDate );
          this.timerService.setCurrentTime( response.startDate );
        }),
      );
  }

  public deleteGame() {
    const gameId = localStorage.getItem( STORAGE_GAME_ID );
    return this.http.delete<boolean>(`${environment.apiUrl}${environment.gameUri}${gameId}`);
  }

}
