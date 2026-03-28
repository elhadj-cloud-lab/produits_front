import { Routes } from '@angular/router';
import {Produits} from './produits/produits';
import {AddProduit} from './add-produit/add-produit';
import {UpdateProduit} from './update-produit/update-produit';
import {RechercheParCategorie} from './recherche-par-categorie/recherche-par-categorie';
import {RechercheParNom} from './recherche-par-nom/recherche-par-nom';

export const routes: Routes = [
  {path: "produits", component: Produits },
  {path: "add-produit", component: AddProduit },
  {path: "updateProduit/:id", component: UpdateProduit},
  {path: "", redirectTo: "produits", pathMatch: "full"},
  {path: "rechercheParCategorie", component : RechercheParCategorie},
  {path: "rechercheParNom", component : RechercheParNom},
];
