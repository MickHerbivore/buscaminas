import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LanguageSwitcherComponent } from './i18n/language-switcher/language-switcher.component';
import { TransPipe } from './i18n/trans.pipe';
import { IconCompassComponent } from './shared/components/icon/icon-compass/icon-compass.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    LanguageSwitcherComponent,
    IconCompassComponent,
    TransPipe,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
