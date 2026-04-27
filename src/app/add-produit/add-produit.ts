import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import { Router } from '@angular/router';
import {Categorie} from '../model/categorie.model';

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

  addProduit() {
    this.newProduit.categorie = this.categories.find(
      cat => cat.idCategorie == this.newIdCat
    )!;

    this.produitService.addProduit(this.newProduit).subscribe((prod) => {
      console.log("Produit sauvegardé =", prod);
      console.log("ID produit =", prod.idProduit);

      this.produitService.uploadImageProd(
        this.uploadedImage,
        this.uploadedImage.name,
        prod.idProduit
      ).subscribe(() => {
        this.router.navigate(['produits']);
      });
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

}
