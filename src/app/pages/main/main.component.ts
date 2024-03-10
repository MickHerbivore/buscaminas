import { Component, inject } from '@angular/core';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { ResetButtonComponent } from '../../components/reset-button/reset-button.component';
import { LevelsComponent } from '../../components/levels/levels.component';
import { GameService } from '../../services/game.service';
import { NgIf } from '@angular/common';
import { Level } from '../../interfaces/level.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [GameFrameComponent, ResetButtonComponent, LevelsComponent, NgIf],
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
