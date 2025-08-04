/**
 * Interface representing an exercise within a training program.
 * Interface représentant un exercice dans un programme d'entraînement.
 * 
 * This interface defines the structure of a program exercise containing
 * all the necessary information for exercises within training programs.
 * 
 * Cette interface définit la structure d'un exercice de programme contenant
 * toutes les informations nécessaires pour les exercices dans les programmes d'entraînement.
 */
export interface ProgramExercise {
  /**
   * Unique identifier for the program exercise.
   * Identifiant unique pour l'exercice de programme.
   */
  id?: number;
  
  /**
   * ID of the training program this exercise belongs to.
   * ID du programme d'entraînement auquel cet exercice appartient.
   */
  trainingProgramId: number;
  
  /**
   * ID of the exercise.
   * ID de l'exercice.
   */
  exerciseId: number;
  
  /**
   * Name of the exercise.
   * Nom de l'exercice.
   */
  exerciseName: string;
  
  /**
   * Description of the exercise.
   * Description de l'exercice.
   */
  exerciseDescription: string;
  
  /**
   * Muscle group targeted by the exercise.
   * Groupe musculaire ciblé par l'exercice.
   */
  exerciseMuscleGroup: string;
  
  /**
   * Number of sets for this exercise in the program.
   * Nombre de séries pour cet exercice dans le programme.
   */
  setsCount: number;
  
  /**
   * Number of repetitions per set for this exercise.
   * Nombre de répétitions par série pour cet exercice.
   */
  repsCount: number;
  
  /**
   * Duration of the exercise in seconds (for time-based exercises).
   * Durée de l'exercice en secondes (pour les exercices basés sur le temps).
   */
  durationSeconds: number;
  
  /**
   * Rest duration between sets in seconds.
   * Durée de repos entre les séries en secondes.
   */
  restDurationSeconds: number;
  
  /**
   * Weight to use for this exercise in kilograms (optional).
   * Poids à utiliser pour cet exercice en kilogrammes (optionnel).
   */
  weightKg?: number;
  
  /**
   * Additional notes for this exercise in the program.
   * Notes supplémentaires pour cet exercice dans le programme.
   */
  notes?: string;
  
  /**
   * Whether this exercise is optional in the program.
   * Si cet exercice est optionnel dans le programme.
   */
  isOptional: boolean;
  
  /**
   * Order of this exercise within the program.
   * Ordre de cet exercice dans le programme.
   */
  orderIndex: number;
  
  /**
   * Creation timestamp of the program exercise.
   * Horodatage de création de l'exercice de programme.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the program exercise.
   * Horodatage de dernière mise à jour de l'exercice de programme.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new program exercise.
 * Interface pour créer un nouvel exercice de programme.
 * 
 * This interface defines the required data structure for creating
 * a new program exercise. It contains all the necessary information
 * to establish a program exercise in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouvel exercice de programme. Elle contient toutes les informations
 * nécessaires pour établir un exercice de programme dans le système.
 */
export interface CreateProgramExerciseRequest {
  /**
   * ID of the training program (required).
   * ID du programme d'entraînement (requis).
   */
  trainingProgramId: number;
  
  /**
   * ID of the exercise (required).
   * ID de l'exercice (requis).
   */
  exerciseId: number;
  
  /**
   * Number of sets for this exercise in the program (required).
   * Nombre de séries pour cet exercice dans le programme (requis).
   */
  setsCount: number;
  
  /**
   * Number of repetitions per set for this exercise (required).
   * Nombre de répétitions par série pour cet exercice (requis).
   */
  repsCount: number;
  
  /**
   * Duration of the exercise in seconds (required).
   * Durée de l'exercice en secondes (requis).
   */
  durationSeconds: number;
  
  /**
   * Rest duration between sets in seconds (required).
   * Durée de repos entre les séries en secondes (requis).
   */
  restDurationSeconds: number;
  
  /**
   * Weight to use for this exercise in kilograms (optional).
   * Poids à utiliser pour cet exercice en kilogrammes (optionnel).
   */
  weightKg?: number;
  
  /**
   * Additional notes for this exercise in the program (optional).
   * Notes supplémentaires pour cet exercice dans le programme (optionnel).
   */
  notes?: string;
  
  /**
   * Whether this exercise is optional in the program (required).
   * Si cet exercice est optionnel dans le programme (requis).
   */
  isOptional: boolean;
  
  /**
   * Order of this exercise within the program (required).
   * Ordre de cet exercice dans le programme (requis).
   */
  orderIndex: number;
}

/**
 * Interface for updating an existing program exercise.
 * Interface pour mettre à jour un exercice de programme existant.
 * 
 * This interface defines the data structure for updating a program exercise.
 * All properties are optional to allow partial updates of program exercise information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * un exercice de programme. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations d'exercice de programme.
 */
export interface UpdateProgramExerciseRequest {
  /**
   * Number of sets for this exercise in the program (optional for updates).
   * Nombre de séries pour cet exercice dans le programme (optionnel pour les mises à jour).
   */
  setsCount?: number;
  
  /**
   * Number of repetitions per set for this exercise (optional for updates).
   * Nombre de répétitions par série pour cet exercice (optionnel pour les mises à jour).
   */
  repsCount?: number;
  
  /**
   * Duration of the exercise in seconds (optional for updates).
   * Durée de l'exercice en secondes (optionnel pour les mises à jour).
   */
  durationSeconds?: number;
  
  /**
   * Rest duration between sets in seconds (optional for updates).
   * Durée de repos entre les séries en secondes (optionnel pour les mises à jour).
   */
  restDurationSeconds?: number;
  
  /**
   * Weight to use for this exercise in kilograms (optional for updates).
   * Poids à utiliser pour cet exercice en kilogrammes (optionnel pour les mises à jour).
   */
  weightKg?: number;
  
  /**
   * Additional notes for this exercise in the program (optional for updates).
   * Notes supplémentaires pour cet exercice dans le programme (optionnel pour les mises à jour).
   */
  notes?: string;
  
  /**
   * Whether this exercise is optional in the program (optional for updates).
   * Si cet exercice est optionnel dans le programme (optionnel pour les mises à jour).
   */
  isOptional?: boolean;
  
  /**
   * Order of this exercise within the program (optional for updates).
   * Ordre de cet exercice dans le programme (optionnel pour les mises à jour).
   */
  orderIndex?: number;
} 