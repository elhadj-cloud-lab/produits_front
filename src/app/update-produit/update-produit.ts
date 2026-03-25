import {Component, OnInit} from '@angular/core';
import {ProduitService} from '../services/produit-service';
import {ProduitModel} from '../model/produit';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-update-produit',
  imports: [FormsModule, DatePipe],
  templateUrl: './update-produit.html',
  styles: ``,
})
export class UpdateProduit implements OnInit {

  currentProduit = new ProduitModel();
  constructor(private activatedRoute: ActivatedRoute,
              private router :Router,
              private produitService: ProduitService
  ) { }
  ngOnInit() {
    // console.log(this.route.snapshot.params.id);
    this.currentProduit =
      this.produitService.consulterProduit(this.activatedRoute.snapshot.
        params['id']);
    console.log(this.currentProduit);
  }

  updateProduit()
  { //console.log(this.currentProduit);
    this.produitService.updateProduit(this.currentProduit);
    this.router.navigate(['produits']);
  }


}
