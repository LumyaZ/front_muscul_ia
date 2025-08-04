/**
 * Interface for training program.
 * Interface pour un programme d'entraînement.
 */
export interface TrainingProgram {

  id: number;

  name: string;

  description: string;

  category?: string;

  difficultyLevel: string;

  targetAudience?: string;

  createdByUserId: number;

  createdAt: string;

  updatedAt: string;

  durationWeeks?: number;

  sessionsPerWeek?: number;

  isPublic?: boolean;
}

/**
 * Interface for creating a new training program.
 * Interface pour créer un nouveau programme d'entraînement.
 */
export interface CreateTrainingProgramRequest {

  name: string;
  
  description: string;
  
  difficultyLevel: string;
  
  category?: string;
  
  targetAudience?: string;
}

/**
 * Interface for updating an existing training program.
 * Interface pour mettre à jour un programme d'entraînement existant.

 * Cette interface définit la structure de données pour mettre à jour
 * un programme d'entraînement. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations de programme d'entraînement.
 */
export interface UpdateTrainingProgramRequest {

  name?: string;

  description?: string;
  
  category?: string;
  
  difficultyLevel?: string;
  
  targetAudience?: string;
  
  durationWeeks?: number;
  
  sessionsPerWeek?: number;
  
  isPublic?: boolean;
  
  isActive?: boolean;
} 