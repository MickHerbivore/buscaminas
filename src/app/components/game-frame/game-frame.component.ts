import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { BoxesFrameComponent } from '../boxes-frame/boxes-frame.component';
import { ChangeLevelButtonComponent } from '../change-level-button/change-level-button.component';
import { ResetButtonComponent } from '../reset-button/reset-button.component';

@Component({
  selector: 'app-game-frame',
  standalone: true,
  imports: [
    AsyncPipe,
    BoxesFrameComponent,
    ChangeLevelButtonComponent,
    ResetButtonComponent,
  ],
  templateUrl: './game-frame.component.html',
  styleUrl: './game-frame.component.css'
})
export class GameFrameComponent {

  private gameService = inject( GameService );

  
  public flagsPlaced = this.gameService.flagsPlaced;
  public numberOfMines = this.gameService.numberOfMines;

}
