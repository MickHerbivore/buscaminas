import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameService } from '../../services/game.service';
import { LevelService } from '../../services/level.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LevelsComponent, NgIf, GameFrameComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  private levelService = inject( LevelService );
  private gameService = inject( GameService );


  public currentLevel = this.levelService.currentLevel;


  constructor() {
    this.gameService.initGame();
  }

}
