import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { UserTrainingProgramService, UserTrainingProgram } from '../../../../services/user-training-program.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-select-program',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './select-program.component.html',
  styleUrls: ['./select-program.component.scss']
})
export class SelectProgramComponent implements OnInit {
  
  userPrograms: UserTrainingProgram[] = [];
  selectedProgram: UserTrainingProgram | null = null;
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private userTrainingProgramService: UserTrainingProgramService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserPrograms();
  }

  loadUserPrograms(): void {
    this.loading = true;
    this.error = '';
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.error = 'Utilisateur non connecté';
      this.loading = false;
      return;
    }

    this.userTrainingProgramService.getUserPrograms(currentUser.id!).subscribe({
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
  }

  selectProgram(program: UserTrainingProgram): void {
    this.selectedProgram = program;
  }

  isProgramSelected(program: UserTrainingProgram): boolean {
    return this.selectedProgram?.id === program.id;
  }

  canProceed(): boolean {
    return this.selectedProgram !== null;
  }

  onNext(): void {
    if (this.selectedProgram) {
      this.router.navigate(['/dashboard/record/program-recap', this.selectedProgram.trainingProgram.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard/record']);
  }

  getProgramsByCategory(): { [key: string]: UserTrainingProgram[] } {
    const categories: { [key: string]: UserTrainingProgram[] } = {};
    
    this.userPrograms.forEach(program => {
      const category = program.trainingProgram.category || 'Autre';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(program);
    });
    
    return categories;
  }

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

  getProgressPercentage(program: UserTrainingProgram): number {
    if (!program.status || program.status === 'NOT_STARTED') return 0;
    if (program.status === 'COMPLETED') return 100;
    
    const totalWeeks = program.trainingProgram?.duration || 1;
    const currentWeek = program.currentWeek || 0;
    return Math.round((currentWeek / totalWeeks) * 100);
  }
} 