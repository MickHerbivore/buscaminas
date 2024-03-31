import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Level } from '../../interfaces/level.interface';
import { NgFor } from '@angular/common';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NgFor],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {

  private gameService = inject( GameService );
  private levelService = inject( LevelService );
  
  public levels: Level[] = [];

  constructor() {
    this.levels = this.levelService.levels;
  }

  setLevel( level: Level ) {
    this.gameService.prepareGame( level );
  }

}
