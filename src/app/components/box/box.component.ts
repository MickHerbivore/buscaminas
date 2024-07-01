import { NgIf } from '@angular/common';
import { Component, OnDestroy, inject, input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Box } from '../../interfaces/box.interface';
import { ACTION_FLAG, ACTION_ROTATE } from '../../properties/properties';
import { BoxesService } from '../../services/boxes.service';
import { GameStateService } from '../../services/game-state.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent implements OnDestroy {

  private gameService = inject( GameService );
  private boxesService = inject( BoxesService );
  private gameStateService = inject( GameStateService );
  
  private subs: Subscription[] = [];
  public box = input.required<Box>();

  public onRightClick() {
    this.gameService.makeMove(ACTION_FLAG, this.box());
    this.patchBox();
    return false;
  }

  public onClick() {
    if (!this.gameStateService.playing())
      this.startGame();
    
    this.gameService.makeMove(ACTION_ROTATE, this.box());
    this.patchBox();
  }
  
  private startGame() {
    this.subs.push(
      this.gameService.startGame().subscribe()
    );
  }

  private patchBox() {
    this.subs.push(
      this.boxesService.patchBoxes( this.gameService.gameId()!, this.box() ).subscribe()
    );
  }

  ngOnDestroy() {
    this.subs.forEach( sub => sub.unsubscribe() );
  }
}
