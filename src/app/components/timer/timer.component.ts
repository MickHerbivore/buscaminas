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
  
  public elapsedTime = this.timerService.elapsedTime;
}
