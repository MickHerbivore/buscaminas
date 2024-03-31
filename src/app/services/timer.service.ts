import { Injectable, effect, inject, signal } from '@angular/core';
import { STORAGE_START_TIME } from '../properties/properties';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private gameStateService = inject( GameStateService );

  private startTime = signal<Date>(new Date());
  public elapsedDays = signal<string>('');
  public elapsedHours = signal<string>('00');
  public elapsedMinutes = signal<string>('00');
  public elapsedSeconds = signal<string>('00');

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
      diffDate.setSeconds( now.getSeconds() - start.getSeconds());      
  
      const days = diffDate.getDay();
      const hours = diffDate.getHours();
      const minutes = diffDate.getMinutes();
      const seconds = diffDate.getSeconds();

      this.elapsedDays.set( days ? days.toString().padStart(2, '0') : '' );
      this.elapsedHours.set( hours.toString().padStart(2, '0') );
      this.elapsedMinutes.set( minutes.toString().padStart(2, '0') );
      this.elapsedSeconds.set( seconds.toString().padStart(2, '0') );
    }, 1000);
  }

  public stopTimer() {
    clearInterval(this.interval);
  }

  public resetTimer() {
    this.stopTimer();
    this.restartTimer();
    localStorage.removeItem(STORAGE_START_TIME);
  }

  private restartTimer() {
    this.elapsedDays.set( '' );
    this.elapsedHours.set( '00' );
    this.elapsedMinutes.set( '00' );
    this.elapsedSeconds.set( '00' );
  }

}
