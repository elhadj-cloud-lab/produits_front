import { Routes } from '@angular/router';
import {Produits} from './produits/produits';
import {AddProduit} from './add-produit/add-produit';
import {UpdateProduit} from './update-produit/update-produit';
import {RechercheParCategorie} from './recherche-par-categorie/recherche-par-categorie';
import {RechercheParNom} from './recherche-par-nom/recherche-par-nom';
import {ListeCategories} from './liste-categories/liste-categories';
import {Login} from './login/login';
import {Forbidden} from './forbidden/forbidden';
import {authGuard} from './auth-guard';
import {adminGuard} from './produit-guard';
import {Register} from './register/register';
import {VerifEmail} from './verif-email/verif-email';
import {AdminUsers} from './admin-users/admin-users';
import {AdminDashboard} from './admin-dashboard/admin-dashboard';
import {AdminProduitDashboard} from './admin-produit-dashboard/admin-produit-dashboard';

export const routes: Routes = [
  {path: 'produits', component: Produits, canActivate: [authGuard]},
  {path: 'add-produit', component: AddProduit, canActivate: [authGuard, adminGuard]},
  {path: 'update-produit/:id', component: UpdateProduit, canActivate: [authGuard, adminGuard]},
  {path: '', redirectTo: 'produits', pathMatch: 'full'},
  {path: 'recherche-par-categorie', component: RechercheParCategorie, canActivate: [authGuard]},
  {path: 'recherche-par-nom', component: RechercheParNom, canActivate: [authGuard]},
  {path: 'login', component: Login},
  {path: 'app-forbidden', component: Forbidden},
  {path: 'register', component: Register},
  {path: 'verif-email', component: VerifEmail},
  {path: 'liste-categories', component: ListeCategories, canActivate: [authGuard, adminGuard]},
  {path: 'admin/users', component: AdminUsers, canActivate: [authGuard, adminGuard]},
  {path: 'admin/dashboard', component: AdminDashboard, canActivate: [authGuard, adminGuard]},
  {path: 'admin/produit-dashboard', component: AdminProduitDashboard, canActivate: [authGuard, adminGuard]},
];
