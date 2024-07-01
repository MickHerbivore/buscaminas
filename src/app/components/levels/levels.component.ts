import { NgFor } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NgFor],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent implements OnDestroy {

  private gameService = inject( GameService );
  private levelService = inject( LevelService );
  
  private initGameSubs: Subscription = new Subscription();
  
  public levels: Level[] = [];

  constructor() {
    this.levels = this.levelService.levels;
  }

  onLevel( level: Level ) {
    this.gameService.prepareGame( level );

    this.initGameSubs = this.gameService.initGame().subscribe();
  }

  ngOnDestroy(): void {
    this.initGameSubs.unsubscribe(); 
  }

}
