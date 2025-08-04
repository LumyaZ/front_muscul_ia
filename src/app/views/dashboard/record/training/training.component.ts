import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../../services/training-program.service';
import { ProgramExerciseService } from '../../../../services/program-exercise.service';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { TrainingSession, TrainingExercise, CreateTrainingSessionRequest } from '../../../../models/training-session.model';
import { AuthService } from '../../../../services/auth.service';

/**
 * Interface étendant TrainingExercise avec les propriétés nécessaires pour l'entraînement
 * Interface extending TrainingExercise with properties needed for training
 */
interface TrainingExerciseExtended extends TrainingExercise {
  completedSets: boolean[];
}

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trainingProgramService = inject(TrainingProgramService);
  private programExerciseService = inject(ProgramExerciseService);
  private trainingSessionService = inject(TrainingSessionService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  programId: number | null = null;
  exercises: TrainingExerciseExtended[] = [];
  loading = false;
  error: string | null = null;
  
  startTime: Date = new Date();
  elapsedTime: number = 0;
  timerInterval: any;
  isPaused: boolean = false;
  
  currentExerciseIndex: number = 0;
  currentSetIndex: number = 0;
  isTrainingComplete: boolean = false;
  
  session: TrainingSession | null = null;
  currentUser: any = null;

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et vérifie l'authentification
   * Initialize component and check authentication
   */
  private initializeComponent(): void {
    try {
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      this.programId = Number(this.route.snapshot.paramMap.get('id'));
      
      if (!this.programId) {
        this.error = 'ID de programme invalide';
        return;
      }

      this.loadExercises();
      this.startTimer();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du composant training:', error);
      this.error = 'Erreur lors de l\'initialisation';
    }
  }

  /**
   * Charge les exercices du programme
   * Load program exercises
   */
  loadExercises(): void {
    this.loading = true;
    this.error = null;

    try {
      this.programExerciseService.getExercisesByProgramId(this.programId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
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
    } catch (error) {
      console.error('Erreur lors du chargement des exercices:', error);
      this.error = 'Erreur lors du chargement des exercices';
      this.loading = false;
    }
  }

  /**
   * Initialise la session d'entraînement
   * Initialize training session
   */
  private initializeSession(): void {
    this.session = {
      userId: this.currentUser.id,
      trainingProgramId: this.programId!,
      name: 'Session d\'entraînement',
      startTime: this.startTime.toISOString(),
      durationMinutes: 0,
      isCompleted: false,
      exercises: this.exercises
    };
  }

  /**
   * Démarre le chronomètre
   * Start timer
   */
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused) {
        this.elapsedTime = Math.floor((new Date().getTime() - this.startTime.getTime()) / 1000);
      }
    }, 1000);
  }

  /**
   * Met en pause le chronomètre
   * Pause timer
   */
  pauseTimer(): void {
    if (this.loading) return;
    this.isPaused = true;
  }

  /**
   * Reprend le chronomètre
   * Resume timer
   */
  resumeTimer(): void {
    if (this.loading) return;
    this.isPaused = false;
  }

  /**
   * Formate le temps en HH:MM:SS
   * Format time as HH:MM:SS
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Bascule l'état d'une série
   * Toggle set completion
   */
  toggleSet(exerciseIndex: number, setIndex: number): void {
    if (this.loading) return;
    
    if (exerciseIndex < this.exercises.length) {
      this.exercises[exerciseIndex].completedSets[setIndex] = !this.exercises[exerciseIndex].completedSets[setIndex];
    }
  }

  /**
   * Vérifie si une série est terminée
   * Check if set is completed
   */
  isSetCompleted(exerciseIndex: number, setIndex: number): boolean {
    return this.exercises[exerciseIndex]?.completedSets[setIndex] || false;
  }

  /**
   * Obtient le nombre de séries terminées
   * Get completed sets count
   */
  getCompletedSetsCount(exerciseIndex: number): number {
    return this.exercises[exerciseIndex]?.completedSets.filter((completed: boolean) => completed).length || 0;
  }

  /**
   * Obtient le nombre total de séries
   * Get total sets count
   */
  getTotalSetsCount(exerciseIndex: number): number {
    return this.exercises[exerciseIndex]?.setsCount || 0;
  }

  /**
   * Vérifie si un exercice est terminé
   * Check if exercise is complete
   */
  isExerciseComplete(exerciseIndex: number): boolean {
    const exercise = this.exercises[exerciseIndex];
    if (!exercise) return false;
    return exercise.completedSets.every((completed: boolean) => completed);
  }

  /**
   * Calcule la progression globale
   * Calculate overall progress
   */
  getOverallProgress(): number {
    if (this.exercises.length === 0) return 0;
    
    const totalSets = this.exercises.reduce((total, exercise) => total + exercise.setsCount, 0);
    const completedSets = this.exercises.reduce((total, exercise) => 
      total + exercise.completedSets.filter((completed: boolean) => completed).length, 0);
    
    return Math.round((completedSets / totalSets) * 100);
  }

  /**
   * Vérifie si l'entraînement est terminé
   * Check if training is finished
   */
  isTrainingFinished(): boolean {
    return this.exercises.every(exercise => 
      exercise.completedSets.every((completed: boolean) => completed)
    );
  }

  /**
   * Termine l'entraînement
   * Finish training
   */
  finishTraining(): void {
    if (this.loading) return;
    
    try {
      if (this.session) {
        this.session.endTime = new Date().toISOString();
        this.session.durationMinutes = Math.floor(this.elapsedTime / 60);
        this.session.isCompleted = true;
        this.isTrainingComplete = true;
        
        this.saveTrainingSession();
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'entraînement:', error);
      this.error = 'Erreur lors de la finalisation de l\'entraînement';
    }
  }

  /**
   * Arrête l'entraînement
   * Stop training
   */
  stopTraining(): void {
    if (this.loading) return;
    
    try {
      if (this.session) {
        this.session.endTime = new Date().toISOString();
        this.session.durationMinutes = Math.floor(this.elapsedTime / 60);
        this.session.isCompleted = false;
        this.isTrainingComplete = false;
        
        this.saveTrainingSession();
      }
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de l\'entraînement:', error);
      this.error = 'Erreur lors de l\'arrêt de l\'entraînement';
    }
  }

  /**
   * Sauvegarde la session d'entraînement
   * Save training session
   */
  private saveTrainingSession(): void {
    if (!this.session || !this.currentUser) {
      console.error('Cannot save session - missing data');
      console.error('Session:', this.session);
      console.error('Current user:', this.currentUser);
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token found');
      this.error = 'Erreur d\'authentification. Veuillez vous reconnecter.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    try {
      const createRequest: CreateTrainingSessionRequest = {
        userId: this.currentUser.id,
        name: `Entraînement ${this.programId} - ${new Date().toLocaleDateString()}`,
        description: this.generateSessionDescription(),
        startTime: this.startTime.toISOString(),
        durationMinutes: Math.floor(this.elapsedTime / 60),
        isCompleted: this.isTrainingComplete,
        exercises: []
      };

      this.trainingSessionService.createTrainingSession(createRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            
            this.router.navigate(['/dashboard/record/training-recap'], {
              queryParams: {
                sessionId: response.id,
                duration: this.session!.durationMinutes,
                completed: this.isTrainingComplete
              }
            });
          },
          error: (error) => {
            console.error('Erreur lors de la sauvegarde de la session:', error);
            console.error('Error details:', error.error);
            console.error('Error status:', error.status);
            
            if (error.status === 403) {
              this.error = 'Erreur d\'autorisation. Veuillez vous reconnecter.';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            } else if (error.status === 401) {
              this.error = 'Session expirée. Veuillez vous reconnecter.';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.error = 'Erreur lors de la sauvegarde de la session';
            }
          }
        });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
      this.error = 'Erreur lors de la sauvegarde de la session';
    }
  }

  /**
   * Génère la description de la session
   * Generate session description
   */
  private generateSessionDescription(): string {
    const completedExercises = this.exercises.filter(exercise => 
      exercise.completedSets.every(completed => completed)
    ).length;
    const totalExercises = this.exercises.length;
    const progress = Math.round((completedExercises / totalExercises) * 100);
    
    return `Session d'entraînement - ${completedExercises}/${totalExercises} exercices complétés (${progress}% de progression)`;
  }

  /**
   * Retourne à la page précédente
   * Go back to previous page
   */
  onBack(): void {
    if (this.loading) return;
    
    try {
      if (confirm('Êtes-vous sûr de vouloir quitter l\'entraînement ? Votre progression sera sauvegardée.')) {
        this.stopTraining();
      }
    } catch (error) {
      console.error('Erreur lors du retour:', error);
      this.error = 'Erreur lors du retour';
    }
  }

  /**
   * Obtient la couleur du groupe musculaire
   * Get muscle group color
   */
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

  /**
   * Obtient l'icône de l'équipement
   * Get equipment icon
   */
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

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
    this.loadExercises();
  }
} 