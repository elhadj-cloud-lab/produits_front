import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {User} from '../model/user.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, finalize, Observable, shareReplay, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public loggedUser!:string;
  public isloggedIn: Boolean = false;
  public roles!:string[];
  private helper = new JwtHelperService();
  public regitredUser: User = new User();

  apiURL: string = 'http://localhost:8080/users';
  token!:string;
  private refreshTokenValue!:string;
  private refreshInProgress: Observable<HttpResponse<void>> | null = null;

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

  getRefreshToken(): string | null {
    return this.refreshTokenValue ?? localStorage.getItem('refreshToken');
  }

  saveTokens(accessToken: string, refreshToken: string){
    localStorage.setItem('jwt', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.token = accessToken;
    this.refreshTokenValue = refreshToken;
    this.isloggedIn = true;
    this.decodeJWT();
  }

  saveToken(jwt:string){
    localStorage.setItem('jwt', jwt);
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
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedToken) {
      this.token = storedToken;
      this.refreshTokenValue = storedRefreshToken ?? undefined!;
      if (!this.isTokenExpired()) {
        this.isloggedIn = true;
        this.decodeJWT();
      }
    } else {
      this.isloggedIn = false;
    }
  }

  refreshAccessToken(): Observable<HttpResponse<void>> {
    if (this.refreshInProgress) {
      return this.refreshInProgress;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    this.refreshInProgress = this.http.post<void>(
      this.apiURL + '/refresh',
      { refreshToken },
      { observe: 'response' }
    ).pipe(
      tap(response => {
        const accessToken = response.headers.get('Authorization');
        const newRefreshToken = response.headers.get('Refresh-Token');
        if (accessToken && newRefreshToken) {
          this.saveTokens(accessToken, newRefreshToken);
        }
      }),
      finalize(() => {
        this.refreshInProgress = null;
      }),
      shareReplay(1)
    );

    return this.refreshInProgress;
  }

  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token = undefined!;
    this.refreshTokenValue = undefined!;
    this.isloggedIn = false;
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  isAdmin():Boolean{
    if (!this.roles)
      return false;
    return  (this.roles.indexOf('ADMIN') >=0);
  }

  isTokenExpired(): Boolean {
    if (!this.token) {
      return true;
    }
    return this.helper.isTokenExpired(this.token);
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
