/**
 * Interface for training exercise.
 * Interface pour un exercice d'entraînement.
 */
export interface TrainingExercise {

  id?: number;
  
  trainingSessionId: number;
  
  exerciseId: number;
  
  exerciseName: string;
  
  exerciseDescription: string;
  
  exerciseMuscleGroup: string;
  
  setsCount: number;
  
  repsCount: number;
  
  durationSeconds: number;
  
  weightKg?: number;

  notes?: string;
  
  isCompleted: boolean;
  
  createdAt?: string;
  
  updatedAt?: string;
}

/**
 * Interface for training session.
 * Interface pour une session d'entraînement.
 */
export interface TrainingSession {

  id?: number;

  name?: string;

  description?: string;

  sessionDate: string;

  sessionType: string;

  trainingProgramId?: number;

  trainingProgramName?: string;

  durationMinutes: number;


  notes?: string;

  userId: number;

  createdAt: string;

  updatedAt: string;

  startTime?: string;

  endTime?: string;

  isCompleted?: boolean;

  exercises?: any[];
}

/**
 * Interface for creating a new training session.
 * Interface pour créer une nouvelle session d'entraînement.
 */
export interface CreateTrainingSessionRequest {

  name: string;

  description?: string;
  
  sessionDate: string;
  
  durationMinutes: number;
  
  sessionType: string;
  

  trainingProgramId?: number;
}

/**
 * Interface for creating a new training exercise.
 * Interface pour créer un nouvel exercice d'entraînement.
 */
export interface CreateTrainingExerciseRequest {

  exerciseId: number;
  
  setsCount: number;
  
  repsCount: number;
  
  durationSeconds: number;
  
  weightKg?: number;
  
  notes?: string;
  
  isCompleted: boolean;
}

/**
 * Interface for updating an existing training session.
 * Interface pour mettre à jour une session d'entraînement existante.
 */
export interface UpdateTrainingSessionRequest {

  name?: string;
  
  description?: string;

  endTime?: string;

  durationMinutes?: number;

  isCompleted?: boolean;

  notes?: string;
} 