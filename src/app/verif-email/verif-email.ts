import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '../model/user.model';
import {ActivatedRoute, Router} from '@angular/router';
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
  user: User = new User();
  err = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.registeredUser;
  }

  onValidateEmail() {
    this.err = '';
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
        this.router.navigate(['/']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error?.errorCode === 'INVALID_TOKEN') this.err = 'Code invalide!';
        else if (err.error?.errorCode === 'EXPIRED_TOKEN') this.err = 'Code expiré!';
      },
    });
  }
}
