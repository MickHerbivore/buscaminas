import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Box } from '../interfaces/box.interface';
import { CreateGameRequest, CreateGameResponse, Game, GameResponse } from '../interfaces/game.interface';
import { Level } from '../interfaces/level.interface';
import { ACTION_FLAG, ACTION_ROTATE, STORAGE_GAME_ID } from '../properties/properties';
import { BoxesService } from './boxes.service';
import { LevelService } from './level.service';
import { TimerService } from './timer.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private boxesService = inject(BoxesService);
  private levelService = inject(LevelService);
  private timerService = inject(TimerService);

  private _http = inject(HttpClient);

  private _gameId = linkedSignal<string | null>(() => localStorage.getItem(STORAGE_GAME_ID));
  public gameId = computed(() => this._gameId());

  public numberOfMines = computed(() => this.levelService.currentLevel()?.minesQuantity);
  public flagsPlaced = computed(() => {
    return this.boxesService.boxes().reduce((acc, row) => acc + row.filter(box => box.isFlagged).length, 0);
  });


  public clearGame() {
    this.boxesService.setBoxes(undefined)
    this.levelService.setLevel(undefined);
    this.timerService.resetTimer();
    this._gameId.set(null);
    localStorage.removeItem(STORAGE_GAME_ID);
  }

  public prepareGame(level: Level) {
    this.levelService.setLevel(level);
    this.resetGame();
  }

  public resetGame() {
    this.timerService.resetTimer();
    this.boxesService.initializeBoxes();
  }

  public makeMove(action: string, box: Box) {

    switch (action) {
      case ACTION_FLAG:
        box.isFlagged = !box.isFlagged;
        break;

      case ACTION_ROTATE:
        if (box.isFlagged) return;

        box.isRotated = true;
        break;
    }

    this.boxesService.updateBox(box);
  }

  public getGame(gameId: string): Observable<GameResponse> {
    return this._http.get<GameResponse>(`${environment.apiUrl}${environment.gameUri}${gameId}`)
      .pipe(
        // tap((game: GameResponse) => this.handleGame(game)),
        catchError((error) => {
          console.error('Error fetching game detail:', error);
          return throwError(() => error);
        })
      );
  }

  // private handleGame(game: GameResponse) {
  //   this.timerService.setStartTime(game.startDate);
  //   this.timerService.setCurrentTime(game.currentTime);
  //   const level = LEVELS.find(level => level.name === game.level);
  //   if (level) {
  //     this.levelService.setLevel(level);
  //   } else {
  //     console.error('Level not found for game', game);
  //   }
  // }

  public createGame(levelId: string) {
    const request: CreateGameRequest = { levelId };

    return this._http.post<CreateGameResponse>(`${environment.apiUrl}${environment.createGameUri}`, request)
      .pipe(
        catchError((error) => {
          console.error('Error creating game:', error);
          return throwError(() => error);
        }),
      );
  }

  public startGame() {
    return this._http.post<Game>(`${environment.apiUrl}${environment.startGameUri}`, { gameId: this.gameId() })
      .pipe(
        tap((response: Game) => {
          this.timerService.setStartTime(response.startDate);
          this.timerService.setCurrentTime(response.startDate);
        }),
      );
  }

  public deleteGame() {
    const gameId = localStorage.getItem(STORAGE_GAME_ID);
    return this._http.delete<boolean>(`${environment.apiUrl}${environment.gameUri}${gameId}`);
  }

  public resetTimer() {
    const gameId = localStorage.getItem(STORAGE_GAME_ID);
    return this._http.patch<boolean>(`${environment.apiUrl}${environment.resetTimerUri}${gameId}`, {});
  }

}
