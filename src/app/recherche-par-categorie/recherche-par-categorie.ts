import {Component, OnInit} from '@angular/core';
import {Categorie} from '../model/categorie.model';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-recherche-par-categorie',
  imports: [FormsModule, CommonModule],
  templateUrl: './recherche-par-categorie.html',
  styles: ``,
})
export class RechercheParCategorie implements OnInit {
  produits! : ProduitModel[];
  idCategorie! : number;
  categories! : Categorie[];

  constructor(private produitService: ProduitService,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.produitService.listeCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  onChange() {
    this.produitService.rechercherParCategorie(this.idCategorie).
    subscribe(prods =>{this.produits=prods});
    console.log("Produits recherche");
    console.log(this.produits);
  }
}
