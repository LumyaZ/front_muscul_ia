/**
 * Interface representing a user's training program assignment.
 * Interface représentant l'assignation d'un programme d'entraînement à un utilisateur.
 * 
 * This interface defines the structure of a user training program containing
 * all the necessary information for user-program relationships.
 * 
 * Cette interface définit la structure d'un programme d'entraînement utilisateur contenant
 * toutes les informations nécessaires pour les relations utilisateur-programme.
 */
export interface UserTrainingProgram {
  /**
   * Unique identifier for the user training program.
   * Identifiant unique pour le programme d'entraînement utilisateur.
   */
  id?: number;
  
  /**
   * ID of the user.
   * ID de l'utilisateur.
   */
  userId: number;
  
  /**
   * ID of the training program.
   * ID du programme d'entraînement.
   */
  trainingProgramId: number;
  
  /**
   * Name of the training program.
   * Nom du programme d'entraînement.
   */
  trainingProgramName: string;
  
  /**
   * Description of the training program.
   * Description du programme d'entraînement.
   */
  trainingProgramDescription: string;
  
  /**
   * Category of the training program.
   * Catégorie du programme d'entraînement.
   */
  trainingProgramCategory: string;
  
  /**
   * Difficulty level of the training program.
   * Niveau de difficulté du programme d'entraînement.
   */
  trainingProgramDifficultyLevel: string;
  
  /**
   * Duration of the training program in weeks.
   * Durée du programme d'entraînement en semaines.
   */
  trainingProgramDurationWeeks: number;
  
  /**
   * Number of training sessions per week.
   * Nombre de sessions d'entraînement par semaine.
   */
  trainingProgramSessionsPerWeek: number;
  
  /**
   * Whether the training program is public.
   * Si le programme d'entraînement est public.
   */
  trainingProgramIsPublic: boolean;
  
  /**
   * Current week of the program the user is on.
   * Semaine actuelle du programme où se trouve l'utilisateur.
   */
  currentWeek: number;
  
  /**
   * Current day of the program the user is on.
   * Jour actuel du programme où se trouve l'utilisateur.
   */
  currentDay: number;
  
  /**
   * Whether the user has completed the training program.
   * Si l'utilisateur a terminé le programme d'entraînement.
   */
  isCompleted: boolean;
  
  /**
   * Date when the user started the training program.
   * Date à laquelle l'utilisateur a commencé le programme d'entraînement.
   */
  startDate: string;
  
  /**
   * Date when the user completed the training program (if completed).
   * Date à laquelle l'utilisateur a terminé le programme d'entraînement (si terminé).
   */
  completionDate?: string;
  
  /**
   * User's progress percentage in the training program (0-100).
   * Pourcentage de progression de l'utilisateur dans le programme d'entraînement (0-100).
   */
  progressPercentage: number;
  
  /**
   * Additional notes for this user-program relationship.
   * Notes supplémentaires pour cette relation utilisateur-programme.
   */
  notes?: string;
  
  /**
   * Whether this user training program is active.
   * Si ce programme d'entraînement utilisateur est actif.
   */
  isActive: boolean;
  
  /**
   * Creation timestamp of the user training program.
   * Horodatage de création du programme d'entraînement utilisateur.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the user training program.
   * Horodatage de dernière mise à jour du programme d'entraînement utilisateur.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new user training program.
 * Interface pour créer un nouveau programme d'entraînement utilisateur.
 * 
 * This interface defines the required data structure for creating
 * a new user training program. It contains all the necessary information
 * to establish a user-program relationship in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouveau programme d'entraînement utilisateur. Elle contient toutes les informations
 * nécessaires pour établir une relation utilisateur-programme dans le système.
 */
export interface CreateUserTrainingProgramRequest {
  /**
   * ID of the user (required).
   * ID de l'utilisateur (requis).
   */
  userId: number;
  
  /**
   * ID of the training program (required).
   * ID du programme d'entraînement (requis).
   */
  trainingProgramId: number;
  
  /**
   * Additional notes for this user-program relationship (optional).
   * Notes supplémentaires pour cette relation utilisateur-programme (optionnel).
   */
  notes?: string;
}

/**
 * Interface for updating an existing user training program.
 * Interface pour mettre à jour un programme d'entraînement utilisateur existant.
 * 
 * This interface defines the data structure for updating a user training program.
 * All properties are optional to allow partial updates of user training program information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * un programme d'entraînement utilisateur. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations de programme d'entraînement utilisateur.
 */
export interface UpdateUserTrainingProgramRequest {
  /**
   * Current week of the program the user is on (optional for updates).
   * Semaine actuelle du programme où se trouve l'utilisateur (optionnel pour les mises à jour).
   */
  currentWeek?: number;
  
  /**
   * Current day of the program the user is on (optional for updates).
   * Jour actuel du programme où se trouve l'utilisateur (optionnel pour les mises à jour).
   */
  currentDay?: number;
  
  /**
   * Whether the user has completed the training program (optional for updates).
   * Si l'utilisateur a terminé le programme d'entraînement (optionnel pour les mises à jour).
   */
  isCompleted?: boolean;
  
  /**
   * Date when the user completed the training program (optional for updates).
   * Date à laquelle l'utilisateur a terminé le programme d'entraînement (optionnel pour les mises à jour).
   */
  completionDate?: string;
  
  /**
   * User's progress percentage in the training program (optional for updates).
   * Pourcentage de progression de l'utilisateur dans le programme d'entraînement (optionnel pour les mises à jour).
   */
  progressPercentage?: number;
  
  /**
   * Additional notes for this user-program relationship (optional for updates).
   * Notes supplémentaires pour cette relation utilisateur-programme (optionnel pour les mises à jour).
   */
  notes?: string;
  
  /**
   * Whether this user training program is active (optional for updates).
   * Si ce programme d'entraînement utilisateur est actif (optionnel pour les mises à jour).
   */
  isActive?: boolean;
} 