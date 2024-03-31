import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css'
})
export class TimerComponent {

  private timerService = inject( TimerService );
  
  public elapsedDays = this.timerService.elapsedDays;
  public elapsedHours = this.timerService.elapsedHours;
  public elapsedMinutes = this.timerService.elapsedMinutes;
  public elapsedSeconds = this.timerService.elapsedSeconds;
}
