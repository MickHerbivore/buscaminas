import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { GameService } from '../../services/game.service';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-game-frame',
  standalone: true,
  imports: [NgFor, BoxComponent, NgIf],
  templateUrl: './game-frame.component.html',
  styleUrl: './game-frame.component.css'
})
export class GameFrameComponent {

  private gameService = inject( GameService );
  
  public boxesX: number = 8;
  public boxesY: number = 8;
  public boxes: Box[][] = [];
  public isGameOver: boolean = false;
  public hasWon: boolean = false;


  constructor() {
    this.resetGame();
    this.gameService.boxesBSubject.subscribe( boxes => this.boxes = boxes );
    this.gameService.isGameOverBSubject.subscribe( isGameOver => this.isGameOver = isGameOver );
    this.gameService.hasWonBSubject.subscribe( hasWon => this.hasWon = hasWon );
  }
  
  public resetGame() {
    this.gameService.resetGame();
  }

}
