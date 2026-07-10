import { Component, input, output } from '@angular/core';
import { Box } from '../../interfaces/box.interface';
import { Level } from '../../interfaces/level.interface';
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
    public level = input.required<Level | null>();
    public boxes = input.required<Box[]>();
    public hasWon = input.required<boolean>();
    public isGameOver = input.required<boolean>();
    public flagsPlaced = input<number>(0);
    public numberOfMines = input<number>(0);

    public boxClickedEvent = output<string>();
    public boxRightClickEvent = output<string>();

    protected boxClicked(boxId: string) {
        this.boxClickedEvent.emit(boxId);
    }

    protected boxRightClicked(boxId: string) {
        this.boxRightClickEvent.emit(boxId);
    }
}
