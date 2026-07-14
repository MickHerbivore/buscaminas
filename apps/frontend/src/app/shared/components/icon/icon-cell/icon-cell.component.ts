import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-cell',
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
      <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
      <path d="M3.5 9h17M3.5 15h17M9 3.5v17M15 3.5v17" stroke-opacity="0.4" />
    </svg>
  `,
  host: {
    style: 'display: inline-flex; align-items: center; justify-content: center; line-height: 0',
  },
})
export class IconCellComponent {}
