import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProduitModel} from '../model/produit';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {

  produits : ProduitModel[];

  constructor() {
    this.produits = [
      {idProduit : 1, nomProduit : "PC Asus", prixProduit : 3000.600, dateCreation : new Date("01/14/2011")},
      {idProduit : 2, nomProduit : "Imprimante Epson", prixProduit : 450, dateCreation : new Date("12/17/2010")},
      {idProduit : 3, nomProduit :"Tablette Samsung", prixProduit : 900.123, dateCreation : new Date("02/20/2020")}
    ];
  }

  listeProduits(): ProduitModel[]{
    return this.produits;
  }

  addProduit(produit: ProduitModel){
    this.produits.push(produit);
  }

  supprimerProduit( prod: ProduitModel) {
  //supprimer le produit prod du tableau produits
      const index = this.produits.indexOf(prod, 0);
      if (index > -1) {
        this.produits.splice(index, 1);
      }
  //ou Bien
      /* this.produits.forEach((cur, index) => {
      if(prod.idProduit === cur.idProduit) {
      this.produits.splice(index, 1);
      }
      }); */
  }
}
