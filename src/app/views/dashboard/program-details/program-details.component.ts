import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';
import { ProgramExerciseService, ProgramExercise as ProgramExerciseData } from '../../../services/program-exercise.service';

/**
 * Interface representing an exercise within a training program.
 * Interface représentant un exercice dans un programme d'entraînement.
 * 
 * This interface defines the structure of an exercise as it appears
 * within a training program, including all exercise parameters and
 * the associated exercise details.
 * 
 * Cette interface définit la structure d'un exercice tel qu'il apparaît
 * dans un programme d'entraînement, incluant tous les paramètres d'exercice
 * et les détails de l'exercice associé.
 */
interface ProgramExercise {
  /**
   * Unique identifier for the program exercise.
   * Identifiant unique pour l'exercice du programme.
   */
  id: number;
  
  /**
   * ID of the associated exercise.
   * ID de l'exercice associé.
   */
  exerciseId: number;
  
  /**
   * Order of the exercise within the program.
   * Ordre de l'exercice dans le programme.
   */
  orderInProgram: number;
  
  /**
   * Number of sets to perform.
   * Nombre de séries à effectuer.
   */
  setsCount: number;
  
  /**
   * Number of repetitions per set (optional for time-based exercises).
   * Nombre de répétitions par série (optionnel pour les exercices basés sur le temps).
   */
  repsCount?: number;
  
  /**
   * Duration of the exercise in seconds (optional for rep-based exercises).
   * Durée de l'exercice en secondes (optionnel pour les exercices basés sur les répétitions).
   */
  durationSeconds?: number;
  
  /**
   * Rest duration between sets in seconds.
   * Durée de repos entre les séries en secondes.
   */
  restDurationSeconds: number;
  
  /**
   * Weight to use for the exercise in kilograms (optional).
   * Poids à utiliser pour l'exercice en kilogrammes (optionnel).
   */
  weightKg?: number;
  
  /**
   * Flag indicating if this exercise is optional.
   * Indicateur indiquant si cet exercice est optionnel.
   */
  isOptional: boolean;
  
  /**
   * Associated exercise details.
   * Détails de l'exercice associé.
   */
  exercise: {
    /**
     * Exercise ID.
     * ID de l'exercice.
     */
    id: number;
    
    /**
     * Exercise name.
     * Nom de l'exercice.
     */
    name: string;
    
    /**
     * Exercise description.
     * Description de l'exercice.
     */
    description: string;
    
    /**
     * Exercise category.
     * Catégorie de l'exercice.
     */
    category: string;
    
    /**
     * Target muscle group.
     * Groupe musculaire ciblé.
     */
    muscleGroup: string;
    
    /**
     * Equipment needed for the exercise.
     * Équipement nécessaire pour l'exercice.
     */
    equipmentNeeded: string;
    
    /**
     * Difficulty level of the exercise.
     * Niveau de difficulté de l'exercice.
     */
    difficultyLevel: string;
  };
}

/**
 * Interface extending TrainingProgram with exercises list.
 * Interface étendant TrainingProgram avec la liste des exercices.
 * 
 * This interface combines the training program information with
 * the list of exercises that make up the program.
 * 
 * Cette interface combine les informations du programme d'entraînement
 * avec la liste des exercices qui composent le programme.
 */
interface ProgramDetails extends TrainingProgram {
  /**
   * List of exercises in the training program.
   * Liste des exercices dans le programme d'entraînement.
   */
  exercises: ProgramExercise[];
}

/**
 * Component for displaying detailed information about a training program.
 * Composant pour afficher les informations détaillées d'un programme d'entraînement.
 * 
 * This component shows comprehensive information about a training program including
 * program details, exercise list, difficulty levels, categories, and provides
 * functionality to start the program. It handles loading program data and exercises,
 * formatting display information, and navigation.
 * 
 * Ce composant affiche des informations complètes sur un programme d'entraînement
 * incluant les détails du programme, la liste des exercices, les niveaux de difficulté,
 * les catégories et fournit la fonctionnalité pour démarrer le programme. Il gère
 * le chargement des données du programme et des exercices, le formatage des informations
 * d'affichage et la navigation.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-program-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  
  /**
   * Current training program with exercises.
   * Programme d'entraînement actuel avec exercices.
   */
  program: ProgramDetails | null = null;
  
  /**
   * Loading state indicator.
   * Indicateur d'état de chargement.
   */
  loading = false;
  
  /**
   * Error message to display if loading fails.
   * Message d'erreur à afficher si le chargement échoue.
   */
  error = '';
  
  /**
   * ID of the current program being displayed.
   * ID du programme actuel affiché.
   */
  programId: number = 0;

  /**
   * Constructor for ProgramDetailsComponent.
   * Constructeur pour ProgramDetailsComponent.
   * 
   * @param route - Angular activated route service
   * @param router - Angular router service
   * @param trainingProgramService - Service for training program operations
   * @param programExerciseService - Service for program exercise operations
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private programExerciseService: ProgramExerciseService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   * 
   * This method subscribes to route parameters and loads program details
   * when the component initializes.
   * 
   * Cette méthode s'abonne aux paramètres de route et charge les détails
   * du programme quand le composant s'initialise.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      if (this.programId) {
        this.loadProgramDetails();
      }
    });
  }

  /**
   * Loads the training program details from the service.
   * Charge les détails du programme d'entraînement depuis le service.
   * 
   * This method fetches the program information and then loads
   * the associated exercises.
   * 
   * Cette méthode récupère les informations du programme puis charge
   * les exercices associés.
   */
  loadProgramDetails(): void {
    this.loading = true;
    this.error = '';

    this.trainingProgramService.getProgramById(this.programId).subscribe({
      next: (program) => {
        this.program = program as ProgramDetails;
        // Load program exercises
        this.loadProgramExercises();
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du programme';
        this.loading = false;
        console.error('Erreur chargement programme:', err);
      }
    });
  }

  /**
   * Loads the exercises associated with the current program.
   * Charge les exercices associés au programme actuel.
   * 
   * This method fetches the exercise list for the program and maps
   * the service data to the component's expected format.
   * 
   * Cette méthode récupère la liste des exercices pour le programme
   * et mappe les données du service au format attendu par le composant.
   */
  loadProgramExercises(): void {
    this.programExerciseService.getExercisesByProgramId(this.programId).subscribe({
      next: (exercises) => {
        if (this.program) {
          // Convert service data to expected interface format
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

  /**
   * Gets the color based on the difficulty level.
   * Obtient la couleur en fonction du niveau de difficulté.
   * 
   * @param difficulty - Difficulty level string
   * @returns Color string
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
   * Gets the icon based on the exercise category.
   * Obtient l'icône en fonction de la catégorie de l'exercice.
   * 
   * @param category - Exercise category string
   * @returns Icon string
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
   * Gets the color based on the exercise category.
   * Obtient la couleur en fonction de la catégorie de l'exercice.
   * 
   * @param category - Exercise category string
   * @returns Color string
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
   * Formats a duration in minutes to a string (e.g., "X min", "XhY min", "Xh").
   * Formate une durée en minutes en une chaîne de caractères (e.g., "X min", "XhY min", "Xh").
   * 
   * @param minutes - Duration in minutes
   * @returns Formatted duration string
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
   * Formats a rest duration in seconds to a string (e.g., "Xs", "XmYs").
   * Formate une durée de repos en secondes en une chaîne de caractères (e.g., "Xs", "XmYs").
   * 
   * @param seconds - Duration in seconds
   * @returns Formatted rest duration string
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
   * Formats an exercise duration in seconds to a string (e.g., "Xs", "XmYs").
   * Formate une durée d'exercice en secondes en une chaîne de caractères (e.g., "Xs", "XmYs").
   * 
   * @param seconds - Duration in seconds
   * @returns Formatted exercise duration string
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
   * Starts the training program.
   * Démarre le programme d'entraînement.
   * 
   * TODO: Implement the logic to start the program
   * TODO: Implémenter la logique pour démarrer le programme
   */
  startProgram(): void {
    // TODO: Implémenter la logique pour démarrer le programme
    console.log('Démarrage du programme:', this.program?.name);
  }

  /**
   * Navigates back to the programs list.
   * Navigue vers la liste des programmes.
   */
  goBack(): void {
    this.router.navigate(['/dashboard/programs']);
  }

  /**
   * Navigates to the add exercise to program page.
   * Navigue vers la page d'ajout d'exercice au programme.
   * 
   * This method navigates to a page where users can add new exercises
   * to the current training program.
   * 
   * Cette méthode navigue vers une page où les utilisateurs peuvent
   * ajouter de nouveaux exercices au programme d'entraînement actuel.
   */
  addExerciseToProgram(): void {
    this.router.navigate(['/dashboard/programs', this.programId, 'add-exercise']);
  }

  /**
   * Gets the total number of exercises in the program.
   * Obtient le nombre total d'exercices dans le programme.
   * 
   * @returns Total number of exercises
   */
  getTotalExercises(): number {
    return this.program?.exercises?.length || 0;
  }

  /**
   * Gets the total number of sets across all exercises in the program.
   * Obtient le nombre total de séries dans tous les exercices du programme.
   * 
   * @returns Total number of sets
   */
  getTotalSets(): number {
    return this.program?.exercises?.reduce((total, exercise) => total + exercise.setsCount, 0) || 0;
  }

  /**
   * Estimates the total time for the entire program.
   * Estime le temps total pour l'ensemble du programme.
   * 
   * @returns Estimated total time string
   */
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