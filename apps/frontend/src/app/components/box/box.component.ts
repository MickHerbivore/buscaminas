import {
  Component,
  input,
  output,
} from '@angular/core';
import { Box } from '../../interfaces/box.interface';

@Component({
  selector: 'app-box',
  imports: [],
  templateUrl: './box.component.html',
})
export class BoxComponent {
  public box = input.required<Box>();

  public clickEvent = output<string>();
  public rightClickEvent = output<string>();

  protected onClick() {
    this.clickEvent.emit(this.box().id);
  }

  protected onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.rightClickEvent.emit(this.box().id);
  }
}
