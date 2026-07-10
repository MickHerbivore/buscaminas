import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timer',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  private timerService = inject(TimerService);

  public elapsedDays = this.timerService.elapsedDays;
  public elapsedHours = this.timerService.elapsedHours;
  public elapsedMinutes = this.timerService.elapsedMinutes;
  public elapsedSeconds = this.timerService.elapsedSeconds;
}
