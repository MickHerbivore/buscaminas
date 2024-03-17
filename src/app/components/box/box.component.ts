import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  public gameService = inject( GameService );
  
  @Input()
  public box: Box = {} as Box;
  @Output()
  public boxChangedEvent: EventEmitter<null> = new EventEmitter();


  public onRightClick() {
    this.box.isFlagged = !this.box.isFlagged;
    this.box.isFlagged ? this.gameService.palceFlag() : this.gameService.removeFlag();
    this.boxChangedEvent.emit();
    return false;
  }

  public onClick() {
    if (this.box.isFlagged) return;

    this.box.isRotated = true;
    this.gameService.validateWin();

    if (this.box.hasMine)
      this.gameService.setGameOver();

    else if (this.box.numberOfMinesAround === 0)
      this.gameService.rotateNeighbours( this.box );

    this.boxChangedEvent.emit();
  }

}
