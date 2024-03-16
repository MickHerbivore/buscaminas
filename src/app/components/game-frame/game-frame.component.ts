import { Component, OnDestroy, inject, signal } from '@angular/core';
import { BoxesFrameComponent } from '../boxes-frame/boxes-frame.component';
import { ResetButtonComponent } from '../reset-button/reset-button.component';
import { ChangeLevelButtonComponent } from '../change-level-button/change-level-button.component';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-frame',
  standalone: true,
  imports: [BoxesFrameComponent, ResetButtonComponent, ChangeLevelButtonComponent],
  templateUrl: './game-frame.component.html',
  styleUrl: './game-frame.component.css'
})
export class GameFrameComponent implements OnDestroy {

  private gameService = inject( GameService );
  private subs: Subscription[] = [];
  public flagsPlaced: number = 0;
  public numberOfMines: number = 0;

  constructor() {
    this.subs.push(
      this.gameService.flagsPlaced$.subscribe( flagsPlaced => this.flagsPlaced = flagsPlaced ),
      this.gameService.numberOfMines$.subscribe( mines => this.numberOfMines = mines )
    );
  }

  ngOnDestroy() {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

}
