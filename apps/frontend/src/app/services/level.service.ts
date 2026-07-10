import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Level } from '../interfaces/level.interface';

@Injectable({ providedIn: 'root' })
export class LevelService {
  private readonly levelsRef = httpResource<Level[]>(
    () => `${environment.apiUrl}${environment.levelsUri}`,
    { defaultValue: [] },
  );

  readonly levels = this.levelsRef.value;
}
