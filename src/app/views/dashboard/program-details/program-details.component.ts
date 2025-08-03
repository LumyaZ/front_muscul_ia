import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';
import { ProgramExerciseService, ProgramExercise as ProgramExerciseData } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

/**
 * Interface représentant un exercice dans un programme d'entraînement
 * Interface representing an exercise within a training program
 */
interface ProgramExercise {
  id: number;
  exerciseId: number;
  orderInProgram: number;
  setsCount: number;
  repsCount?: number;
  durationSeconds?: number;
  restDurationSeconds: number;
  weightKg?: number;
  isOptional: boolean;
  exercise: { 
    id: number;
    name: string;
    description: string;
    category: string;
    muscleGroup: string;
    equipmentNeeded: string;
    difficultyLevel: string;
  };
}

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
   * Charge les exercices du programme d'entraînement
   * Load program exercises
   */
  loadProgramExercises(): void {
    this.programExerciseService.getExercisesByProgramId(this.programId).subscribe({
      next: (exercises) => {
        if (this.program) {
          this.program.exercises = exercises.map(exercise => ({
            id: exercise.id,
            exerciseId: exercise.exerciseId,
            orderInProgram: exercise.orderInProgram,
            setsCount: exercise.setsCount,
            repsCount: exercise.repsCount,
            durationSeconds: exercise.durationSeconds,
            restDurationSeconds: exercise.restDurationSeconds,
            weightKg: exercise.weightKg,
            distanceMeters: exercise.distanceMeters,
            isOptional: exercise.isOptional,
            exercise: {
              id: exercise.exerciseId,
              name: exercise.exerciseName,
              description: exercise.exerciseDescription,
              category: exercise.exerciseCategory,
              muscleGroup: exercise.exerciseMuscleGroup,
              equipmentNeeded: exercise.exerciseEquipmentNeeded,
              difficultyLevel: exercise.exerciseDifficultyLevel
            }
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
  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Musculation': return '💪';
      case 'Cardio': return '❤️';
      case 'Flexibilité': return '🧘';
      case 'Mixte': return '⚡';
      default: return '🏋️';
    }
  }

  /**
   * Obtient la couleur en fonction de la catégorie de l'exercice
   * Get color based on exercise category
   */
  getCategoryColor(category: string): string {
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
   * Formate une durée de repos en secondes en une chaîne de caractères
   * Format rest duration in seconds to a string
   */
  formatRestDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
  }

  /**
   * Formate une durée d'exercice en secondes en une chaîne de caractères
   * Format exercise duration in seconds to a string
   */
  formatExerciseDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
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
   * Obtient le temps total estimé du programme
   * Get estimated total time of the program
   */
  getEstimatedTotalTime(): string {
    if (!this.program?.exercises?.length) {
      return '0 min';
    }

    const totalMinutes = this.program.exercises.reduce((total, exercise) => {
      const exerciseTime = exercise.durationSeconds ? exercise.durationSeconds / 60 : 0;
      const restTime = exercise.restDurationSeconds ? exercise.restDurationSeconds / 60 : 0;
      const setsTime = exercise.setsCount * (exerciseTime + restTime);
      return total + setsTime;
    }, 0);

    return `${Math.round(totalMinutes)} min`;
  }

  /**
   * Ajoute le programme à l'utilisateur
   * Add program to user
   */
  addProgramToUser(): void {
    if (!this.currentUser || !this.program) {
      return;
    }

    console.log('Ajouter le programme', this.program.id, 'à l\'utilisateur', this.currentUser.id);
    alert('Programme ajouté à vos programmes !');
  }
} 