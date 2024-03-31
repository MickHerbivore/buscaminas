import { Injectable, signal } from '@angular/core';
import { Level } from '../interfaces/level.interface';
import { LEVELS, STORAGE_LEVEL } from '../properties/properties';

@Injectable({
  providedIn: 'root'
})
export class LevelService {

  public currentLevel = signal<Level | undefined>( undefined );

  public levels: Level[] = LEVELS;

  public setLevel( level: Level | undefined ) {
    this.currentLevel.set( level );
    if (!level) localStorage.removeItem(STORAGE_LEVEL);
    else localStorage.setItem(STORAGE_LEVEL, this.currentLevel()!.name);
  }
}
