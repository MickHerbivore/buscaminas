import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Level } from '../../interfaces/level.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-levels',
  standalone: true,
  imports: [NgFor],
  templateUrl: './levels.component.html',
  styleUrl: './levels.component.css'
})
export class LevelsComponent {

  private gameService = inject( GameService );
  public levels: Level[] = [];

  constructor() {
    this.levels = this.gameService.getLevels();
  }

  setLevel( level: Level ) {
    this.gameService.startGame( level );
  }

}
