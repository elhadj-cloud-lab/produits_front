import {Component, OnInit, signal} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './services/auth-service';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  constructor (public authService: AuthService,
               private router: Router,) {}

  ngOnInit(): void {
    this.authService.loadToken();
    const publicRoutes = ['/login', '/register', '/verifEmail'];

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      console.log('NavigationEnd URL:', currentUrl); // ✅ ajouter
      console.log('Token:', this.authService.getToken()); // ✅ ajouter
      console.log('isExpired:', this.authService.isTokenExpired()); // ✅ ajouter


      if (!publicRoutes.includes(currentUrl) &&
        (this.authService.getToken() == null || this.authService.isTokenExpired())) {
        this.router.navigate(['/login']);
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }

  protected readonly title = signal('Produits_front');
}
