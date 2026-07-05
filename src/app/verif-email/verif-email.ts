import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '../model/user.model';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth-service';
import {FormsModule} from '@angular/forms';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-verif-email',
  imports: [FormsModule],
  templateUrl: './verif-email.html',
  styleUrl: './verif-email.css',
})
export class VerifEmail implements OnInit {
  code = '';
  password = '';
  user: User = new User();
  err = '';

  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const pending = this.authService.getPendingRegistration();
    if (pending) {
      this.user.username = pending.username;
      this.user.email = pending.email;
    }
  }

  onValidateEmail() {
    this.err = '';
    if (!this.code.trim()) {
      this.err = 'Veuillez saisir le code de confirmation.';
      return;
    }
    if (!this.password) {
      this.err = 'Veuillez saisir votre mot de passe pour vous connecter.';
      return;
    }
    if (!this.user.username) {
      this.err = 'Session expirée. Veuillez vous réinscrire.';
      return;
    }

    this.user.password = this.password;
    this.authService.validateEmail(this.code).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => this.authService.login(this.user))
    ).subscribe({
      next: data => {
        const accessToken = data.headers.get('Authorization');
        const refreshToken = data.headers.get('Refresh-Token');
        if (accessToken && refreshToken) {
          this.authService.saveTokens(accessToken, refreshToken);
        }
        this.authService.clearPendingRegistration();
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error?.errorCode === 'INVALID_TOKEN') {
          this.err = 'Code invalide!';
        } else if (err.error?.errorCode === 'EXPIRED_TOKEN') {
          this.err = 'Code expiré!';
        } else if (err.status === 401) {
          this.err = 'Connexion impossible. Vérifiez votre mot de passe.';
        } else {
          this.err = 'Une erreur est survenue. Veuillez réessayer.';
        }
      },
    });
  }
}
