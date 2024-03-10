import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-reset-button',
  standalone: true,
  imports: [],
  templateUrl: './reset-button.component.html',
  styleUrl: './reset-button.component.css'
})
export class ResetButtonComponent {

  private gameService = inject( GameService );


  constructor() {
    this.resetGame();
  }
  
  
  public resetGame() {
    this.gameService.resetGame();
  }

}
