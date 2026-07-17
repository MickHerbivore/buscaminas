import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-mine',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      class="w-full h-full"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false">
      <circle cx="12" cy="14" r="6" />
      <path d="M12 4v3" />
      <path d="M9 7l3-3 3 3" />
      <path d="M18 11l2.5-1.5" />
      <path d="M6 11l-2.5-1.5" />
      <path d="M18 17l2.5 1.5" />
      <path d="M6 17l-2.5 1.5" />
    </svg>
  `,
  host: {
    style: 'display: inline-flex; align-items: center; justify-content: center; line-height: 0',
  },
})
export class IconMineComponent {}
