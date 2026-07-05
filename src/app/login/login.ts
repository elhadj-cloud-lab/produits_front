import {Component} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../model/user.model';
import {AuthService} from '../services/auth-service';
import {Router, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user = new User();
  hasError = false;
  message : string = "login ou mot de passe erronés..";

  constructor(private authService : AuthService,
              private  router: Router) { }

  onLoggedin() {
    this.authService.login(this.user).subscribe({
      next: data => {
        const accessToken = data.headers.get('Authorization');
        const refreshToken = data.headers.get('Refresh-Token');
        if (accessToken && refreshToken) {
          this.authService.saveTokens(accessToken, refreshToken);
          this.router.navigate(['/']);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.hasError = true;
        if (err.error?.errorCause === 'disabled')
          this.message = 'Utilisateur désactivé, Veuillez contacter votre Administrateur';
      },
    });
  }

}
