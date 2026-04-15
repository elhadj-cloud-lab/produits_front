import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ProduitModel} from '../model/produit.model';
import {ProduitService} from '../services/produit-service';
import {AuthService} from '../services/auth-service';
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-produits',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './produits.html',
})
export class Produits implements OnInit {

  produits: ProduitModel[] = [];

  constructor( private produitService: ProduitService,
               public authService: AuthService) {
  }

  ngOnInit() {
    this.chargerProduits();
  }

  // chargerProduits(){
  //   this.produitService.listerProduits().subscribe(prods => {
  //     this.produits = prods;
  //
  //     // Pour chaque produit, chargez ses images
  //     this.produits.forEach((prod) => {
  //       // Appel à l'endpoint qui fonctionne
  //       this.produitService.getImagesByProduct(prod.idProduit).subscribe(images => {
  //         if (images && images.length > 0) {
  //           const img = images[0];
  //
  //           // Vérifiez le format de l'image
  //           console.log('Image reçue:', img);
  //
  //           if (Array.isArray(img.image)) {
  //             // Convertir le tableau de bytes
  //             const base64 = btoa(
  //               img.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
  //             );
  //             prod.imageStr = `data:${img.type};base64,${base64}`;
  //           } else if (typeof img.image === 'string') {
  //             prod.imageStr = `data:${img.type};base64,${img.image}`;
  //           } else {
  //             prod.imageStr = 'https://via.placeholder.com/100x50?text=Image';
  //           }
  //         } else {
  //           prod.imageStr = 'https://via.placeholder.com/100x50?text=Pas+d\'image';
  //         }
  //       });
  //     });
  //   });
  // }
  chargerProduits(){
    this.produitService.listerProduits().subscribe(prods => {
      this.produits = prods;

      // Chargez toutes les images en parallèle
      const imageRequests = this.produits.map(prod =>
        this.produitService.getImagesByProduct(prod.idProduit).pipe(
          map(images => ({ prod, images }))
        )
      );

      forkJoin(imageRequests).subscribe(results => {
        results.forEach(({ prod, images }) => {
          if (images && images.length > 0) {
            const img = images[0];
            if (Array.isArray(img.image)) {
              const base64 = btoa(
                img.image.map(byte => String.fromCharCode(byte & 0xFF)).join('')
              );
              prod.imageStr = `data:${img.type};base64,${base64}`;
            } else if (typeof img.image === 'string') {
              prod.imageStr = `data:${img.type};base64,${img.image}`;
            } else {
              prod.imageStr = 'https://via.placeholder.com/100x50?text=Image';
            }
          } else {
            prod.imageStr = 'https://via.placeholder.com/100x50?text=Pas+d\'image';
          }
        });
      });
    });
  }

  supprimerProduit(produit: ProduitModel) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.produitService.supprimerProduit(produit.idProduit).subscribe(() => {
        this.chargerProduits();
      });
  }

}
