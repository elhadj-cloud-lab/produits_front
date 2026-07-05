import {Component, OnInit, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadToken();
  }

  onLogout() {
    this.authService.logout();
  }

  protected readonly title = signal('Produits_front');
}
