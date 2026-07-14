import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-compass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke-opacity="0.5" />
      <path d="M12 8l2.5 4.5L12 16l-2.5-3.5z" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  `,
  host: {
    style: 'display: inline-flex; align-items: center; justify-content: center; line-height: 0',
  },
})
export class IconCompassComponent {}
