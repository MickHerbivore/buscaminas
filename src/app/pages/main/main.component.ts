import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ChangeLevelButtonComponent } from '../../components/change-level-button/change-level-button.component';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { LevelsComponent } from '../../components/levels/levels.component';
import { ResetButtonComponent } from '../../components/reset-button/reset-button.component';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [GameFrameComponent, ResetButtonComponent, LevelsComponent, NgIf, ChangeLevelButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  private gameService = inject( GameService );
  public level!: Level;

  constructor() {
    this.gameService.levelBSubject.subscribe( level => this.level = level );
  }


}
