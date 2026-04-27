import {Categorie} from './categorie.model';
import {Image} from './image.model';

export class ProduitModel {
  idProduit!: number;
  nomProduit!: string;
  prixProduit!: number;
  dateCreation!: Date;
  categorie?: Categorie;
  imageStr!: string;
  images!: Image[];
}
