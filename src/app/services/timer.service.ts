import { Injectable, effect, inject, signal } from '@angular/core';
import { GameStateService } from './game-state.service';
import { STORAGE_START_TIME } from '../properties/properties';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private gameStateService = inject( GameStateService );

  private startTime = signal<Date>(new Date());
  public elapsedTime = signal<string>('01/01/01 00:00:00');

  private interval: any;
  
  private e = effect( () => {
    if (this.gameStateService.playing())
      this.runTimer();

    if (this.gameStateService.hasLost())
      this.resetTimer();

    if (this.gameStateService.hasWon() || !this.gameStateService.playing())
      this.stopTimer();    
  }, { allowSignalWrites: true });

  public startTimer() {
    localStorage.setItem(STORAGE_START_TIME, new Date().toString());
  }
  
  public runTimer() {
    if (!localStorage.getItem(STORAGE_START_TIME)) return;
    
    this.startTime.set( new Date( localStorage.getItem(STORAGE_START_TIME)! ) );

    this.interval = setInterval( () => {
  
      const now = new Date();
      const start = this.startTime();
  
      const diffDate = new Date();
      diffDate.setHours(now.getHours() - start.getHours());
      diffDate.setMinutes(now.getMinutes() - start.getMinutes());
      diffDate.setSeconds( now.getSeconds() - start.getSeconds() );      
  
      this.elapsedTime.set( diffDate.toString() );
      console.log( diffDate.toString() );
      
      
    }, 1000);
  }

  public stopTimer() {
    console.log('stop timer');
    
    clearInterval(this.interval);
  }

  public resetTimer() {
    this.stopTimer();
    this.elapsedTime.set( '01/01/01 00:00:00' );
    localStorage.removeItem(STORAGE_START_TIME);
  }

}
