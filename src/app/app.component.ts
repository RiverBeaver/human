import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HumanComponent } from './human/human.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HumanComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'humal';
}
