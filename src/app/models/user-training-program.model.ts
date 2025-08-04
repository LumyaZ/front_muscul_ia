/**
 * Interface for user training program.
 * Interface pour un programme d'entraînement utilisateur.
 */
export interface UserTrainingProgram {

  id?: number;

  user?: {
    id: number;
    email: string;
    createdAt: string;
    updatedAt: string;
  };

  trainingProgram?: {
    id: number;
    name: string;
    description: string;
    category?: string;
    difficultyLevel: string;
    targetAudience?: string;
    createdByUserId: number;
    createdAt: string;
    updatedAt: string;
  };

  startDate: string;

  completionDate?: string;

  progressPercentage: number;

  notes?: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;

  userId?: number;

  trainingProgramId?: number;

  trainingProgramName?: string;

  trainingProgramDescription?: string;

  trainingProgramDifficultyLevel?: string;

  trainingProgramDurationWeeks?: number;

  trainingProgramSessionsPerWeek?: number;

  trainingProgramCategory?: string;

  isCompleted?: boolean;

  currentWeek?: number;

  currentDay?: number;
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

  userId: number;
  

  trainingProgramId: number;
  

  notes?: string;
}

/**
 * Interface for updating an existing user training program.
 * Interface pour mettre à jour un programme d'entraînement utilisateur existant.

 */
export interface UpdateUserTrainingProgramRequest {

  currentWeek?: number;
  
  currentDay?: number;
  
  isCompleted?: boolean;
  
  completionDate?: string;
  
  progressPercentage?: number;

  notes?: string;
  
  isActive?: boolean;
} 