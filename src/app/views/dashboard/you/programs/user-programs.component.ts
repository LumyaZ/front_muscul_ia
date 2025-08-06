import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { AuthService } from '../../../../services/auth.service';

/**
 * Interface pour les statuts de programme
 * Interface for program statuses
 */
interface ProgramStatus {
  IN_PROGRESS: string;
  COMPLETED: string;
  PAUSED: string;
  NOT_STARTED: string;
}

/**
 * Composant pour afficher les programmes de l'utilisateur
 * Component for displaying user programs
 */
@Component({
  selector: 'app-user-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-programs.component.html',
  styleUrls: ['./user-programs.component.scss']
})
export class UserProgramsComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private userTrainingProgramService = inject(UserTrainingProgramService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  isLoading = false;
  error: string | null = null;
  userPrograms: UserTrainingProgram[] = [];
  currentUser: any = null;
  success: string | null = null;

  readonly STATUS_CONFIG: ProgramStatus = {
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    PAUSED: 'En pause',
    NOT_STARTED: 'Non commencé'
  };

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
    
    if (!this.currentUser || !this.currentUser.id) {
      this.error = 'Erreur: Utilisateur non connecté';
      return;
    }
    
    this.loadUserPrograms();
  }

  /**
   * Charge les programmes de l'utilisateur
   * Load user programs
   */
  loadUserPrograms(): void {
    this.isLoading = true;
    this.error = null;
    this.success = null;
    
    if (!this.currentUser || !this.currentUser.id) {
      this.error = 'Erreur: Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    this.userTrainingProgramService.getUserPrograms(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (programs: UserTrainingProgram[]) => {
          this.userPrograms = programs;
          this.isLoading = false;
          if (programs.length > 0) {
            this.success = `${programs.length} programme(s) chargé(s) avec succès`;
            setTimeout(() => this.success = '', 3000);
          }
        },
        error: (err: any) => {
          this.handleError(err, 'Erreur lors du chargement des programmes');
          this.isLoading = false;
        }
      });
  }

  /**
   * Gère les erreurs de manière centralisée
   * Handle errors in a centralized way
   */
  private handleError(error: any, defaultMessage: string): void {
    console.error('Erreur:', error);
    
    if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      this.error = 'Aucun programme trouvé.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = defaultMessage;
    }
  }

  /**
   * Navigue vers la page de création de programme
   * Navigate to program creation page
   */
  createNewProgram(): void {
    this.router.navigate(['/dashboard/programs/create'], { 
      queryParams: { 
        from: 'you-programs',
        userId: this.currentUser?.id 
      } 
    });
  }

  /**
   * Navigue vers la page de tous les programmes
   * Navigate to all programs page
   */
  goToAllPrograms(): void {
    this.router.navigate(['/dashboard/programs']);
  }

  /**
   * Rafraîchit la liste des programmes
   * Refresh programs list
   */
  refreshPrograms(): void {
    this.loadUserPrograms();
  }

  /**
   * Affiche les détails d'un programme
   * View program details
   */
  viewProgramDetails(programId?: number): void {
    if (programId) {
      this.router.navigate(['/dashboard/programs', programId], {
        queryParams: { from: 'you-programs' }
      });
    }
  }

  /**
   * Se désabonne d'un programme
   * Unsubscribe from a program
   */
  unsubscribeFromProgram(programId?: number): void {
    if (!programId) return;
    
    if (confirm('Êtes-vous sûr de vouloir vous désabonner de ce programme ?')) {
      this.userTrainingProgramService.unsubscribeUserFromProgram(this.currentUser.id, programId).subscribe({
        next: () => {
          this.userPrograms = this.userPrograms.filter(p => p.trainingProgramId !== programId);
          this.success = 'Désabonnement réussi';
          setTimeout(() => this.success = '', 3000);
        },
        error: (error: any) => {
          console.error('Erreur lors du désabonnement:', error);
          this.error = 'Erreur lors du désabonnement';
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  /**
   * Obtient la couleur du statut
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return '#4CAF50';
      case 'COMPLETED':
        return '#2196F3';
      case 'PAUSED':
        return '#FF9800';
      case 'NOT_STARTED':
        return '#9E9E9E';
      default:
        return '#4CAF50';
    }
  }

  /**
   * Obtient le texte du statut
   * Get status text
   */
  getStatusText(status: string): string {
    return this.STATUS_CONFIG[status as keyof ProgramStatus] || 'En cours';
  }

  /**
   * TrackBy function pour optimiser les performances de la liste
   * TrackBy function to optimize list performance
   */
  trackByProgramId(index: number, userProgram: UserTrainingProgram): number {
    return userProgram.trainingProgramId || index;
  }
} 