import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Categorie} from '../model/categorie.model';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-recherche-par-categorie',
  imports: [FormsModule, CommonModule],
  templateUrl: './recherche-par-categorie.html',
  styles: ``,
})
export class RechercheParCategorie implements OnInit {
  produits: ProduitModel[] = [];
  idCategorie!: number;
  categories: Categorie[] = [];

  private readonly destroyRef = inject(DestroyRef);

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produitService.listeCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: cats => (this.categories = cats),
    });
  }

  onChange() {
    this.produitService.rechercherParCategorie(this.idCategorie).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: prods => (this.produits = prods),
    });
  }
}
