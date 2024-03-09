import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Box } from '../../interfaces/box.interface';

@Component({
  selector: 'app-box',
  standalone: true,
  imports: [NgIf],
  templateUrl: './box.component.html',
  styleUrl: './box.component.css'
})
export class BoxComponent {

  @Input()
  public box: Box = {} as Box;
  

  public onRightClick() {
    this.box.isFlagged = !this.box.isFlagged;
    return false;
  }

  public onClick() {
    this.box.isRotated = true;
  }

}
