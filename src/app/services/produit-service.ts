import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProduitModel, ProduitStats} from '../model/produit.model';
import {Observable} from 'rxjs';
import {Categorie} from '../model/categorie.model';
import {Image} from '../model/image.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  constructor(private http: HttpClient) {}

  extractCategories(prods: ProduitModel[]): Categorie[] {
    const catMap = new Map<number, Categorie>();
    prods.forEach(p => {
      if (p.categorie?.idCategorie) catMap.set(p.categorie.idCategorie, p.categorie);
    });
    return Array.from(catMap.values());
  }

  computeStats(prods: ProduitModel[]): ProduitStats {
    const catMap = new Map<string, number>();
    prods.forEach(p => {
      const cat = p.categorie?.nomCategorie ?? 'Sans catégorie';
      catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
    });
    return {
      totalProduits: prods.length,
      avgPrice: prods.length > 0
        ? prods.reduce((sum, p) => sum + (p.prixProduit ?? 0), 0) / prods.length
        : 0,
      nbCategories: catMap.size,
      topProduits: [...prods]
        .sort((a, b) => (b.prixProduit ?? 0) - (a.prixProduit ?? 0))
        .slice(0, 5),
      prodCategStats: Array.from(catMap.entries())
        .map(([label, count]) => ({label, count}))
        .sort((a, b) => b.count - a.count),
    };
  }

  listerProduits(): Observable<ProduitModel[]> {
    return this.http.get<ProduitModel[]>(environment.apiURL);
  }

  consulterProduit(id: number): Observable<ProduitModel> {
    const url = `${environment.apiURL}/${id}`;
    return this.http.get<ProduitModel>(url);
  }

  addProduit(produit: ProduitModel): Observable<ProduitModel> {
    return this.http.post<ProduitModel>(environment.apiURL, produit);
  }

  updateProduit(produit: ProduitModel): Observable<ProduitModel> {
    const url = `${environment.apiURL}/${produit.idProduit}`;
    return this.http.put<ProduitModel>(url, produit);
  }

  supprimerProduit(id: number) {
    const url = `${environment.apiURL}/${id}`;
    return this.http.delete(url);
  }

  listeCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(environment.apiURLCategorie);
  }

  rechercherParCategorie(idCategorie: number): Observable<ProduitModel[]> {
    const params = new HttpParams().set('idCategorie', idCategorie);
    return this.http.get<ProduitModel[]>(`${environment.apiURL}/search/by-categorie-id`, {params}
    );
  }

  rechercherParNom(nom: string): Observable<ProduitModel[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-nom-contains`, {params}
    );
  }

  ajouterCategorie(cat: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(environment.apiURLCategorie, cat);
  }

  updateCategorie(categorie: Categorie): Observable<Categorie> {
    const url = `${environment.apiURLCategorie}/${categorie.idCategorie}`;
    return this.http.put<Categorie>(url, categorie);
  }

  supprimerCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiURLCategorie}/${id}`);
  }

  uploadImageProd(file: File, filename: string, idProd: number): Observable<Image> {
    const imageFormData = new FormData();
    imageFormData.append('image', file, filename);
    const url = `${environment.apiURLImage + '/uploadImageProd'}/${idProd}`;
    return this.http.post<Image>(url, imageFormData);
  }

  getImagesByProduct(idProd: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${environment.apiURLImage}/getImagesProd/${idProd}`);
  }

  supprimerImage(id: number) {
    return this.http.delete<void>(`${environment.apiURLImage}/delete/${id}`);
  }

}
