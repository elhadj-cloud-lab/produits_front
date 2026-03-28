import {Component, OnInit} from '@angular/core';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-recherche-par-nom',
  imports: [FormsModule, CommonModule],
  templateUrl: './recherche-par-nom.html',
  styles: ``,
})
export class RechercheParNom implements OnInit {
  nomProduit!: string;
  produits!: ProduitModel[];
  allProduits! : ProduitModel[];
  searchTerm!: string;

  constructor(private produitService: ProduitService) {
  }

  ngOnInit(): void {
    this.produitService.listerProduits().subscribe(prods => {
      console.log(prods);
      this.produits = prods;
      this.allProduits = prods;
    });
  }

  // rechercherProds() {
  //   this.produitService.rechercherParNom(this.nomProduit).subscribe(prods => {
  //     console.log(prods);
  //     this.produits = prods;
  //   });
  // }

  rechercherProds() {
    if (this.nomProduit)
      this.produitService
        .rechercherParNom(this.nomProduit)
        .subscribe((prods) => {
          console.log(prods);
          this.produits = prods;
        });
    else
      this.produitService.listerProduits().subscribe((prods) => {
        console.log(prods);
        this.produits = prods;
      });

  }

  onKeyUp(filterText: string) {
    if (!this.allProduits) return;

    const value = filterText.toLowerCase();

    this.produits = this.allProduits.filter(item =>
      item.nomProduit.toLowerCase().includes(value)
    );
  }
}
