import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-user-trainings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-trainings.component.html',
  styleUrls: ['./user-trainings.component.scss']
})
export class UserTrainingsComponent implements OnInit, AfterViewInit {
  @ViewChild('activityChart') chartRef!: ElementRef<HTMLCanvasElement>;
  
  isLoading = false;
  error: string | null = null;
  activeTab: 'current' | 'completed' = 'current';
  currentTrainings: any[] = [];
  completedTrainings: any[] = [];
  
  // Données pour le graphique
  activityChart: Chart | null = null;
  weeklyActivityData = [
    { week: 'Semaine 1', activities: 3 },
    { week: 'Semaine 2', activities: 5 },
    { week: 'Semaine 3', activities: 2 },
    { week: 'Semaine 4', activities: 7 },
    { week: 'Semaine 5', activities: 4 },
    { week: 'Semaine 6', activities: 6 },
    { week: 'Semaine 7', activities: 8 },
    { week: 'Semaine 8', activities: 5 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTrainings();
  }

  ngAfterViewInit() {
    this.createActivityChart();
  }

  setActiveTab(tab: 'current' | 'completed'): void {
    this.activeTab = tab;
  }

  loadTrainings() {
    this.isLoading = true;
    this.error = null;
    
    // TODO: Charger les vraies données depuis le service
    setTimeout(() => {
      this.isLoading = false;
      // Simulation de données
      this.currentTrainings = [];
      this.completedTrainings = [];
    }, 1000);
  }

  createActivityChart() {
    if (!this.chartRef) return;

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.weeklyActivityData.map(item => item.week),
        datasets: [{
          label: 'Activités par semaine',
          data: this.weeklyActivityData.map(item => item.activities),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#4CAF50',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Activités: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12
              }
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              font: {
                size: 12
              },
              stepSize: 1
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.activityChart = new Chart(ctx, config);
  }

  goBackToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  refreshTrainings() {
    this.loadTrainings();
  }
} 