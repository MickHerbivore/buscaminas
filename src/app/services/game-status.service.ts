import { Injectable, computed, inject } from '@angular/core';
import { BoxesService } from './boxes.service';

@Injectable({
  providedIn: 'root'
})
export class GameStatusService {

  private boxesService = inject( BoxesService );

  
  public hasLost = computed( () => {
    return this.boxesService.boxes().some( row => row.some( box => box.isRotated && box.hasMine ) );
  });

  public hasWon = computed( () => {
    return !this.boxesService.boxes().some( row => row.some( box => !box.isRotated && !box.hasMine ) );
  });
  
  public playing = computed( () => {
    return this.boxesService.boxes().some( row => row.some( box => box.isRotated ) );
  });

}
