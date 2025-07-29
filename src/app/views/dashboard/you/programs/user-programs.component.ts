import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserTrainingProgramService, UserTrainingProgram } from '../../../../services/user-training-program.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-user-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-programs.component.html',
  styleUrls: ['./user-programs.component.scss']
})
export class UserProgramsComponent implements OnInit {
  private router = inject(Router);
  private userTrainingProgramService = inject(UserTrainingProgramService);
  private authService = inject(AuthService);

  isLoading = false;
  error: string | null = null;
  userPrograms: UserTrainingProgram[] = [];

  ngOnInit() {
    this.loadUserPrograms();
  }

  loadUserPrograms() {
    this.isLoading = true;
    this.error = null;
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'Erreur: Utilisateur non connecté';
      this.isLoading = false;
      return;
    }

    this.userTrainingProgramService.getUserPrograms(currentUser.id).subscribe({
      next: (programs: UserTrainingProgram[]) => {
        this.userPrograms = programs;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Erreur lors du chargement des programmes';
        this.isLoading = false;
        console.error('Erreur chargement programmes:', err);
      }
    });
  }

  createNewProgram() {
    this.router.navigate(['/dashboard/programs/create']);
  }

  goBackToProfile() {
    this.router.navigate(['/dashboard/profile']);
  }

  goToAllPrograms() {
    this.router.navigate(['/dashboard/programs']);
  }

  refreshPrograms() {
    this.loadUserPrograms();
  }

  viewProgramDetails(programId: number) {
    this.router.navigate(['/dashboard/programs', programId]);
  }

  unsubscribeFromProgram(programId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.error = 'Erreur: Utilisateur non connecté';
      return;
    }

    this.userTrainingProgramService.unsubscribeUserFromProgram(currentUser.id, programId).subscribe({
      next: () => {
        // Retirer le programme de la liste
        this.userPrograms = this.userPrograms.filter(p => p.trainingProgram.id !== programId);
      },
      error: (err: any) => {
        this.error = 'Erreur lors du désabonnement';
        console.error('Erreur désabonnement:', err);
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return '#4CAF50';
      case 'COMPLETED':
        return '#2196F3';
      case 'PAUSED':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'NOT_STARTED':
        return 'Non commencé';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminé';
      case 'PAUSED':
        return 'En pause';
      default:
        return 'Inconnu';
    }
  }
} 