import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';
import { TrainingSessionService, TrainingSession, TrainingExercise, CreateTrainingSessionRequest } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  
  programId: number | null = null;
  exercises: TrainingExercise[] = [];
  loading = false;
  error = '';
  
  // Chronomètre
  startTime: Date = new Date();
  elapsedTime: number = 0;
  timerInterval: any;
  isPaused: boolean = false;
  
  // État de l'entraînement
  currentExerciseIndex: number = 0;
  currentSetIndex: number = 0;
  isTrainingComplete: boolean = false;
  
  // Données de session
  session: TrainingSession | null = null;
  currentUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private programExerciseService: ProgramExerciseService,
    private trainingSessionService: TrainingSessionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('=== TRAINING COMPONENT: INIT ===');
    console.log('Current user:', this.currentUser);
    console.log('Auth token:', this.authService.getToken());
    
    if (!this.currentUser) {
      this.error = 'Utilisateur non connecté';
      console.error('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.programId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Program ID:', this.programId);
    
    if (this.programId) {
      this.loadExercises();
      this.startTimer();
    } else {
      this.error = 'ID de programme invalide';
      console.error('Invalid program ID');
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadExercises(): void {
    this.loading = true;
    this.error = '';

    this.programExerciseService.getExercisesByProgramId(this.programId!).subscribe({
      next: (exercises: any) => {
        this.exercises = exercises
          .sort((a: any, b: any) => a.orderInProgram - b.orderInProgram)
          .map((exercise: any) => ({
            ...exercise,
            completedSets: new Array(exercise.setsCount).fill(false)
          }));
        this.loading = false;
        this.initializeSession();
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des exercices:', error);
        this.error = 'Erreur lors du chargement des exercices';
        this.loading = false;
      }
    });
  }

  initializeSession(): void {
    this.session = {
      userId: this.currentUser.id,
      trainingProgramId: this.programId!,
      startTime: this.startTime,
      duration: 0,
      exercises: this.exercises
    };
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isPaused = true;
  }

  resumeTimer(): void {
    this.isPaused = false;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  toggleSet(exerciseIndex: number, setIndex: number): void {
    if (exerciseIndex < this.exercises.length) {
      this.exercises[exerciseIndex].completedSets[setIndex] = !this.exercises[exerciseIndex].completedSets[setIndex];
    }
  }

  isSetCompleted(exerciseIndex: number, setIndex: number): boolean {
    return this.exercises[exerciseIndex]?.completedSets[setIndex] || false;
  }

  getCompletedSetsCount(exerciseIndex: number): number {
    return this.exercises[exerciseIndex]?.completedSets.filter((completed: boolean) => completed).length || 0;
  }

  getTotalSetsCount(exerciseIndex: number): number {
    return this.exercises[exerciseIndex]?.setsCount || 0;
  }

  isExerciseComplete(exerciseIndex: number): boolean {
    const exercise = this.exercises[exerciseIndex];
    if (!exercise) return false;
    return exercise.completedSets.every((completed: boolean) => completed);
  }

  getOverallProgress(): number {
    if (this.exercises.length === 0) return 0;
    
    const totalSets = this.exercises.reduce((total, exercise) => total + exercise.setsCount, 0);
    const completedSets = this.exercises.reduce((total, exercise) => 
      total + exercise.completedSets.filter((completed: boolean) => completed).length, 0);
    
    return Math.round((completedSets / totalSets) * 100);
  }

  isTrainingFinished(): boolean {
    return this.exercises.every(exercise => 
      exercise.completedSets.every((completed: boolean) => completed)
    );
  }

  finishTraining(): void {
    if (this.session) {
      this.session.endTime = new Date();
      this.session.duration = this.elapsedTime;
      this.isTrainingComplete = true;
      
      // Sauvegarder la session
      this.saveTrainingSession();
    }
  }

  stopTraining(): void {
    if (this.session) {
      this.session.endTime = new Date();
      this.session.duration = this.elapsedTime;
      this.isTrainingComplete = false;
      
      // Sauvegarder la session
      this.saveTrainingSession();
    }
  }

  saveTrainingSession(): void {
    if (this.session && this.currentUser) {
      console.log('=== TRAINING COMPONENT: SAVE SESSION ===');
      console.log('Current user:', this.currentUser);
      console.log('Session data:', this.session);
      console.log('Elapsed time:', this.elapsedTime);
      
      // Créer la requête selon le format attendu par le backend
      const createRequest: CreateTrainingSessionRequest = {
        name: `Entraînement ${this.programId} - ${new Date().toLocaleDateString()}`,
        description: this.generateSessionDescription(),
        sessionDate: this.startTime.toISOString(),
        durationMinutes: Math.floor(this.elapsedTime / 60),
        sessionType: 'Musculation',
        trainingProgramId: this.programId!
      };

      console.log('Create request:', createRequest);

      this.trainingSessionService.createTrainingSession(createRequest).subscribe({
        next: (response) => {
          console.log('Session d\'entraînement sauvegardée:', response);
          
          // Rediriger vers la page de récapitulatif
          this.router.navigate(['/dashboard/record/training-recap'], {
            queryParams: {
              sessionId: response.id,
              duration: this.session!.duration,
              completed: this.isTrainingComplete
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde de la session:', error);
          console.error('Error details:', error.error);
          console.error('Error status:', error.status);
          this.error = 'Erreur lors de la sauvegarde de la session';
        }
      });
    } else {
      console.error('Cannot save session - missing data');
      console.error('Session:', this.session);
      console.error('Current user:', this.currentUser);
    }
  }

  private generateSessionDescription(): string {
    const completedExercises = this.exercises.filter(exercise => 
      exercise.completedSets.every(completed => completed)
    ).length;
    const totalExercises = this.exercises.length;
    const progress = Math.round((completedExercises / totalExercises) * 100);
    
    return `Session d'entraînement - ${completedExercises}/${totalExercises} exercices complétés (${progress}% de progression)`;
  }

  onBack(): void {
    // Demander confirmation avant de quitter
    if (confirm('Êtes-vous sûr de vouloir quitter l\'entraînement ? Votre progression sera sauvegardée.')) {
      this.stopTraining();
    }
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
} 