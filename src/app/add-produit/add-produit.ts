import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {Router} from '@angular/router';
import {Categorie} from '../model/categorie.model';
import {catchError, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-add-produit',
  imports: [FormsModule],
  templateUrl: './add-produit.html',
})
export class AddProduit implements OnInit {
  newProduit: ProduitModel = new ProduitModel();
  categories: Categorie[] = [];
  newIdCat!: number;

  uploadedImage?: File;
  imagePath: string | ArrayBuffer | null = null;
  isLoading = false;
  errorMessage = '';
  isDragging = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private produitService: ProduitService, private router: Router) {}

  ngOnInit() {
    this.produitService.listeCategories().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: cats => (this.categories = cats),
      error: () => (this.errorMessage = 'Impossible de charger les catégories.'),
    });
  }

  addProduit() {
    this.errorMessage = '';
    const cat = this.categories.find(c => c.idCategorie == this.newIdCat);
    if (!cat) {
      this.errorMessage = 'Veuillez sélectionner une catégorie.';
      return;
    }
    this.newProduit.categorie = cat;
    this.isLoading = true;

    this.produitService.addProduit(this.newProduit).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(prod =>
        this.uploadedImage
          ? this.produitService
              .uploadImageProd(this.uploadedImage!, this.uploadedImage!.name, prod.idProduit)
              .pipe(catchError(() => of(null)))
          : of(null)
      )
    ).subscribe({
      next: () => this.router.navigate(['produits']),
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la création du produit. Veuillez réessayer.';
      },
    });
  }

  cancel() {
    this.router.navigate(['produits']);
  }

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.processFile(input.files[0]);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) this.processFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  removeImage() {
    this.uploadedImage = undefined;
    this.imagePath = null;
  }

  private processFile(file: File) {
    this.uploadedImage = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => (this.imagePath = reader.result);
  }
}
