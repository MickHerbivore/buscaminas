import { NgIf } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { GameService } from '../../services/game.service';
import { ACTION_FLAG, ACTION_ROTATE } from '../../properties/properties';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  public gameService = inject( GameService );
  
  public box = input.required<Box>();

  public onRightClick() {
    this.gameService.makeMove(ACTION_FLAG, this.box());
    return false;
  }

  public onClick() {
    this.gameService.makeMove(ACTION_ROTATE, this.box());
  }

}
