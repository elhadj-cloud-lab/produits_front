import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import { Router } from '@angular/router';
import {Categorie} from '../model/categorie.model';
import {Image} from '../model/image.model';

@Component({
  selector: 'app-add-produit',
  imports: [FormsModule],
  templateUrl: './add-produit.html',
})
export class AddProduit implements OnInit {

  newProduit: ProduitModel = new ProduitModel();
  categories! : Categorie[];
  newIdCat! : number;
  newCategorie! : Categorie;
  uploadedImage!: File;
  imagePath: any;

  constructor(private produitService: ProduitService,
              private router: Router,) {
  }

  ngOnInit() {
    this.produitService.listeCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadedImage);
    reader.onload = (_event) => {
      this.imagePath = reader.result;
    };
  }

  addProduit(){
    this.produitService
      .uploadImage(this.uploadedImage, this.uploadedImage.name)
      .subscribe((img: Image) => {
        this.newProduit.image=img;
        this.newProduit.categorie = this.categories.find(cat => cat.idCategorie
          == this.newIdCat)!;
        this.produitService
          .addProduit(this.newProduit)
          .subscribe(() => {
            this.router.navigate(['produits']);
          });
      });
  }

}
