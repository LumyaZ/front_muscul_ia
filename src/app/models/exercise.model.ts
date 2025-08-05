/**
 * Interface representing an exercise.
 * Interface représentant un exercice.
 */
export interface Exercise {

  id?: number;  

  name: string;
  
  description: string;

  category: string;

  muscleGroup?: string;   

  equipmentNeeded?: string;
  
  difficultyLevel?: string;

  isActive?: boolean;
  
  createdAt?: string;
  
  updatedAt?: string;
}

/**
 * Interface for creating a new exercise.
 * Interface pour créer un nouvel exercice.
 */
export interface CreateExerciseRequest {

  name: string;
  
  description: string;
  
  category: string;
  
  muscleGroup?: string;
  
  equipmentNeeded?: string;
  
  difficultyLevel?: string;
}

/**
 * Interface for updating an existing exercise.
 * Interface pour mettre à jour un exercice existant.

 */
export interface UpdateExerciseRequest {

  name?: string;
  
  description?: string;
  
  category?: string;
  
  muscleGroup?: string;
  
  difficultyLevel?: string;
  
  equipmentNeeded?: string;
  
  isActive?: boolean;
} 