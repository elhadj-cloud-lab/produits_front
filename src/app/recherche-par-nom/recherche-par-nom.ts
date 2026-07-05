import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
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
  nomProduit = '';
  produits: ProduitModel[] = [];
  private allProduits: ProduitModel[] = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produitService.listerProduits().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: prods => {
        this.allProduits = prods;
        this.produits = prods;
      },
    });
  }

  rechercherProds() {
    if (this.nomProduit.trim()) {
      this.produitService.rechercherParNom(this.nomProduit).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: prods => (this.produits = prods),
      });
    } else {
      this.produits = [...this.allProduits];
    }
  }

  onKeyUp(filterText: string) {
    const value = filterText.toLowerCase();
    this.produits = this.allProduits.filter(p => p.nomProduit.toLowerCase().includes(value));
  }
}
