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
    this.produitService.listeCategories().subscribe(categories => {
      this.categories = categories;
    })
    this.produitService.consulterProduit(
      this.activatedRoute.snapshot.params['id']).subscribe( produits =>{
        this.currentProduit = produits;
        //this.updatedCatId = this.currentProduit.categorie?.idCategorie
      } ) ;
  }

  onImageUpload(event: any) {
    if(event.target.files && event.target.files.length) {
      this.uploadedImage = event.target.files[0];
      this.isImageUpdated =true;
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => { this.myImage = reader.result as string; };
    }
  }

  onAddImageProduit() {
    this.produitService
      .uploadImageProd(this.uploadedImage,
        this.uploadedImage.name,this.currentProduit.idProduit)
      .subscribe( (img : Image) => {
        this.currentProduit.images.push(img);
      });
  }

  // updateProduit() {
  //   this.currentProduit.categorie = this.categories.find(cat => cat.idCategorie = this.updatedCatId)!;
  //   this.produitService.updateProduit(this.currentProduit).subscribe(prod => {
  //     this.router.navigate(['produits']); }
  //   );
  // }

  supprimerImage(img: Image){
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.produitService.supprimerImage(img.idImage).subscribe(() => {
        //supprimer image du tableau currentProduit.images
        const index = this.currentProduit.images.indexOf(img, 0);
        if (index > -1) {
          this.currentProduit.images.splice(index, 1);
        }
      });
  }
  updateProduit() {
    this.currentProduit.categorie = this.categories.find(cat => cat.idCategorie ==
      this.updatedCatId)!;
    this.produitService
      .updateProduit(this.currentProduit)
      .subscribe((prod) => {
        this.router.navigate(['produits']);
      });
  }

}
