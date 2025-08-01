import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrainingSessionService, TrainingSessionDto } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-user-trainings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-trainings.component.html',
  styleUrls: ['./user-trainings.component.scss']
})
export class UserTrainingsComponent implements OnInit {
  
  trainingSessions: TrainingSessionDto[] = [];
  loading = false;
  error = '';
  currentUser: any = null;

  constructor(
    private router: Router,
    private trainingSessionService: TrainingSessionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('=== USER TRAININGS COMPONENT: INIT ===');
    console.log('Current user:', this.currentUser);
    console.log('Auth token:', this.authService.getToken());
    
    if (!this.currentUser) {
      this.error = 'Utilisateur non connecté';
      console.error('No user found in user trainings component');
      return;
    }
    
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.error = '';
    console.log('=== USER TRAININGS COMPONENT: LOAD SESSIONS ===');

    this.trainingSessionService.getUserTrainingSessions().subscribe({
      next: (sessions) => {
        console.log('Training sessions loaded:', sessions);
        this.trainingSessions = sessions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des sessions d\'entraînement:', error);
        console.error('Error details:', error.error);
        console.error('Error status:', error.status);
        this.error = 'Erreur lors du chargement des sessions d\'entraînement';
        this.loading = false;
      }
    });
  }

  refreshTrainings(): void {
    this.loadTrainingSessions();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
    } else {
      return `${mins}min`;
    }
  }

  viewTrainingSession(sessionId: number): void {
    // TODO: Implémenter la navigation vers la page de détail de la session
    console.log('Voir la session:', sessionId);
  }

  deleteTrainingSession(sessionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session d\'entraînement ?')) {
      this.trainingSessionService.deleteTrainingSession(sessionId).subscribe({
        next: () => {
          console.log('Session supprimée avec succès');
          this.loadTrainingSessions(); // Recharger la liste
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.error = 'Erreur lors de la suppression de la session';
        }
      });
    }
  }

  goBackToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }
} 