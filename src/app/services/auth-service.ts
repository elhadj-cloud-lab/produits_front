import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/user.model';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public loggedUser!:string;
  public isloggedIn: Boolean = false;
  public roles!:string[];
  private helper = new JwtHelperService();
  public regitredUser: User = new User();


  apiURL: string = 'http://localhost:8082/users';
  token!:string;

  constructor(private router: Router,
              private http : HttpClient) { }

  setRegistredUser(user: User) {
    this.regitredUser = user;
  }
  getRegistredUser() {
    return this.regitredUser;
  }

  login(user : User)
  {
    return this.http.post<User>(this.apiURL+'/login', user , {observe:'response'});
  }

  getToken():string {
    return this.token;
  }

  saveToken(jwt:string){
    localStorage.setItem('jwt',jwt);
    this.token = jwt;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  decodeJWT()  {
    if (this.token == undefined)
      return;
    const decodedToken = this.helper.decodeToken(this.token);
    this.roles = decodedToken.roles;
    this.loggedUser = decodedToken.sub;
  }

  loadToken() {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      this.token = storedToken;
      this.isloggedIn = true;
      this.decodeJWT();
    } else {
      this.isloggedIn = false;
    }
  }

  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token= undefined!;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  isAdmin():Boolean{
    if (!this.roles) //this.roles== undefiened
      return false;
    return  (this.roles.indexOf('ADMIN') >=0);
  }

  isTokenExpired(): Boolean {
    return  this.helper.isTokenExpired(this.token);
  }

  registerUser(user: User) {
    return this.http.post<User>(this.apiURL + '/register', user, {
      observe: 'response',
    });
  }

  validateEmail(code : string){
    return this.http.get<User>(this.apiURL+'/verifyEmail/'+code);
  }

}
