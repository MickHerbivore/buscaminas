import { Injectable, signal } from '@angular/core';
import { Level } from '../interfaces/level.interface';
import { LEVELS } from '../properties/properties';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  public currentLevel = signal<Level | undefined>( undefined );

  public levels: Level[] = LEVELS;

  public setLevel( level: Level | undefined ) {
    this.currentLevel.set( level );
    if (!level) localStorage.removeItem('level');
    else localStorage.setItem('level', this.currentLevel()!.name);
  }
}
