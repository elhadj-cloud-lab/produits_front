import {Component, OnInit} from '@angular/core';
import {ProduitService} from '../services/produit-service';
import {ProduitModel} from '../model/produit.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Categorie} from '../model/categorie.model';

@Component({
  selector: 'app-update-produit',
  imports: [FormsModule, DatePipe],
  templateUrl: './update-produit.html',
  styles: ``,
})
export class UpdateProduit implements OnInit {

  currentProduit = new ProduitModel();
  categories! : Categorie[];
  updatedCatId! : number;

  constructor(private activatedRoute: ActivatedRoute,
              private router :Router,
              private produitService: ProduitService
  ) { }
  ngOnInit() {
    this.produitService.listeCategories().subscribe(categories => {
      this.categories = categories;
    })
    this.produitService.consulterProduit(
      this.activatedRoute.snapshot.params['id']).subscribe( produits =>{
        this.currentProduit = produits;
        //this.updatedCatId = this.currentProduit.categorie.idCategorie;
      } ) ;
  }

  updateProduit() {
    this.currentProduit.categorie = this.categories.find(cat => cat.idCategorie = this.updatedCatId)!;
    this.produitService.updateProduit(this.currentProduit).subscribe(prod => {
      this.router.navigate(['produits']); }
    );
  }

}
