/**
 * Interface representing a training exercise.
 * Interface représentant un exercice d'entraînement.
 * 
 * This interface defines the structure of a training exercise containing
 * all the necessary information for exercises performed during training sessions.
 * 
 * Cette interface définit la structure d'un exercice d'entraînement contenant
 * toutes les informations nécessaires pour les exercices effectués pendant les sessions d'entraînement.
 */
export interface TrainingExercise {
  /**
   * Unique identifier for the training exercise.
   * Identifiant unique pour l'exercice d'entraînement.
   */
  id?: number;
  
  /**
   * ID of the training session this exercise belongs to.
   * ID de la session d'entraînement à laquelle cet exercice appartient.
   */
  trainingSessionId: number;
  
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
   * Number of sets performed for this exercise.
   * Nombre de séries effectuées pour cet exercice.
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
   * Weight used for this exercise in kilograms.
   * Poids utilisé pour cet exercice en kilogrammes.
   */
  weightKg?: number;
  
  /**
   * Additional notes for this exercise in the training session.
   * Notes supplémentaires pour cet exercice dans la session d'entraînement.
   */
  notes?: string;
  
  /**
   * Whether this exercise was completed in the training session.
   * Si cet exercice a été terminé dans la session d'entraînement.
   */
  isCompleted: boolean;
  
  /**
   * Order of this exercise within the training session.
   * Ordre de cet exercice dans la session d'entraînement.
   */
  orderIndex: number;
  
  /**
   * Creation timestamp of the training exercise.
   * Horodatage de création de l'exercice d'entraînement.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the training exercise.
   * Horodatage de dernière mise à jour de l'exercice d'entraînement.
   */
  updatedAt?: string;
}

/**
 * Interface representing a training session.
 * Interface représentant une session d'entraînement.
 * 
 * This interface defines the structure of a training session containing
 * all the necessary information for fitness training sessions.
 * 
 * Cette interface définit la structure d'une session d'entraînement contenant
 * toutes les informations nécessaires pour les sessions d'entraînement fitness.
 */
export interface TrainingSession {
  /**
   * Unique identifier for the training session.
   * Identifiant unique pour la session d'entraînement.
   */
  id?: number;
  
  /**
   * ID of the user who performed the training session.
   * ID de l'utilisateur qui a effectué la session d'entraînement.
   */
  userId: number;
  
  /**
   * ID of the training program this session belongs to (optional).
   * ID du programme d'entraînement auquel cette session appartient (optionnel).
   */
  trainingProgramId?: number;
  
  /**
   * Name of the training session.
   * Nom de la session d'entraînement.
   */
  name: string;
  
  /**
   * Description of the training session.
   * Description de la session d'entraînement.
   */
  description?: string;
  
  /**
   * Date and time when the training session started.
   * Date et heure de début de la session d'entraînement.
   */
  startTime: string;
  
  /**
   * Date and time when the training session ended.
   * Date et heure de fin de la session d'entraînement.
   */
  endTime?: string;
  
  /**
   * Total duration of the training session in minutes.
   * Durée totale de la session d'entraînement en minutes.
   */
  durationMinutes: number;
  
  /**
   * Whether the training session was completed.
   * Si la session d'entraînement a été terminée.
   */
  isCompleted: boolean;
  
  /**
   * Additional notes for the training session.
   * Notes supplémentaires pour la session d'entraînement.
   */
  notes?: string;
  
  /**
   * List of exercises performed during the training session.
   * Liste des exercices effectués pendant la session d'entraînement.
   */
  exercises: TrainingExercise[];
  
  /**
   * Creation timestamp of the training session.
   * Horodatage de création de la session d'entraînement.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the training session.
   * Horodatage de dernière mise à jour de la session d'entraînement.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new training session.
 * Interface pour créer une nouvelle session d'entraînement.
 * 
 * This interface defines the required data structure for creating
 * a new training session. It contains all the necessary information
 * to establish a training session in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * une nouvelle session d'entraînement. Elle contient toutes les informations
 * nécessaires pour établir une session d'entraînement dans le système.
 */
export interface CreateTrainingSessionRequest {
  /**
   * ID of the user (required).
   * ID de l'utilisateur (requis).
   */
  userId: number;
  
  /**
   * ID of the training program this session belongs to (optional).
   * ID du programme d'entraînement auquel cette session appartient (optionnel).
   */
  trainingProgramId?: number;
  
  /**
   * Name of the training session (required).
   * Nom de la session d'entraînement (requis).
   */
  name: string;
  
  /**
   * Description of the training session (optional).
   * Description de la session d'entraînement (optionnel).
   */
  description?: string;
  
  /**
   * Date and time when the training session started (required).
   * Date et heure de début de la session d'entraînement (requis).
   */
  startTime: string;
  
  /**
   * Date and time when the training session ended (optional).
   * Date et heure de fin de la session d'entraînement (optionnel).
   */
  endTime?: string;
  
  /**
   * Total duration of the training session in minutes (required).
   * Durée totale de la session d'entraînement en minutes (requis).
   */
  durationMinutes: number;
  
  /**
   * Whether the training session was completed (required).
   * Si la session d'entraînement a été terminée (requis).
   */
  isCompleted: boolean;
  
  /**
   * Additional notes for the training session (optional).
   * Notes supplémentaires pour la session d'entraînement (optionnel).
   */
  notes?: string;
  
  /**
   * List of exercises performed during the training session (required).
   * Liste des exercices effectués pendant la session d'entraînement (requis).
   */
  exercises: CreateTrainingExerciseRequest[];
}

/**
 * Interface for creating a new training exercise.
 * Interface pour créer un nouvel exercice d'entraînement.
 * 
 * This interface defines the required data structure for creating
 * a new training exercise. It contains all the necessary information
 * to establish a training exercise in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouvel exercice d'entraînement. Elle contient toutes les informations
 * nécessaires pour établir un exercice d'entraînement dans le système.
 */
export interface CreateTrainingExerciseRequest {
  /**
   * ID of the exercise (required).
   * ID de l'exercice (requis).
   */
  exerciseId: number;
  
  /**
   * Number of sets performed for this exercise (required).
   * Nombre de séries effectuées pour cet exercice (requis).
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
   * Weight used for this exercise in kilograms (optional).
   * Poids utilisé pour cet exercice en kilogrammes (optionnel).
   */
  weightKg?: number;
  
  /**
   * Additional notes for this exercise in the training session (optional).
   * Notes supplémentaires pour cet exercice dans la session d'entraînement (optionnel).
   */
  notes?: string;
  
  /**
   * Whether this exercise was completed in the training session (required).
   * Si cet exercice a été terminé dans la session d'entraînement (requis).
   */
  isCompleted: boolean;
  
  /**
   * Order of this exercise within the training session (required).
   * Ordre de cet exercice dans la session d'entraînement (requis).
   */
  orderIndex: number;
}

/**
 * Interface for updating an existing training session.
 * Interface pour mettre à jour une session d'entraînement existante.
 * 
 * This interface defines the data structure for updating a training session.
 * All properties are optional to allow partial updates of training session information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * une session d'entraînement. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations de session d'entraînement.
 */
export interface UpdateTrainingSessionRequest {
  /**
   * Name of the training session (optional for updates).
   * Nom de la session d'entraînement (optionnel pour les mises à jour).
   */
  name?: string;
  
  /**
   * Description of the training session (optional for updates).
   * Description de la session d'entraînement (optionnel pour les mises à jour).
   */
  description?: string;
  
  /**
   * Date and time when the training session ended (optional for updates).
   * Date et heure de fin de la session d'entraînement (optionnel pour les mises à jour).
   */
  endTime?: string;
  
  /**
   * Total duration of the training session in minutes (optional for updates).
   * Durée totale de la session d'entraînement en minutes (optionnel pour les mises à jour).
   */
  durationMinutes?: number;
  
  /**
   * Whether the training session was completed (optional for updates).
   * Si la session d'entraînement a été terminée (optionnel pour les mises à jour).
   */
  isCompleted?: boolean;
  
  /**
   * Additional notes for the training session (optional for updates).
   * Notes supplémentaires pour la session d'entraînement (optionnel pour les mises à jour).
   */
  notes?: string;
} 