/**
 * Interface for program exercise.
 * Interface pour un exercice de programme.
 */
export interface ProgramExercise {

  id?: number;

  trainingProgramId?: number;

  exerciseId?: number;

  exerciseName?: string;

  exerciseDescription?: string;

  exerciseMuscleGroup?: string;

  exerciseCategory?: string;

  exerciseEquipmentNeeded?: string;

  exerciseDifficultyLevel?: string;

  setsCount: number;

  repsCount?: number;

  restDurationSeconds?: number;

  weightKg?: number;

  distanceMeters?: number;

  notes?: string;

  durationSeconds?: number;

  isOptional?: boolean;

  orderIndex?: number;
}

/**
 * Interface for creating a new program exercise.
 * Interface pour créer un nouvel exercice de programme.
 */
export interface CreateProgramExerciseRequest {

  trainingProgramId: number;
  
  exerciseId: number;
  
  setsCount: number;
  
  repsCount: number;
  
  restDurationSeconds?: number;

  weightKg?: number;
  
  distanceMeters?: number;
  
  notes?: string;
}

/**
 * Interface for updating an existing program exercise.
 * Interface pour mettre à jour un exercice de programme existant.
 */
export interface UpdateProgramExerciseRequest {

  setsCount?: number;
  
  repsCount?: number;
  
  durationSeconds?: number;
  
  restDurationSeconds?: number;
  
  weightKg?: number;
  
  notes?: string;
  
  isOptional?: boolean;
  
  orderIndex?: number;
} 