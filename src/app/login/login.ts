import { Component } from '@angular/core';
import {User} from '../model/user.model';
import {AuthService} from '../services/auth-service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user = new User();
  erreur=0;

  constructor(private authService : AuthService,
              private  router: Router) { }

  // onLoggedin(){
  //   this.authService.login(this.user).subscribe({
  //     next: (data) => {
  //       //let jwToken = data.headers.get('Authorization')!;
  //       //this.authService.saveToken(jwToken);
  //       this.router.navigate(['/']);
  //     },
  //     error: (err: any) => {
  //       this.erreur = 1;
  //     }
  //   });
  //
  // }
  onLoggedin(){
    console.log(this.user);
    let isValidUser: Boolean = this.authService.SignIn(this.user);
    if (isValidUser)
      this.router.navigate(['/']);
    else
      alert('Login ou mot de passe incorrecte!');
  }
}
