import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingSessionService, TrainingSessionDto } from '../../../services/training-session.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.scss']
})
export class TrainingsComponent implements OnInit {
  
  trainingSessions: TrainingSessionDto[] = [];
  loading = false;
  error = '';
  currentUser: any = null;

  constructor(
    private trainingSessionService: TrainingSessionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('=== TRAININGS COMPONENT: INIT ===');
    console.log('Current user:', this.currentUser);
    console.log('Auth token:', this.authService.getToken());
    
    // Test pour vérifier le localStorage
    this.checkLocalStorage();
    
    if (!this.currentUser) {
      this.error = 'Utilisateur non connecté';
      console.error('No user found in trainings component');
      return;
    }
    
    this.loadTrainingSessions();
  }

  private checkLocalStorage(): void {
    console.log('=== LOCAL STORAGE CHECK ===');
    console.log('auth_token:', localStorage.getItem('auth_token'));
    console.log('current_user:', localStorage.getItem('current_user'));
    console.log('Is authenticated:', this.authService.isAuthenticated());
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.error = '';
    console.log('=== TRAININGS COMPONENT: LOAD SESSIONS ===');

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
} 