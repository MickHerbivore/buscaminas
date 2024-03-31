import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { BoxesService } from '../../services/boxes.service';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  public boxesService = inject( BoxesService );
  
  @Input()
  public box: Box = {} as Box;


  public onRightClick() {
    this.box.isFlagged = !this.box.isFlagged;
    this.boxesService.updateBox(this.box);
    return false;
  }

  public onClick() {
    if (this.box.isFlagged) return;

    this.box.isRotated = true;
    this.boxesService.updateBox(this.box);
  }

}
