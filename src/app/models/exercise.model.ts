/**
 * Interface representing an exercise.
 * Interface représentant un exercice.
 * 
 * This interface defines the structure of an exercise containing
 * all the necessary information for fitness training exercises.
 * 
 * Cette interface définit la structure d'un exercice contenant
 * toutes les informations nécessaires pour les exercices d'entraînement fitness.
 */
export interface Exercise {
  /**
   * Unique identifier for the exercise.
   * Identifiant unique pour l'exercice.
   */
  id?: number;
  
  /**
   * Name of the exercise.
   * Nom de l'exercice.
   */
  name: string;
  
  /**
   * Detailed description of the exercise.
   * Description détaillée de l'exercice.
   */
  description: string;
  
  /**
   * Category of the exercise (e.g., "Strength", "Cardio", "Flexibility").
   * Catégorie de l'exercice (ex: "Force", "Cardio", "Flexibilité").
   */
  category: string;
  
  /**
   * Primary muscle group targeted by the exercise.
   * Groupe musculaire principal ciblé par l'exercice.
   */
  muscleGroup: string;
  
  /**
   * Secondary muscle groups targeted by the exercise.
   * Groupes musculaires secondaires ciblés par l'exercice.
   */
  secondaryMuscleGroups?: string[];
  
  /**
   * Difficulty level of the exercise (Beginner, Intermediate, Advanced).
   * Niveau de difficulté de l'exercice (Débutant, Intermédiaire, Avancé).
   */
  difficultyLevel: string;
  
  /**
   * Equipment required for the exercise.
   * Équipement requis pour l'exercice.
   */
  equipment: string;
  
  /**
   * Instructions on how to perform the exercise.
   * Instructions sur la façon d'effectuer l'exercice.
   */
  instructions: string;
  
  /**
   * Tips for proper form and technique.
   * Conseils pour une forme et une technique appropriées.
   */
  tips?: string;
  
  /**
   * URL to an image or video demonstrating the exercise.
   * URL vers une image ou une vidéo démontrant l'exercice.
   */
  mediaUrl?: string;
  
  /**
   * Whether the exercise is active and available for use.
   * Si l'exercice est actif et disponible pour utilisation.
   */
  isActive?: boolean;
  
  /**
   * Creation timestamp of the exercise.
   * Horodatage de création de l'exercice.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the exercise.
   * Horodatage de dernière mise à jour de l'exercice.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new exercise.
 * Interface pour créer un nouvel exercice.
 * 
 * This interface defines the required data structure for creating
 * a new exercise. It contains all the necessary information
 * to establish an exercise in the system.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouvel exercice. Elle contient toutes les informations
 * nécessaires pour établir un exercice dans le système.
 */
export interface CreateExerciseRequest {
  /**
   * Name of the exercise (required).
   * Nom de l'exercice (requis).
   */
  name: string;
  
  /**
   * Detailed description of the exercise (required).
   * Description détaillée de l'exercice (requis).
   */
  description: string;
  
  /**
   * Category of the exercise (required).
   * Catégorie de l'exercice (requis).
   */
  category: string;
  
  /**
   * Primary muscle group targeted by the exercise (required).
   * Groupe musculaire principal ciblé par l'exercice (requis).
   */
  muscleGroup: string;
  
  /**
   * Secondary muscle groups targeted by the exercise (optional).
   * Groupes musculaires secondaires ciblés par l'exercice (optionnel).
   */
  secondaryMuscleGroups?: string[];
  
  /**
   * Difficulty level of the exercise (required).
   * Niveau de difficulté de l'exercice (requis).
   */
  difficultyLevel: string;
  
  /**
   * Equipment required for the exercise (required).
   * Équipement requis pour l'exercice (requis).
   */
  equipment: string;
  
  /**
   * Instructions on how to perform the exercise (required).
   * Instructions sur la façon d'effectuer l'exercice (requis).
   */
  instructions: string;
  
  /**
   * Tips for proper form and technique (optional).
   * Conseils pour une forme et une technique appropriées (optionnel).
   */
  tips?: string;
  
  /**
   * URL to an image or video demonstrating the exercise (optional).
   * URL vers une image ou une vidéo démontrant l'exercice (optionnel).
   */
  mediaUrl?: string;
}

/**
 * Interface for updating an existing exercise.
 * Interface pour mettre à jour un exercice existant.
 * 
 * This interface defines the data structure for updating an exercise.
 * All properties are optional to allow partial updates of exercise information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * un exercice. Toutes les propriétés sont optionnelles pour permettre
 * des mises à jour partielles des informations d'exercice.
 */
export interface UpdateExerciseRequest {
  /**
   * Name of the exercise (optional for updates).
   * Nom de l'exercice (optionnel pour les mises à jour).
   */
  name?: string;
  
  /**
   * Detailed description of the exercise (optional for updates).
   * Description détaillée de l'exercice (optionnel pour les mises à jour).
   */
  description?: string;
  
  /**
   * Category of the exercise (optional for updates).
   * Catégorie de l'exercice (optionnel pour les mises à jour).
   */
  category?: string;
  
  /**
   * Primary muscle group targeted by the exercise (optional for updates).
   * Groupe musculaire principal ciblé par l'exercice (optionnel pour les mises à jour).
   */
  muscleGroup?: string;
  
  /**
   * Secondary muscle groups targeted by the exercise (optional for updates).
   * Groupes musculaires secondaires ciblés par l'exercice (optionnel pour les mises à jour).
   */
  secondaryMuscleGroups?: string[];
  
  /**
   * Difficulty level of the exercise (optional for updates).
   * Niveau de difficulté de l'exercice (optionnel pour les mises à jour).
   */
  difficultyLevel?: string;
  
  /**
   * Equipment required for the exercise (optional for updates).
   * Équipement requis pour l'exercice (optionnel pour les mises à jour).
   */
  equipment?: string;
  
  /**
   * Instructions on how to perform the exercise (optional for updates).
   * Instructions sur la façon d'effectuer l'exercice (optionnel pour les mises à jour).
   */
  instructions?: string;
  
  /**
   * Tips for proper form and technique (optional for updates).
   * Conseils pour une forme et une technique appropriées (optionnel pour les mises à jour).
   */
  tips?: string;
  
  /**
   * URL to an image or video demonstrating the exercise (optional for updates).
   * URL vers une image ou une vidéo démontrant l'exercice (optionnel pour les mises à jour).
   */
  mediaUrl?: string;
  
  /**
   * Whether the exercise is active and available for use (optional for updates).
   * Si l'exercice est actif et disponible pour utilisation (optionnel pour les mises à jour).
   */
  isActive?: boolean;
} 