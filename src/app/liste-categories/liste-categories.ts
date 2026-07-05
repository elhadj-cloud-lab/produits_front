import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Categorie} from '../model/categorie.model';
import {ProduitService} from '../services/produit-service';
import {CommonModule} from '@angular/common';
import {UpdateCategorie} from '../update-categorie/update-categorie';
import {AuthService} from '../services/auth-service';

@Component({
  selector: 'app-liste-categories',
  imports: [CommonModule, UpdateCategorie],
  templateUrl: './liste-categories.html',
  styleUrl: './liste-categories.css',
})
export class ListeCategories implements OnInit {
  categories: Categorie[] = [];
  updatedCategorie: Categorie = {nomCategorie: '', description: ''};
  ajout = true;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private produitService: ProduitService,
              public authService: AuthService) {}

  ngOnInit(): void {
    this.chargerCategories()
  }

  categorieUpdated(cat: Categorie) {
    const operation = this.ajout
      ? this.produitService.ajouterCategorie(cat)
      : this.produitService.updateCategorie(cat);

    operation.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.chargerCategories();
        this.nouvelleCategorie();
      },
    });
  }

  chargerCategories(){
    this.produitService.listeCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: cats => (this.categories = cats),
    });
  }

  nouvelleCategorie() {
    this.updatedCategorie = { nomCategorie: "",description: "" };
    this.ajout = true;
  }

  updateCategorie(cat:Categorie) {
    this.updatedCategorie = { ...cat };
    this.ajout=false;
  }

  supprimerCategorie(cat: Categorie) {
    if (!cat.idCategorie) return;

    if (confirm(`Supprimer la catégorie "${cat.nomCategorie}" ?`)) {
      this.produitService.supprimerCategorie(cat.idCategorie).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.chargerCategories(),
      });
    }
  }

}
