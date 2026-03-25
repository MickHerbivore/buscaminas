import { httpResource } from '@angular/common/http';
import { effect, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Level } from '../interfaces/level.interface';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  public currentLevel = signal<Level | undefined>(undefined);

  private _levelsRef = httpResource<Level[]>(() =>
    `${environment.apiUrl}${environment.levelsUri}`,
    { defaultValue: [] }
  );
  public levels = this._levelsRef.value;


  public setLevel(level: Level | undefined) {
    this.currentLevel.set(level);
  }
}
