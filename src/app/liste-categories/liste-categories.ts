import {Component, OnInit} from '@angular/core';
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
  categories! : Categorie[];
  updatedCategorie: Categorie = {nomCategorie:"", description:""};
  ajout:boolean=true;

  constructor(private produitService : ProduitService,
              public authService : AuthService) { }

  ngOnInit(): void {
    this.chargerCategories()
  }

  categorieUpdated(cat: Categorie) {
    const operation = this.ajout
      ? this.produitService.ajouterCategorie(cat)
      : this.produitService.updateCategorie(cat);

    operation.subscribe(() => {
      this.chargerCategories();
      this.nouvelleCategorie(); // reset formulaire après save
    });
  }

  chargerCategories(){
    this.produitService.listeCategories().subscribe(cats => {
      this.categories = cats;
      console.log(cats);
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
      this.produitService.supprimerCategorie(cat.idCategorie).subscribe(() => {
        this.chargerCategories();
      });
    }
  }

}
