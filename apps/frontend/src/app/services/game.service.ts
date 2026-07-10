import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Box } from '../interfaces/box.interface';
import {
  ActionResult,
  BoxActionRequest,
  CreateGameRequest,
  GameResponse,
} from '../interfaces/game.interface';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly http = inject(HttpClient);

  private gamesUrl(): string {
    return `${environment.apiUrl}${environment.gamesUri}`;
  }

  createGame(request: CreateGameRequest): Observable<GameResponse> {
    return this.http.post<GameResponse>(this.gamesUrl(), request);
  }

  getGame(gameId: string): Observable<GameResponse> {
    return this.http.get<GameResponse>(`${this.gamesUrl()}${gameId}`);
  }

  deleteGame(gameId: string): Observable<void> {
    return this.http.delete<void>(`${this.gamesUrl()}${gameId}`);
  }

  getBoxes(gameId: string): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.gamesUrl()}${gameId}/boxes`);
  }

  reveal(gameId: string, request: BoxActionRequest): Observable<ActionResult> {
    return this.http.patch<ActionResult>(
      `${this.gamesUrl()}${gameId}/reveal`,
      request,
    );
  }

  flag(gameId: string, request: BoxActionRequest): Observable<ActionResult> {
    return this.http.patch<ActionResult>(
      `${this.gamesUrl()}${gameId}/flag`,
      request,
    );
  }

  chord(gameId: string, request: BoxActionRequest): Observable<ActionResult> {
    return this.http.patch<ActionResult>(
      `${this.gamesUrl()}${gameId}/chord`,
      request,
    );
  }
}
