import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProduitService} from '../services/produit-service';
import {ProduitModel} from '../model/produit.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Categorie} from '../model/categorie.model';
import {AuthService} from '../services/auth-service';
import {Image} from '../model/image.model';
import {imageToDataUrl, ImageUrlPipe} from '../shared/image-url.pipe';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-update-produit',
  imports: [FormsModule, DatePipe, ImageUrlPipe],
  templateUrl: './update-produit.html',
  styles: ``,
})
export class UpdateProduit implements OnInit {
  currentProduit = new ProduitModel();
  categories: Categorie[] = [];
  updatedCatId!: number;

  mainImageSrc = 'assets/default-image.png';
  uploadedImage?: File;
  isLoading = false;
  isUploadingImage = false;
  confirmDeleteId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly toastr = inject(ToastrService);

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private produitService: ProduitService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.produitService.listeCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: cats => (this.categories = cats),
      error: () => this.toastr.error('Impossible de charger les catégories', 'Erreur'),
    });
    this.produitService
      .consulterProduit(this.activatedRoute.snapshot.params['id'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: produit => {
          this.currentProduit = produit;
          this.updatedCatId = produit.categorie?.idCategorie ?? 0;
          this.loadProductImages();
        },
        error: () => this.toastr.error('Impossible de charger le produit', 'Erreur'),
      });
  }

  loadProductImages() {
    this.produitService.getImagesByProduct(this.currentProduit.idProduit).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: images => {
        this.currentProduit.images = images ?? [];
        if (images?.length > 0) {
          this.mainImageSrc = imageToDataUrl(images[0]);
        }
      },
      error: () => this.toastr.error('Impossible de charger les images', 'Erreur'),
    });
  }

  updateProduit() {
    this.currentProduit.categorie = this.categories.find(
      cat => cat.idCategorie === this.updatedCatId,
    );
    this.isLoading = true;
    this.produitService.updateProduit(this.currentProduit).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.router.navigate(['produits']),
      error: () => {
        this.isLoading = false;
        this.toastr.error('Impossible d\'enregistrer le produit', 'Erreur');
      },
    });
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.uploadedImage = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => (this.mainImageSrc = reader.result as string);
    }
  }

  onAddImageProduit() {
    if (!this.uploadedImage) return;
    this.isUploadingImage = true;
    this.produitService
      .uploadImageProd(this.uploadedImage, this.uploadedImage.name, this.currentProduit.idProduit)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (img: Image) => {
          this.isUploadingImage = false;
          if (!this.currentProduit.images) this.currentProduit.images = [];
          this.currentProduit.images.push(img);
          this.mainImageSrc = imageToDataUrl(img);
          this.uploadedImage = undefined;
        },
        error: () => {
          this.isUploadingImage = false;
          this.toastr.error('Impossible d\'ajouter l\'image', 'Erreur');
        },
      });
  }

  confirmDelete(id: number) {
    this.confirmDeleteId = id;
  }

  cancelDelete() {
    this.confirmDeleteId = null;
  }

  supprimerImage(img: Image) {
    this.confirmDeleteId = null;
    this.produitService.supprimerImage(img.idImage).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        const index = this.currentProduit.images.indexOf(img);
        if (index > -1) this.currentProduit.images.splice(index, 1);
        this.mainImageSrc =
          this.currentProduit.images.length > 0
            ? imageToDataUrl(this.currentProduit.images[0])
            : 'assets/default-image.png';
      },
      error: () => this.toastr.error('Impossible de supprimer l\'image', 'Erreur'),
    });
  }

  selectMainImage(img: Image) {
    this.mainImageSrc = imageToDataUrl(img);
  }

}
