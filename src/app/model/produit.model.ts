import {Categorie} from './categorie.model';
import {Image} from './image.model';

export interface ProduitStats {
  totalProduits: number;
  avgPrice: number;
  nbCategories: number;
  topProduits: ProduitModel[];
  prodCategStats: {label: string; count: number}[];
}

export class ProduitModel {
  idProduit!: number;
  nomProduit!: string;
  prixProduit!: number;
  dateCreation!: Date;
  categorie?: Categorie;
  images: Image[] = [];
}
