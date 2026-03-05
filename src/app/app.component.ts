
import { Component } from '@angular/core';
import { MainComponent } from './pages/main/main.component';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'buscaminas';
}
