import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-produits',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './produits.html',
})
export class Produits implements OnInit {

  produits: ProduitModel[] = [];

  constructor( private produitService: ProduitService,
               public authService: AuthService) {
  }

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits(){
    this.produitService.listerProduits().subscribe(prods => {
      this.produits = prods;
    });
  }

  supprimerProduit(produit: ProduitModel) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.produitService.supprimerProduit(produit.idProduit).subscribe(() => {
        this.chargerProduits();
      });
  }

}
