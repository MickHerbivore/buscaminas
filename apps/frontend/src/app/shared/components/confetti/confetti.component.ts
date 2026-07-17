import { afterNextRender, Component, DestroyRef, inject } from '@angular/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-confetti',
  template: '',
})
export class ConfettiComponent {
  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const colors = ['#5fae7e', '#d9a45a', '#e8b974', '#6b92e0', '#eae6dd'];
      const defaults = {
        colors,
        disableForReducedMotion: true,
        shapes: ['square', 'star'] as ('square' | 'star')[],
      };

      confetti({ ...defaults, particleCount: 80, spread: 100, startVelocity: 45, origin: { y: 0.6 } });

      const end = Date.now() + 700;
      const cannons = () => {
        confetti({ ...defaults, particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ ...defaults, particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(cannons);
      };
      cannons();
    });

    destroyRef.onDestroy(() => {
      if (typeof document !== 'undefined') confetti.reset();
    });
  }
}
