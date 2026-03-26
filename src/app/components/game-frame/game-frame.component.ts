import { Component, input } from '@angular/core';
import { BoxesFrameComponent } from '../boxes-frame/boxes-frame.component';
import { ChangeLevelButtonComponent } from '../change-level-button/change-level-button.component';
import { ResetButtonComponent } from '../reset-button/reset-button.component';
import { TimerComponent } from '../timer/timer.component';

@Component({
    selector: 'app-game-frame',
    imports: [
        BoxesFrameComponent,
        ChangeLevelButtonComponent,
        ResetButtonComponent,
        TimerComponent
    ],
    templateUrl: './game-frame.component.html',
})
export class GameFrameComponent {
    public flagsPlaced = input<number>(0);
    public numberOfMines = input<number>(0);
}
