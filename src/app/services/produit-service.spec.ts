import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ProduitService } from './produit-service';
import {ProduitModel} from '../model/produit.model';
import {Categorie} from '../model/categorie.model';

describe('ProduitService', () => {
  let service: ProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(ProduitService);
  });

  it('extracts unique categories from products', () => {
    const cat1: Categorie = {idCategorie: 1, nomCategorie: 'A', description: ''};
    const cat2: Categorie = {idCategorie: 2, nomCategorie: 'B', description: ''};
    const prods = [
      {idProduit: 1, nomProduit: 'P1', prixProduit: 10, categorie: cat1},
      {idProduit: 2, nomProduit: 'P2', prixProduit: 20, categorie: cat1},
      {idProduit: 3, nomProduit: 'P3', prixProduit: 30, categorie: cat2},
    ] as ProduitModel[];

    const categories = service.extractCategories(prods);

    expect(categories.length).toBe(2);
    expect(categories.map(c => c.idCategorie)).toEqual([1, 2]);
  });

  it('computes product statistics', () => {
    const prods = [
      {idProduit: 1, nomProduit: 'P1', prixProduit: 10, categorie: {idCategorie: 1, nomCategorie: 'A', description: ''}},
      {idProduit: 2, nomProduit: 'P2', prixProduit: 30, categorie: {idCategorie: 1, nomCategorie: 'A', description: ''}},
      {idProduit: 3, nomProduit: 'P3', prixProduit: 20, categorie: {idCategorie: 2, nomCategorie: 'B', description: ''}},
    ] as ProduitModel[];

    const stats = service.computeStats(prods);

    expect(stats.totalProduits).toBe(3);
    expect(stats.avgPrice).toBe(20);
    expect(stats.nbCategories).toBe(2);
    expect(stats.topProduits[0].nomProduit).toBe('P2');
    expect(stats.prodCategStats[0]).toEqual({label: 'A', count: 2});
  });
});
