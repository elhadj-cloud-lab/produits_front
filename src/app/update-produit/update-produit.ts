import {Component, OnInit} from '@angular/core';
import {ProduitService} from '../services/produit-service';
import {ProduitModel} from '../model/produit.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {Categorie} from '../model/categorie.model';
import {AuthService} from '../services/auth-service';
import {Image} from '../model/image.model';

@Component({
  selector: 'app-update-produit',
  imports: [FormsModule, DatePipe],
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

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private produitService: ProduitService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.produitService.listeCategories().subscribe(cats => (this.categories = cats));
    this.produitService
      .consulterProduit(this.activatedRoute.snapshot.params['id'])
      .subscribe(produit => {
        this.currentProduit = produit;
        this.updatedCatId = produit.categorie?.idCategorie ?? 0;
        this.loadProductImages();
      });
  }

  loadProductImages() {
    this.produitService.getImagesByProduct(this.currentProduit.idProduit).subscribe(images => {
      this.currentProduit.images = images ?? [];
      if (images?.length > 0) {
        this.mainImageSrc = this.getImageUrl(images[0]);
      }
    });
  }

  updateProduit() {
    this.currentProduit.categorie = this.categories.find(
      cat => cat.idCategorie == this.updatedCatId,
    );
    this.isLoading = true;
    this.produitService.updateProduit(this.currentProduit).subscribe({
      next: () => this.router.navigate(['produits']),
      error: () => (this.isLoading = false),
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
      .subscribe({
        next: (img: Image) => {
          this.isUploadingImage = false;
          if (!this.currentProduit.images) this.currentProduit.images = [];
          this.currentProduit.images.push(img);
          this.mainImageSrc = this.getImageUrl(img);
          this.uploadedImage = undefined;
        },
        error: () => (this.isUploadingImage = false),
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
    this.produitService.supprimerImage(img.idImage).subscribe(() => {
      const index = this.currentProduit.images.indexOf(img);
      if (index > -1) this.currentProduit.images.splice(index, 1);
      this.mainImageSrc =
        this.currentProduit.images.length > 0
          ? this.getImageUrl(this.currentProduit.images[0])
          : 'assets/default-image.png';
    });
  }

  selectMainImage(img: Image) {
    this.mainImageSrc = this.getImageUrl(img);
  }

  getImageUrl(img: Image): string {
    if (!img?.image) return 'assets/default-image.png';
    if (typeof img.image === 'string') {
      return `data:${img.type};base64,${img.image}`;
    }
    if (Array.isArray(img.image)) {
      const base64 = btoa(img.image.map(b => String.fromCharCode(b & 0xff)).join(''));
      return `data:${img.type};base64,${base64}`;
    }
    return 'assets/default-image.png';
  }
}
