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
    // console.log(this.route.snapshot.params.id);
    this.categories = this.produitService.listeCategories();
    this.currentProduit =
      this.produitService.consulterProduit(this.activatedRoute.snapshot.
        params['id']);
    this.updatedCatId=this.currentProduit.categorie.idCat;
    console.log(this.currentProduit);
  }

  updateProduit() {
    this.currentProduit.categorie=this.produitService.consulterCategorie(this.updatedCatId);
    this.produitService.updateProduit(this.currentProduit);
    this.router.navigate(['produits']);
  }


}
