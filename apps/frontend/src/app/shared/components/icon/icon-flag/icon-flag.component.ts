import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-icon-flag',
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
      <path d="M6 21V4" />
      <path d="M6 4.5h11l-2.5 4L17 12.5H6" />
    </svg>
  `,
  host: {
    style: 'display: inline-flex; align-items: center; justify-content: center; line-height: 0',
  },
})
export class IconFlagComponent {}
