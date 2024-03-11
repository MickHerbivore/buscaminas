import { Component, inject } from '@angular/core';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-change-level-button',
  standalone: true,
  imports: [],
  templateUrl: './change-level-button.component.html',
  styleUrl: './change-level-button.component.css'
})
export class ChangeLevelButtonComponent {

  private gameService = inject( GameService );

  public changeLevel() {
    this.gameService.setLevel( {} as Level );
  }

}
