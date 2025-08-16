import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { TrainingProgram } from '../../../models/training-program.model';
import { ProgramExercise } from '../../../models/program-exercise.model';

/**
 * Interface étendant TrainingProgram avec la liste des exercices
 * Interface extending TrainingProgram with exercises list
 */
interface ProgramDetails extends TrainingProgram {
  exercises: ProgramExercise[];
}

/**
 * Composant pour afficher les détails d'un programme d'entraînement
 * Component for displaying training program details
 */
@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  
  program: ProgramDetails | null = null;
  loading = false;
  error = '';
  programId: number = 0;
  currentUser: User | null = null;
  fromYouPrograms: boolean = false;
  isProgramCreator: boolean = false;
  canModifyProgram: boolean = false;
  canAddProgram: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private programExerciseService: ProgramExerciseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkProvenance();
    this.programId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.programId) {
      this.loadProgramDetails();
    } else {
      this.error = 'ID de programme invalide';
    }
  }

  /**
   * Charge les détails du programme d'entraînement
   * Load training program details
   */
  loadProgramDetails(): void {
    this.loading = true;
    this.error = '';

    this.trainingProgramService.getProgramById(this.programId).subscribe({
      next: (program: any) => {
        this.program = { ...program, exercises: [] };
        this.updateModificationPermissions();
        this.loading = false;
        
        this.loadProgramExercises();
      },
      error: (err) => {
        this.handleError(err, 'Erreur lors du chargement du programme');
        this.loading = false;
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
      this.error = 'Programme non trouvé.';
    } else {
      this.error = defaultMessage;
    }
  }

  /**
   * Charge les exercices du programme
   * Load program exercises
   */
  loadProgramExercises(): void {
    this.programExerciseService.getExercisesByProgramId(this.programId).subscribe({
      next: (exercises) => {
        if (this.program) {
          this.program.exercises = exercises.map(exercise => ({
            id: exercise.id || 0,
            trainingProgramId: this.programId,
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            exerciseDescription: exercise.exerciseDescription,
            exerciseMuscleGroup: exercise.exerciseMuscleGroup,
            setsCount: exercise.setsCount || 0,
            repsCount: exercise.repsCount,
            restDurationSeconds: exercise.restDurationSeconds,
            weightKg: exercise.weightKg,
            notes: exercise.notes
          }));
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des exercices';
        this.loading = false;
        console.error('Erreur chargement exercices:', err);
      }
    });
  }

  /**
   * Charge les données de l'utilisateur authentifié actuel
   * Load current authenticated user data
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Vérifie la provenance de l'utilisateur (de quelle page il vient)
   * Check the provenance of the user (from which page they came)
   */
  private checkProvenance(): void {
    this.route.queryParams.subscribe(params => {
      this.fromYouPrograms = params['from'] === 'you-programs';
      this.canAddProgram = !this.fromYouPrograms;
      this.updateModificationPermissions();
    });
  }

  /**
   * Met à jour les permissions de modification selon la provenance et le rôle utilisateur
   * Update modification permissions based on provenance and user role
   */
  private updateModificationPermissions(): void {
    if (this.program && this.currentUser) {
      this.isProgramCreator = this.program.createdByUserId === this.currentUser.id;
      this.canModifyProgram = this.fromYouPrograms && this.isProgramCreator;
    }
  }

  /**
   * Obtient la couleur en fonction du niveau de difficulté
   * Get color based on difficulty level
   */
  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Débutant': return '#4CAF50';
      case 'Intermédiaire': return '#FF9800';
      case 'Avancé': return '#F44336';
      default: return '#757575';
    }
  }

  /**
   * Obtient l'icône en fonction de la catégorie de l'exercice
   * Get icon based on exercise category
   */
  getCategoryIcon(category?: string): string {
    if (!category) return '🏋️';
    
    switch (category) {
      case 'Musculation': return '💪';
      case 'Cardio': return '❤️';
      case 'Flexibilité': return '🧘';
      case 'Mixte': return '';
      default: return '🏋️';
    }
  }

  /**
   * Obtient la couleur en fonction de la catégorie de l'exercice
   * Get color based on exercise category
   */
  getCategoryColor(category?: string): string {
    if (!category) return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    switch (category) {
      case 'Musculation': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Cardio': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Flexibilité': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Mixte': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  /**
   * Formate une durée en minutes en une chaîne de caractères
   * Format duration in minutes to a string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  }

  /**
   * Formate la durée de repos
   * Format rest duration
   */
  formatRestDuration(seconds?: number): string {
    if (!seconds) return '0s';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  /**
   * Navigue vers la page appropriée selon la provenance
   * Navigate back to the appropriate page based on provenance
   */
  goBack(): void {
    if (this.fromYouPrograms) {
      this.router.navigate(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
    } else {
      this.router.navigate(['/dashboard/programs']);
    }
  }

  /**
   * Navigue vers la page d'ajout d'exercice au programme
   * Navigate to add exercise to program page
   */
  addExerciseToProgram(): void {
    if (!this.canModifyProgram) {
      this.error = 'Vous ne pouvez modifier ce programme que depuis vos programmes personnels.';
      return;
    }

    this.router.navigate(['/dashboard/programs', this.programId, 'add-exercise'], {
      queryParams: {
        from: this.fromYouPrograms ? 'you-programs' : undefined,
        userId: this.currentUser?.id
      }
    });
  }

  /**
   * Obtient le nombre total d'exercices dans le programme
   * Get total number of exercises in the program
   */
  getTotalExercises(): number {
    const total = this.program?.exercises?.length || 0;
    return total;
  }

  /**
   * Obtient le nombre total de séries dans le programme
   * Get total number of sets in the program
   */
  getTotalSets(): number {
    const total = this.program?.exercises?.reduce((sum, exercise) => sum + exercise.setsCount, 0) || 0;
    return total;
  }

  /**
   * Calcule le temps total estimé
   * Calculate estimated total time
   */
  getEstimatedTotalTime(): string {
    if (!this.program?.exercises) return '0 min';

    let totalMinutes = 0;
    this.program.exercises.forEach(exercise => {

      const restTime = exercise.restDurationSeconds ? exercise.restDurationSeconds / 60 : 0;
      const setsTime = (exercise.setsCount || 0) * restTime;
      totalMinutes += setsTime;
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }

  /**
   * Ajoute le programme à l'utilisateur
   * Add program to user
   */
  addProgramToUser(): void {
    if (!this.currentUser || !this.program) {
      return;
    }
    alert('Programme ajouté à vos programmes !');
  }
} 