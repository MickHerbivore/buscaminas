import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { GameStateService } from './game-state.service';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  private gameStateService = inject( GameStateService );

  private startTime = signal<Date>(new Date());
  private currentTime = signal<Date>(new Date());
  private diffTime = computed<Date>( () => {
    const diffDate = new Date();
    diffDate.setHours(this.currentTime().getHours() - this.startTime().getHours() );
    diffDate.setMinutes(this.currentTime().getMinutes() - this.startTime().getMinutes() );
    diffDate.setSeconds( this.currentTime().getSeconds() - this.startTime().getSeconds() );
    return diffDate;
  });

  public elapsedDays = computed<number>(() => {
    const diffTimeInMs = this.currentTime().getTime() - this.startTime().getTime();
    return Math.floor(diffTimeInMs / (1000 * 60 * 60 * 24));
  });

  public elapsedHours = computed<string>(() => this.diffTime().getHours().toString().padStart(2, '0'));
  public elapsedMinutes = computed<string>(() => this.diffTime().getMinutes().toString().padStart(2, '0'));
  public elapsedSeconds = computed<string>(() => this.diffTime().getSeconds().toString().padStart(2, '0'));

  private interval: any;
  
  private e = effect( () => {
    if (this.gameStateService.playing())
      this.runTimer();

    if (this.gameStateService.hasLost())
      this.resetTimer();

    if (this.gameStateService.hasWon() || !this.gameStateService.playing())
      this.stopTimer();    
  }, { allowSignalWrites: true });

  public setStartTime( startDate: Date ) {
    this.startTime.set( new Date( startDate ) );
  }

  public setCurrentTime( currentTime: Date ) {
    this.currentTime.set( new Date( currentTime ) );
  }
  
  public runTimer() {
    this.interval = setInterval( () => {
      this.currentTime.set( new Date( this.currentTime().getTime() + 1000 ) );
    }, 1000);
  }

  public stopTimer() {
    clearInterval(this.interval);
  }

  public resetTimer() {
    this.stopTimer();
    this.restartTimer();
  }

  private restartTimer() {
    this.startTime.set( new Date() );
    this.currentTime.set( new Date() );
  }

}
