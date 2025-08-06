import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-select-program',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './select-program.component.html',
  styleUrls: ['./select-program.component.scss']
})
export class SelectProgramComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private userTrainingProgramService = inject(UserTrainingProgramService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  userPrograms: UserTrainingProgram[] = [];
  selectedProgram: UserTrainingProgram | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadUserPrograms();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les programmes d'entraînement de l'utilisateur
   * Load user training programs
   */
  loadUserPrograms(): void {
    this.loading = true;
    this.error = null;
    
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      this.userTrainingProgramService.getUserPrograms(currentUser.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (programs) => {
            this.userPrograms = programs;
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des programmes:', error);
            this.error = 'Erreur lors du chargement des programmes';
            this.loading = false;
          }
        });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      this.error = 'Erreur lors de l\'initialisation';
      this.loading = false;
    }
  }

  /**
   * Sélectionne un programme d'entraînement
   * Select a training program
   */
  selectProgram(program: UserTrainingProgram): void {
    if (this.loading) return;
    this.selectedProgram = program;
  }

  /**
   * Vérifie si un programme est sélectionné
   * Check if a program is selected
   */
  isProgramSelected(program: UserTrainingProgram): boolean {
    return this.selectedProgram?.id === program.id;
  }

  /**
   * Vérifie si on peut procéder à l'étape suivante
   * Check if we can proceed to next step
   */
  canProceed(): boolean {
    return this.selectedProgram !== null && !this.loading;
  }

  /**
   * Navigue vers l'étape suivante
   * Navigate to next step
   */
  onNext(): void {
    if (this.loading || !this.selectedProgram) return;
    
    try {
      this.router.navigate(['/dashboard/record/training', this.selectedProgram.trainingProgramId]);
    } catch (error) {
      console.error('Erreur lors de la navigation vers l\'entraînement:', error);
      this.error = 'Erreur lors de la navigation';
    }
  }

  /**
   * Retourne à la page précédente
   * Go back to previous page
   */
  onBack(): void {
    if (this.loading) return;
    
    try {
      this.router.navigate(['/dashboard/record']);
    } catch (error) {
      console.error('Erreur lors du retour:', error);
      this.error = 'Erreur lors du retour';
    }
  }

  /**
   * Groupe les programmes par catégorie
   * Group programs by category
   */
  getProgramsByCategory(): { [key: string]: UserTrainingProgram[] } {
    const categories: { [key: string]: UserTrainingProgram[] } = {};
    
    this.userPrograms.forEach(program => {
      const category = program.trainingProgramCategory || 'Autre';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(program);
    });
    
    return categories;
  }

  /**
   * Obtient le libellé du statut
   * Get status label
   */
  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Non commencé';
    
    const statusLabels: { [key: string]: string } = {
      'NOT_STARTED': 'Non commencé',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminé',
      'PAUSED': 'En pause'
    };
    return statusLabels[status] || status;
  }

  /**
   * Calcule le pourcentage de progression
   * Calculate progress percentage
   */
  getProgressPercentage(program: UserTrainingProgram): number {
    return 0; 
  }

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
    this.loadUserPrograms();
  }
} 