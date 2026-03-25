import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ProduitModel} from '../model/produit';
import {ProduitService} from '../services/produit-service';

@Component({
  selector: 'app-add-produit',
  imports: [FormsModule],
  templateUrl: './add-produit.html',
})
export class AddProduit implements OnInit {

  newProduit: ProduitModel = new ProduitModel();
  message! :string

  constructor(private produitService: ProduitService) {
  }

  ngOnInit() {

  }

  addProduit() {
    console.log(this.newProduit);
    this.produitService.addProduit(this.newProduit);
    this.message = "Produit "+ this.newProduit.nomProduit+ " ajouté avec succès !";
  }

}
