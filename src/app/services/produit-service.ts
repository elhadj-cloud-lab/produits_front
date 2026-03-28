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

  produits! : ProduitModel[];

  constructor(private http : HttpClient) {

  }

  listerProduits(): Observable<ProduitModel[]>{
    return this.http.get<ProduitModel[]>(environment.apiURL)
  }

  consulterProduit(id:number): Observable<ProduitModel>{
    const url = `${environment.apiURL}/${id}`;
    return this.http.get<ProduitModel>(url);
  }

  trierProduits(){
    this.produits = this.produits.sort((n1,n2) => {
      if (n1.idProduit! > n2.idProduit!) {
        return 1;
      }
      if (n1.idProduit! < n2.idProduit!) {
        return -1;
      }
      return 0;
    });
  }

  addProduit(produit: ProduitModel):Observable<ProduitModel>{
    return this.http.post<ProduitModel>(environment.apiURL, produit, httpOptions);
  }

  updateProduit(produit :ProduitModel) : Observable<ProduitModel>  {
    const url = `${environment.apiURL}/${produit.idProduit}`;
    return this.http.put<ProduitModel>(url, produit, httpOptions);
  }

  supprimerProduit(id : number) {
    const url = `${environment.apiURL}/${id}`;
    return this.http.delete(url, httpOptions);
  }

  listeCategories():Observable<Categorie[]>{
    return this.http.get<Categorie[]>(environment.apiURLCategorie);
  }

  //rechercherParCategorie(idCategorie: number):Observable< ProduitModel[]> {
    //const url = `${environment.apiURL}/search/by-categorie-id?${idCategorie}`;
    //return this.http.get<ProduitModel[]>(url);
  //}

  rechercherParCategorie(idCategorie: number): Observable<ProduitModel[]> {
    const params = new HttpParams().set('idCategorie', idCategorie);

    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-categorie-id`, { params }
    );
  }

  rechercherParNom(nom: string):Observable< ProduitModel[]> {
    const params = new HttpParams().set('nom', nom);

    return this.http.get<ProduitModel[]>(
      `${environment.apiURL}/search/by-nom-contains`, { params }
    );
  }
}
