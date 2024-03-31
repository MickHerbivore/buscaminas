import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BoxesService } from '../../services/boxes.service';
import { GameStateService } from '../../services/game-state.service';
import { LevelService } from '../../services/level.service';
import { BoxComponent } from '../box/box.component';

@Component({
  selector: 'app-boxes-frame',
  standalone: true,
  imports: [NgFor, BoxComponent, NgIf, AsyncPipe],
  templateUrl: './boxes-frame.component.html',
  styleUrl: './boxes-frame.component.css'
})
export class BoxesFrameComponent {

  private gameStateService = inject( GameStateService );
  private boxesService = inject( BoxesService );
  private levelService = inject( LevelService );
  
  public level = this.levelService.currentLevel;
  public boxes = this.boxesService.boxes;
  public hasWon = this.gameStateService.hasWon;
  public isGameOver = this.gameStateService.hasLost;

}
