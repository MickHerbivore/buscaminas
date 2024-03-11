import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';
import { BoxComponent } from '../box/box.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-frame',
  standalone: true,
  imports: [NgFor, BoxComponent, NgIf],
  templateUrl: './game-frame.component.html',
  styleUrl: './game-frame.component.css'
})
export class GameFrameComponent implements OnDestroy {

  private gameService = inject( GameService );
  
  public boxes: Box[][] = [];
  public isGameOver: boolean = false;
  public hasWon: boolean = false;
  public level: Level = {} as Level;
  private subs: Subscription[] = [];


  constructor() {
    this.gameService.levelBSubject.subscribe( level => this.level = level );
    this.gameService.boxesBSubject.subscribe( boxes => this.boxes = boxes );
    this.gameService.isGameOverBSubject.subscribe( isGameOver => this.isGameOver = isGameOver );
    this.gameService.hasWonBSubject.subscribe( hasWon => this.hasWon = hasWon );
  }

  ngOnDestroy(): void {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

}
