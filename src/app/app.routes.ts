import { Routes } from '@angular/router';
import {Produits} from './produits/produits';
import {AddProduit} from './add-produit/add-produit';
import {UpdateProduit} from './update-produit/update-produit';

export const routes: Routes = [
  {path: "produits", component: Produits },
  {path: "add-produit", component: AddProduit },
  {path: "updateProduit/:id", component: UpdateProduit},
  {path: "", redirectTo: "produits", pathMatch: "full"},
];
