import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ProduitModel} from '../model/produit.model';
import {Observable} from 'rxjs';
import {Categorie} from '../model/categorie.model';
import {environment} from '../../environments/environment';
import {AuthService} from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  produits!: ProduitModel[];

  constructor(private http: HttpClient,
              private authService: AuthService,) { }

  listerProduits(): Observable<ProduitModel[]> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.get<ProduitModel[]>(environment.apiURL,{headers:httpHeaders});
  }

  consulterProduit(id: number): Observable<ProduitModel> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    const url = `${environment.apiURL}/${id}`;
    return this.http.get<ProduitModel>(url,{headers:httpHeaders});
  }

  addProduit(produit: ProduitModel): Observable<ProduitModel> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.post<ProduitModel>(environment.apiURL, produit ,{headers:httpHeaders});
  }

  updateProduit(produit: ProduitModel): Observable<ProduitModel> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    const url = `${environment.apiURL}/${produit.idProduit}`;
    return this.http.put<ProduitModel>(url, produit, {headers:httpHeaders});
  }

  supprimerProduit(id: number) {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    const url = `${environment.apiURL}/${id}`;
    return this.http.delete(url, {headers:httpHeaders});
  }

  listeCategories(): Observable<Categorie[]> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.get<Categorie[]>(environment.apiURLCategorie ,{headers:httpHeaders});
  }

  rechercherParCategorie(idCategorie: number): Observable<ProduitModel[]> {
    const params = new HttpParams().set('idCategorie', idCategorie);
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.get<ProduitModel[]>(`${environment.apiURL}/search/by-categorie-id`, {params, headers:httpHeaders}
    );
  }

  rechercherParNom(nom: string): Observable<ProduitModel[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-nom-contains`, {params}
    );
  }

  ajouterCategorie(cat: Categorie): Observable<Categorie> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.post<Categorie>(environment.apiURLCategorie, cat,{headers:httpHeaders});
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    const url = `${environment.apiURLCategorie}/${categorie.idCategorie}`;
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.put<Categorie>(url, categorie, {headers:httpHeaders});
  }

  supprimerCategorie(id: number): Observable<void> {
    let jwt = this.authService.getToken();
    jwt = "Bearer "+jwt;
    let httpHeaders = new HttpHeaders({"Authorization":jwt})
    return this.http.delete<void>(`${environment.apiURLCategorie}/${id}`, {headers:httpHeaders});
  }
}
