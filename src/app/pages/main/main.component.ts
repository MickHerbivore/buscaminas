import { NgIf } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { GameFrameComponent } from '../../components/game-frame/game-frame.component';
import { LevelsComponent } from '../../components/levels/levels.component';
import { Level } from '../../interfaces/level.interface';
import { GameService } from '../../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [LevelsComponent, NgIf, GameFrameComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy {

  private gameService = inject( GameService );
  private currentLevelSubscription: Subscription;
  public level!: Level;


  constructor() {
    this.currentLevelSubscription = this.gameService.currentLevel$.subscribe( level => this.level = level );
  }

  ngOnDestroy(): void {
    this.currentLevelSubscription.unsubscribe();
  }

}
