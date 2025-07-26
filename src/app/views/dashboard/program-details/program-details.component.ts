import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';
import { ProgramExerciseService, ProgramExercise as ProgramExerciseData } from '../../../services/program-exercise.service';

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

interface ProgramDetails extends TrainingProgram {
  exercises: ProgramExercise[];
}

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private programExerciseService: ProgramExerciseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      if (this.programId) {
        this.loadProgramDetails();
      }
    });
  }

  loadProgramDetails(): void {
    this.loading = true;
    this.error = '';

    this.trainingProgramService.getProgramById(this.programId).subscribe({
      next: (program) => {
        this.program = program as ProgramDetails;
        // Charger les exercices du programme
        this.loadProgramExercises();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du programme';
        this.loading = false;
        console.error('Erreur chargement programme:', err);
      }
    });
  }

  loadProgramExercises(): void {
    this.programExerciseService.getExercisesByProgramId(this.programId).subscribe({
      next: (exercises) => {
        if (this.program) {
          // Convertir les données du service en format attendu par l'interface
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
          console.log('Données du programme avec exercices:', this.program);
        }
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des exercices';
        this.loading = false;
        console.error('Erreur chargement exercices:', err);
      }
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Débutant': return '#4CAF50';
      case 'Intermédiaire': return '#FF9800';
      case 'Avancé': return '#F44336';
      default: return '#757575';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Musculation': return '💪';
      case 'Cardio': return '❤️';
      case 'Flexibilité': return '🧘';
      case 'Mixte': return '⚡';
      default: return '🏋️';
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'Musculation': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'Cardio': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'Flexibilité': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'Mixte': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  }

  formatRestDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
  }

  formatExerciseDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m${remainingSeconds}s` : `${minutes}m`;
  }

  startProgram(): void {
    // TODO: Implémenter la logique pour démarrer le programme
    console.log('Démarrage du programme:', this.program?.name);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/programs']);
  }

  getTotalExercises(): number {
    return this.program?.exercises?.length || 0;
  }

  getTotalSets(): number {
    return this.program?.exercises?.reduce((total, exercise) => total + exercise.setsCount, 0) || 0;
  }

  getEstimatedTotalTime(): string {
    if (!this.program?.exercises) return '0 min';
    
    const totalTime = this.program.exercises.reduce((total, exercise) => {
      let exerciseTime = 0;
      
      if (exercise.durationSeconds) {
        exerciseTime = exercise.durationSeconds * exercise.setsCount;
      } else if (exercise.repsCount) {
        // Estimation: 2 secondes par répétition
        exerciseTime = exercise.repsCount * 2 * exercise.setsCount;
      }
      
      // Ajouter le temps de repos
      exerciseTime += exercise.restDurationSeconds * (exercise.setsCount - 1);
      
      return total + exerciseTime;
    }, 0);
    
    return this.formatDuration(Math.ceil(totalTime / 60));
  }
} 