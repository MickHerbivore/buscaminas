import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-boxes-frame',
  standalone: true,
  imports: [NgFor, BoxComponent, NgIf],
  templateUrl: './boxes-frame.component.html',
  styleUrl: './boxes-frame.component.css'
})
export class BoxesFrameComponent implements OnDestroy {

  private gameService = inject( GameService );
  
  public boxes: Box[][] = [];
  public isGameOver: boolean = false;
  public hasWon: boolean = false;
  public level: Level = {} as Level;
  private subs: Subscription[] = [];


  constructor() {
    this.subs.push(
      this.gameService.currentLevel$.subscribe( level => this.level = level ),
      this.gameService.boxes$.subscribe( boxes => this.boxes = boxes ),
      this.gameService.isGameOver$.subscribe( isGameOver => this.isGameOver = isGameOver ),
      this.gameService.hasWon$.subscribe( hasWon => this.hasWon = hasWon ),
    );
  }

  setGameOver() {
    this.gameService.setGameOver();
  }

  ngOnDestroy(): void {
    this.subs.forEach( sub => sub.unsubscribe() );
  }

}
