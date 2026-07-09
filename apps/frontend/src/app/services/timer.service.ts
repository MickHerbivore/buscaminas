import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { GameStore } from '../store/game.store';

@Injectable({ providedIn: 'root' })
export class TimerService {
  private readonly store = inject(GameStore);

  private readonly startedAt = signal<number | null>(null);
  private readonly now = signal(Date.now());
  private intervalId: ReturnType<typeof setInterval> | null = null;

  private readonly elapsedMs = computed(() => {
    const start = this.startedAt();
    if (start === null) return 0;
    const status = this.store.status();
    const game = this.store.currentGame();
    const ended =
      (status === 'WON' || status === 'LOST') && game?.endedAt
        ? new Date(game.endedAt).getTime()
        : this.now();
    return Math.max(0, ended - start);
  });

  private readonly totalSeconds = computed(() =>
    Math.floor(this.elapsedMs() / 1000),
  );

  readonly elapsedDays = computed(() =>
    Math.floor(this.totalSeconds() / 86400),
  );
  readonly elapsedHours = computed(() =>
    Math.floor(this.totalSeconds() / 3600)
      .toString()
      .padStart(2, '0'),
  );
  readonly elapsedMinutes = computed(() =>
    (Math.floor(this.totalSeconds() / 60) % 60).toString().padStart(2, '0'),
  );
  readonly elapsedSeconds = computed(() =>
    (this.totalSeconds() % 60).toString().padStart(2, '0'),
  );

  constructor() {
    effect(() => {
      const game = this.store.currentGame();
      this.startedAt.set(
        game?.startedAt ? new Date(game.startedAt).getTime() : null,
      );
    });
    effect(() => {
      if (this.store.status() === 'PLAYING') this.start();
      else this.stop();
    });
  }

  private start(): void {
    if (this.intervalId !== null) return;
    this.intervalId = setInterval(() => this.now.set(Date.now()), 1000);
  }

  private stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
