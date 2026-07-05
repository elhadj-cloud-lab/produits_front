import {Component, DestroyRef, inject, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {ProduitService} from '../services/produit-service';
import {ProduitModel, ProduitStats} from '../model/produit.model';
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

  stats: ProduitStats | null = null;
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
        this.stats = this.produitService.computeStats(prods);
        this.isLoading = false;
        this.lastUpdated = new Date();
        setTimeout(() => this.renderCategoryChart(), 50);
      },
      error: () => (this.isLoading = false),
    });
  }

  private renderCategoryChart(): void {
    if (!this.categoryChartRef || !this.stats?.prodCategStats.length) return;
    this.categoryChart?.destroy();

    const palette = [
      '#0d6efd', '#198754', '#dc3545', '#ffc107',
      '#0dcaf0', '#6f42c1', '#fd7e14', '#20c997',
    ];

    this.categoryChart = new Chart(this.categoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.stats.prodCategStats.map(s => s.label),
        datasets: [
          {
            data: this.stats.prodCategStats.map(s => s.count),
            backgroundColor: this.stats.prodCategStats.map((_: unknown, i: number) => palette[i % palette.length]),
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
