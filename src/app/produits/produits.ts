import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {AuthService} from '../services/auth-service';
import {Categorie} from '../model/categorie.model';
import {Image} from '../model/image.model';

@Component({
  selector: 'app-produits',
  imports: [DatePipe, RouterLink, CurrencyPipe],
  templateUrl: './produits.html',
})
export class Produits implements OnInit {
  allProduits: ProduitModel[] = [];
  filteredProduits: ProduitModel[] = [];
  categories: Categorie[] = [];
  selectedCatId: number | null = null;
  isLoading = true;
  confirmDeleteId: number | null = null;

  // Signal : Angular traque exactement quels templates lisent imageUrls()
  // et les rerend au moment précis où le signal change
  readonly imageUrls = signal<Record<number, string>>({});

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private produitService: ProduitService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    this.isLoading = true;
    this.imageUrls.set({});
    this.produitService.listerProduits().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(prods => {
      this.allProduits = prods;
      this.applyFilter();
      this.isLoading = false;

      const catMap = new Map<number, Categorie>();
      prods.forEach(p => {
        if (p.categorie?.idCategorie) catMap.set(p.categorie.idCategorie, p.categorie);
      });
      this.categories = Array.from(catMap.values());

      prods.forEach(prod => this.chargerImageProduit(prod));
    });
  }

  private chargerImageProduit(prod: ProduitModel) {
    this.produitService.getImagesByProduct(prod.idProduit).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(images => {
      if (images?.length > 0) {
        // update() garantit une mise à jour atomique du signal
        this.imageUrls.update(prev => ({...prev, [prod.idProduit]: this.toDataUrl(images[0])}));
      }
    });
  }

  private toDataUrl(img: Image): string {
    if (Array.isArray(img.image)) {
      const base64 = btoa(img.image.map(b => String.fromCharCode(b & 0xff)).join(''));
      return `data:${img.type};base64,${base64}`;
    }
    if (typeof img.image === 'string') {
      return `data:${img.type};base64,${img.image}`;
    }
    return '';
  }

  filtrerParCategorie(catId: number | null) {
    this.selectedCatId = catId;
    this.applyFilter();
  }

  private applyFilter() {
    this.filteredProduits =
      this.selectedCatId === null
        ? [...this.allProduits]
        : this.allProduits.filter(p => p.categorie?.idCategorie == this.selectedCatId);
  }

  confirmDelete(id: number) {
    this.confirmDeleteId = id;
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }

  supprimerProduit(produit: ProduitModel) {
    this.confirmDeleteId = null;
    this.produitService.supprimerProduit(produit.idProduit).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.allProduits = this.allProduits.filter(p => p.idProduit !== produit.idProduit);
      this.applyFilter();
    });
  }
}
