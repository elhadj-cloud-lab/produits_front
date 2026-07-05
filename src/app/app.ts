import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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

  private readonly destroyRef = inject(DestroyRef);

  constructor (public authService: AuthService,
               private router: Router,) {}

  ngOnInit(): void {
    this.authService.loadToken();
    const publicRoutes = ['/login', '/register', '/verifEmail'];

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      if (publicRoutes.includes(currentUrl)) {
        return;
      }

      if (this.authService.getToken() == null) {
        this.router.navigate(['/login']);
        return;
      }

      if (this.authService.isTokenExpired()) {
        if (this.authService.getRefreshToken()) {
          this.authService.refreshAccessToken().subscribe({
            error: () => this.router.navigate(['/login'])
          });
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onLogout(){
    this.authService.logout();
  }

  protected readonly title = signal('Produits_front');
}
