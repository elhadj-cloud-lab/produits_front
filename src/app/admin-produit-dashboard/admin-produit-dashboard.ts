import {Component, DestroyRef, inject, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {ProduitService} from '../services/produit-service';
import {ProduitModel} from '../model/produit.model';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-admin-produit-dashboard',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './admin-produit-dashboard.html',
})
export class AdminProduitDashboard implements OnInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  totalProduits = 0;
  avgPrice = 0;
  nbCategories = 0;
  topProduits: ProduitModel[] = [];
  prodCategStats: {label: string; count: number}[] = [];
  isLoading = false;
  lastUpdated: Date | null = null;

  private categoryChart: Chart | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.categoryChart?.destroy();
  }

  loadStats(): void {
    this.isLoading = true;
    this.produitService.listerProduits().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: prods => {
        this.totalProduits = prods.length;
        this.avgPrice =
          prods.length > 0
            ? prods.reduce((sum, p) => sum + (p.prixProduit ?? 0), 0) / prods.length
            : 0;

        const catMap = new Map<string, number>();
        prods.forEach(p => {
          const cat = p.categorie?.nomCategorie ?? 'Sans catégorie';
          catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
        });
        this.nbCategories = catMap.size;
        this.prodCategStats = Array.from(catMap.entries())
          .map(([label, count]) => ({label, count}))
          .sort((a, b) => b.count - a.count);

        this.topProduits = [...prods]
          .sort((a, b) => (b.prixProduit ?? 0) - (a.prixProduit ?? 0))
          .slice(0, 5);

        this.isLoading = false;
        this.lastUpdated = new Date();
        setTimeout(() => this.renderCategoryChart(), 50);
      },
      error: () => (this.isLoading = false),
    });
  }

  private renderCategoryChart(): void {
    if (!this.categoryChartRef || this.prodCategStats.length === 0) return;
    this.categoryChart?.destroy();

    const palette = [
      '#0d6efd', '#198754', '#dc3545', '#ffc107',
      '#0dcaf0', '#6f42c1', '#fd7e14', '#20c997',
    ];

    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.prodCategStats.map(s => s.label),
        datasets: [
          {
            data: this.prodCategStats.map(s => s.count),
            backgroundColor: this.prodCategStats.map((_, i) => palette[i % palette.length]),
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {position: 'right', labels: {usePointStyle: true, padding: 16}},
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label} : ${ctx.parsed} produit(s)`,
            },
          },
        },
      },
    });
  }
}
