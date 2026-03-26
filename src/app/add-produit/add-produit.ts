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

  constructor(private produitService: ProduitService,
              private router: Router,) {
  }

  ngOnInit() {
    this.produitService.listeCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  addProduit(){
    this.newProduit.categorie = this.categories.find(cat => cat.idCategorie == this.newIdCat)!;
    this.produitService.addProduit(this.newProduit)
      .subscribe(prod => {
        this.router.navigate(['produits']);
      });
  }

}
