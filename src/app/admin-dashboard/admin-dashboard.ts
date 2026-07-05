import {AfterViewChecked, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services/auth-service';
import {ToastrService} from 'ngx-toastr';
import {DashboardStats} from '../model/stats.model';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  Filler,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  Filler,
);

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('hourlyChart') hourlyChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dailyChart') dailyChartRef!: ElementRef<HTMLCanvasElement>;

  stats: DashboardStats | null = null;
  loading = false;
  lastUpdated: Date | null = null;

  private hourlyChart: Chart | null = null;
  private dailyChart: Chart | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly chartsRenderPending = signal(false);

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.hourlyChart?.destroy();
    this.dailyChart?.destroy();
  }

  ngAfterViewChecked(): void {
    if (!this.chartsRenderPending() || !this.stats) {
      return;
    }
    if (!this.hourlyChartRef?.nativeElement || !this.dailyChartRef?.nativeElement) {
      return;
    }
    this.chartsRenderPending.set(false);
    this.renderHourlyChart();
    this.renderDailyChart();
  }

  refresh(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.authService.getDashboardStats().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => {
        this.stats = data;
        this.loading = false;
        this.lastUpdated = new Date();
        this.chartsRenderPending.set(true);
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Impossible de charger les statistiques', 'Erreur');
      },
    });
  }

  private renderHourlyChart(): void {
    if (!this.hourlyChartRef || !this.stats) return;
    this.hourlyChart?.destroy();

    const hours = Array.from({length: 24}, (_, i) => `${i}h`);
    const successData = new Array(24).fill(0);
    const failureData = new Array(24).fill(0);

    this.stats.hourlyStats.forEach(s => {
      successData[s.hour] = s.successes;
      failureData[s.hour] = s.failures;
    });

    this.hourlyChart = new Chart(this.hourlyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Réussies',
            data: successData,
            backgroundColor: 'rgba(25, 135, 84, 0.75)',
            borderColor: 'rgb(25, 135, 84)',
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Échouées',
            data: failureData,
            backgroundColor: 'rgba(220, 53, 69, 0.75)',
            borderColor: 'rgb(220, 53, 69)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {position: 'top', labels: {usePointStyle: true}},
          tooltip: {mode: 'index', intersect: false},
        },
        scales: {y: {beginAtZero: true, ticks: {stepSize: 1}}},
      },
    });
  }

  private renderDailyChart(): void {
    if (!this.dailyChartRef || !this.stats) return;
    this.dailyChart?.destroy();

    const labels = this.stats.dailyStats.map(s => s.day);
    const successData = this.stats.dailyStats.map(s => s.successes);
    const failureData = this.stats.dailyStats.map(s => s.failures);

    this.dailyChart = new Chart(this.dailyChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Réussies',
            data: successData,
            borderColor: 'rgb(25, 135, 84)',
            backgroundColor: 'rgba(25, 135, 84, 0.12)',
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Échouées',
            data: failureData,
            borderColor: 'rgb(220, 53, 69)',
            backgroundColor: 'rgba(220, 53, 69, 0.12)',
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {position: 'top', labels: {usePointStyle: true}},
          tooltip: {mode: 'index', intersect: false},
        },
        scales: {y: {beginAtZero: true, ticks: {stepSize: 1}}},
      },
    });
  }
}
