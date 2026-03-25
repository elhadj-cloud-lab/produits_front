import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import { Router } from '@angular/router';
import {Categorie} from '../model/categorie.model';

@Component({
  selector: 'app-add-produit',
  imports: [FormsModule],
  templateUrl: './add-produit.html',
})
export class AddProduit implements OnInit {

  newProduit: ProduitModel = new ProduitModel();
  categories! : Categorie[];
  newIdCat! : number;
  newCategorie! : Categorie;

  message! :string

  constructor(private produitService: ProduitService,
              private router: Router,) {
  }

  ngOnInit() {
    this.categories = this.produitService.listeCategories();
  }

  addProduit() {
    this.newCategorie = this.produitService.consulterCategorie(this.newIdCat);
    this.newProduit.categorie = this.newCategorie;
    this.produitService.addProduit(this.newProduit);
    this.router.navigate(['produits']);
  }

}
