import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ProduitModel} from '../model/produit.model';
import {Observable} from 'rxjs';
import {Categorie} from '../model/categorie.model';
import {environment} from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};

@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  produits!: ProduitModel[];

  constructor(private http: HttpClient) { }

  listerProduits(): Observable<ProduitModel[]> {
    return this.http.get<ProduitModel[]>(environment.apiURL)
  }

  consulterProduit(id: number): Observable<ProduitModel> {
    const url = `${environment.apiURL}/${id}`;
    return this.http.get<ProduitModel>(url);
  }

  addProduit(produit: ProduitModel): Observable<ProduitModel> {
    return this.http.post<ProduitModel>(environment.apiURL, produit, httpOptions);
  }

  updateProduit(produit: ProduitModel): Observable<ProduitModel> {
    const url = `${environment.apiURL}/${produit.idProduit}`;
    return this.http.put<ProduitModel>(url, produit, httpOptions);
  }

  supprimerProduit(id: number) {
    const url = `${environment.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  listeCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(environment.apiURLCategorie);
  }

  rechercherParCategorie(idCategorie: number): Observable<ProduitModel[]> {
    const params = new HttpParams().set('idCategorie', idCategorie);

    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-categorie-id`, {params}
    );
  }

  rechercherParNom(nom: string): Observable<ProduitModel[]> {
    const params = new HttpParams().set('nom', nom);

    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-nom-contains`, {params}
    );
  }

  ajouterCategorie(cat: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(environment.apiURLCategorie, cat, httpOptions);
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    const url = `${environment.apiURLCategorie}/${categorie.idCategorie}`;
    return this.http.put<Categorie>(url, categorie, httpOptions);
  }

  supprimerCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURLCategorie}/${id}`, httpOptions);
  }
}
