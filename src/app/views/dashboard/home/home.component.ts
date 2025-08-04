import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { TrainingSessionService } from '../../../services/training-session.service';
import { User } from '../../../models/user.model';
import { TrainingSession } from '../../../models/training-session.model';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private authService = inject(AuthService);
  private trainingSessionService = inject(TrainingSessionService);
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  recentTrainings: TrainingSession[] = [];
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et charge les données
   * Initialize component and load data
   */
  private initializeComponent(): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      this.loadRecentTrainings();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du composant home:', error);
      this.error = 'Erreur lors du chargement des données';
      this.isLoading = false;
    }
  }

  /**
   * Charge tous les entraînements de l'utilisateur
   * Load all user's training sessions
   */
  private loadRecentTrainings(): void {
    this.trainingSessionService.getUserTrainingSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sessions) => {
          this.recentTrainings = sessions;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des entraînements:', error);
          this.error = 'Erreur lors du chargement des entraînements';
          this.isLoading = false;
        }
      });
  }

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
    this.initializeComponent();
  }

  /**
   * Formate la date d'un entraînement
   * Format training session date
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formate la durée d'un entraînement
   * Format training session duration
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }

  /**
   * Calcule la durée totale des entraînements récents
   * Calculate total duration of recent trainings
   */
  getTotalDuration(): string {
    const totalMinutes = this.recentTrainings.reduce((total, training) => {
      return total + (training.durationMinutes || 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  }

  /**
   * Calcule la durée moyenne des entraînements récents
   * Calculate average duration of recent trainings
   */
  getAverageDuration(): string {
    if (this.recentTrainings.length === 0) {
      return '0min';
    }
    
    const totalMinutes = this.recentTrainings.reduce((total, training) => {
      return total + (training.durationMinutes || 0);
    }, 0);
    
    const averageMinutes = Math.round(totalMinutes / this.recentTrainings.length);
    const hours = Math.floor(averageMinutes / 60);
    const minutes = averageMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    }
    return `${minutes}min`;
  }

  /**
   * Navigue vers la page d'enregistrement
   * Navigate to record page
   */
  startNewTraining(): void {
    try {
      this.router.navigate(['/dashboard/record']);
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      this.error = 'Erreur lors de la navigation';
    }
  }

  /**
   * Navigue vers la page des programmes
   * Navigate to programs page
   */
  viewPrograms(): void {
    try {
      this.router.navigate(['/dashboard/programs']);
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      this.error = 'Erreur lors de la navigation';
    }
  }
} 