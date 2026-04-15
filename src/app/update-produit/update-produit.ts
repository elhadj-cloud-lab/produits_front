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
  categories! : Categorie[];
  updatedCatId! : number;

  myImage!: string;

  uploadedImage!: File;
  isImageUpdated: Boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router :Router,
              private produitService: ProduitService,
              public authService: AuthService,
  ) { }
  ngOnInit() {
    this.myImage = 'assets/default-image.png';
    this.produitService.listeCategories().subscribe(categories => {
      this.categories = categories;
    })
    //const productId = this.activatedRoute.snapshot.params['id'];

    this.produitService.consulterProduit(
      this.activatedRoute.snapshot.params['id']).subscribe( produits =>{
        this.currentProduit = produits;
        this.updatedCatId = produits.categorie?.idCategorie ?? 0;

      this.loadProductImages();
      } ) ;


  }

  loadProductImages() {
    const productId = this.currentProduit.idProduit;

    this.produitService.getImagesByProduct(productId).subscribe(images => {
      if (images && images.length > 0) {
        this.currentProduit.images = images;

        // Afficher la première image
        const firstImage = images[0];
        if (firstImage.image) {
          if (typeof firstImage.image === 'string') {
            this.myImage = `data:${firstImage.type};base64,${firstImage.image}`;
          } else if (Array.isArray(firstImage.image)) {
            const base64 = btoa(
              firstImage.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
            );
            this.myImage = `data:${firstImage.type};base64,${base64}`;
          }
        }
      } else {
        this.currentProduit.images = [];
      }
    });
  }

  updateProduit() {
    this.currentProduit.categorie = this.categories.find(cat => cat.idCategorie ==
      this.updatedCatId)!;
    this.produitService.updateProduit(this.currentProduit).subscribe((prod) => {
        this.router.navigate(['produits']);
      });
  }

  onImageUpload(event: any) {
    if(event.target.files && event.target.files.length) {
      this.uploadedImage = event.target.files[0];
      this.isImageUpdated =true;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => {
        this.myImage = reader.result as string;
      };
    }
  }

  onAddImageProduit() {
    this.produitService
      .uploadImageProd(this.uploadedImage,
        this.uploadedImage.name,this.currentProduit.idProduit)
      .subscribe( (img : Image) => {
        if (!this.currentProduit.images) {
          this.currentProduit.images = [];
        }
        this.currentProduit.images.push(img);

        // Afficher la nouvelle image
        if (img.image) {
          if (typeof img.image === 'string') {
            this.myImage = `data:${img.type};base64,${img.image}`;
          } else if (Array.isArray(img.image)) {
            const base64 = btoa(
              img.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
            );
            this.myImage = `data:${img.type};base64,${base64}`;
          }
        }

      });
  }

  supprimerImage(img: Image){
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.produitService.supprimerImage(img.idImage).subscribe(() => {
        //supprimer image du tableau currentProduit.images
        const index = this.currentProduit.images.indexOf(img, 0);
        if (index > -1) {
          this.currentProduit.images.splice(index, 1);
        }
        // Si c'était la dernière image, afficher l'image par défaut
        if (this.currentProduit.images.length === 0) {
          this.myImage = 'assets/default-image.png';
        } else {
          // Afficher la première image restante
          const firstImage = this.currentProduit.images[0];
          if (firstImage && firstImage.image) {
            if (typeof firstImage.image === 'string') {
              this.myImage = `data:${firstImage.type};base64,${firstImage.image}`;
            } else if (Array.isArray(firstImage.image)) {
              const base64 = btoa(
                firstImage.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
              );
              this.myImage = `data:${firstImage.type};base64,${base64}`;
            }
          }
        }

      });
  }

  getImageUrl(img: Image): string {
    if (!img || !img.image) return 'https://via.placeholder.com/100x50?text=Pas+d\'image';

    if (typeof img.image === 'string') {
      return `data:${img.type};base64,${img.image}`;
    } else if (Array.isArray(img.image)) {
      const base64 = btoa(
        img.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
      );
      return `data:${img.type};base64,${base64}`;
    }
    return 'https://via.placeholder.com/100x50?text=Erreur';
  }

}
