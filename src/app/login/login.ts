import { Component } from '@angular/core';
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
  err=0;
  message : string = "login ou mot de passe erronés..";

  constructor(private authService : AuthService,
              private  router: Router) { }

  onLoggedin(){
    this.authService.login(this.user).subscribe({
      next: (data) => {
        let jwToken = data.headers.get('Authorization')!;
        console.log('Token reçu :', jwToken);
        this.authService.saveToken(jwToken);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.err = 1;
        if (err.error && err.error.errorCause=='disabled')
          this.message="Utilisateur désactivé, Veuillez contacter votre Administrateur";
      }
    });

  }

}
