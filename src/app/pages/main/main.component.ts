import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameService } from '../../services/game.service';
import { STORAGE_GAME_ID } from '../../properties/properties';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LevelsComponent, NgIf, GameFrameComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy{

  private gameService = inject( GameService );

  private subs: Subscription[] = [];

  public gameId = this.gameService.gameId;


  ngOnInit() {
    if (localStorage.getItem(STORAGE_GAME_ID)) {
      this.gameService.gameId.set( localStorage.getItem(STORAGE_GAME_ID)! );
      this.getGame();
    }
  }

  getGame() {
    this.subs.push(
      this.gameService.getGame()
      .subscribe()
    );
  }

  ngOnDestroy() {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

}
