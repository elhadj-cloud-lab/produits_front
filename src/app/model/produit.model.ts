import {Categorie} from './categorie.model';

export class ProduitModel {
  idProduit!: number;
  nomProduit!: string;
  prixProduit!: number;
  dateCreation!: Date;
  categorie!: Categorie;
}
