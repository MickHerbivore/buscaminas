import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private startTime: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  private elapsedTimeBSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public elapsedTime$ = this.elapsedTimeBSubject.asObservable();

  private interval: any;

  public startTimer() {
    localStorage.setItem('startTime', new Date().toString());
    this.runTimer();
  }
  
  public runTimer() {
    if (!localStorage.getItem('startTime')) return;
    
    this.startTime.next( new Date( localStorage.getItem('startTime')! ) );

    this.interval = setInterval( () => {
  
      const now = new Date();
      const start = this.startTime.getValue();
  
      const diffDate = new Date();
      diffDate.setHours(now.getHours() - start.getHours());
      diffDate.setMinutes(now.getMinutes() - start.getMinutes());
      diffDate.setSeconds( now.getSeconds() - start.getSeconds() );      
  
      this.elapsedTimeBSubject.next( diffDate.toString() );
      
    }, 1000);
  }

  public stopTimer() {
    clearInterval(this.interval);
  }

  public resetTimer() {
    this.elapsedTimeBSubject.next( '' );
    localStorage.removeItem('startTime');
  }

}
