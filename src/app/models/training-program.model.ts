/**
 * Interface representing a training program.
 * Interface représentant un programme d'entraînement.
 * 
 * This interface defines the structure of a training program containing
 * all the necessary information for fitness training programs.
 * 
 * Cette interface définit la structure d'un programme d'entraînement contenant
 * toutes les informations nécessaires pour les programmes d'entraînement fitness.
 */
export interface TrainingProgram {
  /**
   * Unique identifier for the training program.
   * Identifiant unique pour le programme d'entraînement.
   */
  id?: number;
  
  /**
   * Name of the training program.
   * Nom du programme d'entraînement.
   */
  name: string;
  
  /**
   * Detailed description of the training program.
   * Description détaillée du programme d'entraînement.
   */
  description: string;
  
  /**
   * Category of the training program (e.g., "Strength", "Cardio", "Weight Loss").
   * Catégorie du programme d'entraînement (ex: "Force", "Cardio", "Perte de poids").
   */
  category: string;
  
  /**
   * Difficulty level of the training program (Beginner, Intermediate, Advanced).
   * Niveau de difficulté du programme d'entraînement (Débutant, Intermédiaire, Avancé).
   */
  difficultyLevel: string;
  
  /**
   * Target audience for the training program (e.g., "Men", "Women", "All").
   * Public cible du programme d'entraînement (ex: "Hommes", "Femmes", "Tous").
   */
  targetAudience: string;
  
  /**
   * Duration of the training program in weeks.
   * Durée du programme d'entraînement en semaines.
   */
  durationWeeks: number;
  
  /**
   * Number of training sessions per week.
   * Nombre de sessions d'entraînement par semaine.
   */
  sessionsPerWeek: number;
  
  /**
   * Whether the training program is public and available to all users.
   * Si le programme d'entraînement est public et disponible pour tous les utilisateurs.
   */
  isPublic: boolean;
  
  /**
   * Whether the training program is active and available for use.
   * Si le programme d'entraînement est actif et disponible pour utilisation.
   */
  isActive?: boolean;
  
  /**
   * ID of the user who created the training program.
   * ID de l'utilisateur qui a créé le programme d'entraînement.
   */
  userId?: number;
  
  /**
   * Creation timestamp of the training program.
   * Horodatage de création du programme d'entraînement.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the training program.
   * Horodatage de dernière mise à jour du programme d'entraînement.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new training program.
 * Interface pour créer un nouveau programme d'entraînement.
 * 
 * This interface defines the required data structure for creating
 * a new training program. It contains all the necessary information
 * to establish a training program in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouveau programme d'entraînement. Elle contient toutes les informations
 * nécessaires pour établir un programme d'entraînement dans le système.
 */
export interface CreateTrainingProgramRequest {
  /**
   * Name of the training program (required).
   * Nom du programme d'entraînement (requis).
   */
  name: string;
  
  /**
   * Detailed description of the training program (required).
   * Description détaillée du programme d'entraînement (requis).
   */
  description: string;
  
  /**
   * Category of the training program (required).
   * Catégorie du programme d'entraînement (requis).
   */
  category: string;
  
  /**
   * Difficulty level of the training program (required).
   * Niveau de difficulté du programme d'entraînement (requis).
   */
  difficultyLevel: string;
  
  /**
   * Target audience for the training program (required).
   * Public cible du programme d'entraînement (requis).
   */
  targetAudience: string;
  
  /**
   * Duration of the training program in weeks (required).
   * Durée du programme d'entraînement en semaines (requis).
   */
  durationWeeks: number;
  
  /**
   * Number of training sessions per week (required).
   * Nombre de sessions d'entraînement par semaine (requis).
   */
  sessionsPerWeek: number;
  
  /**
   * Whether the training program is public and available to all users (required).
   * Si le programme d'entraînement est public et disponible pour tous les utilisateurs (requis).
   */
  isPublic: boolean;
}

/**
 * Interface for updating an existing training program.
 * Interface pour mettre à jour un programme d'entraînement existant.
 * 
 * This interface defines the data structure for updating a training program.
 * All properties are optional to allow partial updates of training program information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * un programme d'entraînement. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations de programme d'entraînement.
 */
export interface UpdateTrainingProgramRequest {
  /**
   * Name of the training program (optional for updates).
   * Nom du programme d'entraînement (optionnel pour les mises à jour).
   */
  name?: string;
  
  /**
   * Detailed description of the training program (optional for updates).
   * Description détaillée du programme d'entraînement (optionnel pour les mises à jour).
   */
  description?: string;
  
  /**
   * Category of the training program (optional for updates).
   * Catégorie du programme d'entraînement (optionnel pour les mises à jour).
   */
  category?: string;
  
  /**
   * Difficulty level of the training program (optional for updates).
   * Niveau de difficulté du programme d'entraînement (optionnel pour les mises à jour).
   */
  difficultyLevel?: string;
  
  /**
   * Target audience for the training program (optional for updates).
   * Public cible du programme d'entraînement (optionnel pour les mises à jour).
   */
  targetAudience?: string;
  
  /**
   * Duration of the training program in weeks (optional for updates).
   * Durée du programme d'entraînement en semaines (optionnel pour les mises à jour).
   */
  durationWeeks?: number;
  
  /**
   * Number of training sessions per week (optional for updates).
   * Nombre de sessions d'entraînement par semaine (optionnel pour les mises à jour).
   */
  sessionsPerWeek?: number;
  
  /**
   * Whether the training program is public and available to all users (optional for updates).
   * Si le programme d'entraînement est public et disponible pour tous les utilisateurs (optionnel pour les mises à jour).
   */
  isPublic?: boolean;
  
  /**
   * Whether the training program is active and available for use (optional for updates).
   * Si le programme d'entraînement est actif et disponible pour utilisation (optionnel pour les mises à jour).
   */
  isActive?: boolean;
} 