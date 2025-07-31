import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';

interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  difficultyLevel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  category: string;
  targetAudience: string;
  equipmentRequired: string;
  isPublic: boolean;
  isActive: boolean;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

interface ProgramExercise {
  id: number;
  trainingProgramId: number;
  exerciseId: number;
  exerciseName: string;
  exerciseDescription: string;
  exerciseCategory: string;
  exerciseMuscleGroup: string;
  exerciseEquipmentNeeded: string;
  exerciseDifficultyLevel: string;
  orderInProgram: number;
  setsCount: number;
  repsCount: number;
  durationSeconds: number;
  restDurationSeconds: number;
  weightKg: number;
  distanceMeters: number;
  notes: string;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-program-recap',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './program-recap.component.html',
  styleUrls: ['./program-recap.component.scss']
})
export class ProgramRecapComponent implements OnInit {
  
  program: TrainingProgram | null = null;
  exercises: ProgramExercise[] = [];
  loading = false;
  error = '';
  programId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private programExerciseService: ProgramExerciseService
  ) {}

  ngOnInit(): void {
    this.programId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.programId) {
      this.loadProgramDetails();
    } else {
      this.error = 'ID de programme invalide';
    }
  }

  loadProgramDetails(): void {
    this.loading = true;
    this.error = '';

    // Charger les détails du programme
    this.trainingProgramService.getProgramById(this.programId!).subscribe({
      next: (program: any) => {
        this.program = program;
        this.loadProgramExercises();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du programme:', error);
        this.error = 'Erreur lors du chargement du programme';
        this.loading = false;
      }
    });
  }

  loadProgramExercises(): void {
    this.programExerciseService.getExercisesByProgramId(this.programId!).subscribe({
      next: (exercises: any) => {
        this.exercises = exercises.sort((a: any, b: any) => a.orderInProgram - b.orderInProgram);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des exercices:', error);
        this.error = 'Erreur lors du chargement des exercices';
        this.loading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/dashboard/record/select-program']);
  }

  onStartTraining(): void {
    if (this.programId) {
      this.router.navigate(['/dashboard/record/training', this.programId]);
    }
  }

  getDifficultyLabel(difficulty: string): string {
    const difficultyLabels: { [key: string]: string } = {
      'BEGINNER': 'Débutant',
      'INTERMEDIATE': 'Intermédiaire',
      'ADVANCED': 'Avancé'
    };
    return difficultyLabels[difficulty] || difficulty;
  }

  getDifficultyColor(difficulty: string): string {
    const difficultyColors: { [key: string]: string } = {
      'BEGINNER': '#4CAF50',
      'INTERMEDIATE': '#FF9800',
      'ADVANCED': '#F44336'
    };
    return difficultyColors[difficulty] || '#666';
  }

  getMuscleGroupColor(muscleGroup: string): string {
    const muscleGroupColors: { [key: string]: string } = {
      'CHEST': '#FF5722',
      'BACK': '#2196F3',
      'SHOULDERS': '#9C27B0',
      'BICEPS': '#FF9800',
      'TRICEPS': '#795548',
      'LEGS': '#4CAF50',
      'ABS': '#00BCD4',
      'CARDIO': '#E91E63'
    };
    return muscleGroupColors[muscleGroup] || '#666';
  }

  getEquipmentIcon(equipment: string): string {
    const equipmentIcons: { [key: string]: string } = {
      'DUMBBELLS': 'fas fa-dumbbell',
      'BARBELL': 'fas fa-weight-hanging',
      'MACHINE': 'fas fa-cogs',
      'BODYWEIGHT': 'fas fa-user',
      'CABLE': 'fas fa-link',
      'KETTLEBELL': 'fas fa-circle',
      'RESISTANCE_BAND': 'fas fa-ring'
    };
    return equipmentIcons[equipment] || 'fas fa-dumbbell';
  }

  getEquipmentLabel(equipment: string): string {
    const equipmentLabels: { [key: string]: string } = {
      'DUMBBELLS': 'Haltères',
      'BARBELL': 'Barre',
      'MACHINE': 'Machine',
      'BODYWEIGHT': 'Poids du corps',
      'CABLE': 'Poulie',
      'KETTLEBELL': 'Kettlebell',
      'RESISTANCE_BAND': 'Élastique'
    };
    return equipmentLabels[equipment] || equipment;
  }

  getTotalSets(): number {
    return this.exercises.reduce((total, exercise) => total + exercise.setsCount, 0);
  }

  getEstimatedDuration(): number {
    // Estimation basée sur le nombre d'exercices et la durée moyenne par exercice
    const averageTimePerExercise = 5; // minutes par exercice
    const totalRestTime = this.exercises.reduce((total, exercise) => 
      total + (exercise.restDurationSeconds * (exercise.setsCount - 1)), 0) / 60; // conversion en minutes
    
    return Math.round(this.exercises.length * averageTimePerExercise + totalRestTime);
  }
} 