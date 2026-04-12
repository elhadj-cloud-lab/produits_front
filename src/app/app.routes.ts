import { Routes } from '@angular/router';
import {Produits} from './produits/produits';
import {AddProduit} from './add-produit/add-produit';
import {UpdateProduit} from './update-produit/update-produit';
import {RechercheParCategorie} from './recherche-par-categorie/recherche-par-categorie';
import {RechercheParNom} from './recherche-par-nom/recherche-par-nom';
import {ListeCategories} from './liste-categories/liste-categories';
import {Login} from './login/login';
import {Forbidden} from './forbidden/forbidden';
import {produitGuard} from './produit-guard';
import {Register} from './register/register';
import {VerifEmail} from './verif-email/verif-email';

export const routes: Routes = [
  {path: "produits", component: Produits },
  {path: "add-produit", component: AddProduit, canActivate:[produitGuard] },
  {path: "updateProduit/:id", component: UpdateProduit},
  {path: "", redirectTo: "produits", pathMatch: "full"},
  {path: "rechercheParCategorie", component : RechercheParCategorie},
  {path: "rechercheParNom", component : RechercheParNom},
  {path: 'login', component : Login},
  {path: 'app-forbidden', component: Forbidden},
  {path:'register',component: Register},
  { path: 'verifEmail', component: VerifEmail },
  {path: "listeCategories", component : ListeCategories},
];
