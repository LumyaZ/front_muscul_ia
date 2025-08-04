import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';
import { TrainingSession } from '../../../../models/training-session.model';

@Component({
  selector: 'app-user-trainings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-trainings.component.html',
  styleUrls: ['./user-trainings.component.scss']
})
export class UserTrainingsComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private trainingSessionService = inject(TrainingSessionService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  trainingSessions: TrainingSession[] = [];
  isLoading = false;
  error: string | null = null;
  success: string | null = null;
  currentUser: User | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données de l'utilisateur connecté
   * Load connected user data
   */
  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.error = 'Utilisateur non connecté';
      console.error('No user found in user trainings component');
      return;
    }
    
    this.loadTrainingSessions();
  }

  /**
   * Charge les sessions d'entraînement de l'utilisateur
   * Load user training sessions
   */
  loadTrainingSessions(): void {
    this.isLoading = true;
    this.error = null;

    this.trainingSessionService.getUserTrainingSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sessions) => {
          this.trainingSessions = sessions;
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error, 'Erreur lors du chargement des sessions d\'entraînement');
          this.isLoading = false;
        }
      });
  }

  /**
   * Gère les erreurs de manière centralisée
   * Handle errors in a centralized way
   */
  private handleError(error: any, defaultMessage: string): void {
    console.error('Erreur lors du chargement des sessions d\'entraînement:', error);
    console.error('Error details:', error.error);
    console.error('Error status:', error.status);
    
    if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      this.error = 'Aucune session d\'entraînement trouvée.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = defaultMessage;
    }
  }

  /**
   * Rafraîchit la liste des entraînements
   * Refresh trainings list
   */
  refreshTrainings(): void {
    this.loadTrainingSessions();
  }

  /**
   * Formate une date en format français
   * Format date in French format
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Formate la durée en heures et minutes
   * Format duration in hours and minutes
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    } else {
      return `${mins}min`;
    }
  }

  /**
   * Affiche les détails d'une session d'entraînement
   * View training session details
   */
  viewTrainingSession(sessionId?: number): void {
    if (sessionId) {
      this.router.navigate(['/dashboard/record/training-recap'], {
        queryParams: { sessionId: sessionId }
      });
    }
  }

  /**
   * Supprime une session d'entraînement
   * Delete training session
   */
  deleteTrainingSession(sessionId?: number): void {
    if (!sessionId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session d\'entraînement ?')) {
      this.trainingSessionService.deleteTrainingSession(sessionId).subscribe({
        next: () => {
          this.trainingSessions = this.trainingSessions.filter(s => s.id !== sessionId);
          this.success = 'Session supprimée avec succès';
          setTimeout(() => this.success = '', 3000);
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Erreur lors de la suppression de la session';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  /**
   * Fonction de tracking pour optimiser les performances de la liste
   * TrackBy function to optimize list performance
   */
  trackBySessionId(index: number, session: TrainingSession): number {
    return session.id || index;
  }
} 