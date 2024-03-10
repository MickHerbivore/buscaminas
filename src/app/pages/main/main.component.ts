import { Component } from '@angular/core';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { ResetButtonComponent } from '../../components/reset-button/reset-button.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [GameFrameComponent, ResetButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
