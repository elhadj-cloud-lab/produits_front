import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AppUser, User} from '../model/user.model';
import {DashboardStats} from '../model/stats.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {finalize, Observable, shareReplay, tap, throwError} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public loggedUser!:string;
  public isloggedIn = false;
  public roles!:string[];
  private helper = new JwtHelperService();
  public registeredUser: User = new User();

  apiURL: string = environment.apiURLAuth;
  token!:string;
  private refreshTokenValue!:string;
  private refreshInProgress: Observable<HttpResponse<void>> | null = null;

  constructor(private router: Router,
              private http : HttpClient) { }

  setRegisteredUser(user: User) {
    this.registeredUser = user;
  }
  getRegisteredUser() {
    return this.registeredUser;
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
    const refreshToken = this.getRefreshToken();
    const token = this.getToken();

    const clearLocal = () => {
      this.loggedUser = undefined!;
      this.roles = undefined!;
      this.token = undefined!;
      this.refreshTokenValue = undefined!;
      this.isloggedIn = false;
      localStorage.removeItem('jwt');
      localStorage.removeItem('refreshToken');
      this.router.navigate(['/login']);
    };

    if (token) {
      this.http.post<void>(
        this.apiURL + '/logout',
        { refreshToken },
        { headers: { Authorization: 'Bearer ' + token } }
      ).subscribe({ next: clearLocal, error: clearLocal });
    } else {
      clearLocal();
    }
  }

  revokeUserSessions(username: string) {
    return this.http.post<void>(this.apiURL + '/admin/revoke/' + username, {});
  }

  getAllUsers() {
    return this.http.get<AppUser[]>(this.apiURL + '/all');
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiURL + '/api/admin/stats/dashboard');
  }

  isAdmin(): boolean {
    if (!this.roles)
      return false;
    return  (this.roles.indexOf('ADMIN') >=0);
  }

  isTokenExpired(): boolean {
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
