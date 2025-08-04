import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, catchError } from "rxjs";
import { environment } from "../../environments/environment";

/**
 * Interface representing a training exercise.
 * Interface représentant un exercice d'entraînement.
 */
export interface TrainingExercise {
  id: number;
  exerciseName: string;
  exerciseDescription: string;
  exerciseMuscleGroup: string;
  setsCount: number;
  repsCount: number;
  durationSeconds: number;
  restDurationSeconds: number;
  weightKg: number | null;
  notes: string;
  isOptional: boolean;
  completedSets: boolean[];
}

/**
 * Interface representing a training session.
 * Interface représentant une session d'entraînement.
 */
export interface TrainingSession {
  id?: number;
  userId: number;
  trainingProgramId: number;
  startTime: Date;
  endTime?: Date;
  duration: number;
  exercises: TrainingExercise[];
  notes?: string;
  rating?: number;
  title?: string;
}

/**
 * Interface for creating a training session request.
 * Interface pour la requête de création d'une session d'entraînement.
 */
export interface CreateTrainingSessionRequest {
  name: string;
  description?: string;
  sessionDate: string; // Format ISO string
  durationMinutes: number;
  sessionType?: string;
  trainingProgramId?: number;
}

/**
 * Interface for training session DTO from backend.
 * Interface pour le DTO de session d'entraînement du backend.
 */
export interface TrainingSessionDto {
  id: number;
  userId: number;
  name: string;
  description?: string;
  sessionDate: string;
  durationMinutes: number;
  sessionType?: string;
  trainingProgramId?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for managing training sessions.
 * Service pour la gestion des sessions d'entraînement.
 */
@Injectable({
  providedIn: "root"
})
export class TrainingSessionService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/training-sessions`;

  /**
   * Create a new training session.
   * Créer une nouvelle session d'entraînement.
   */
  createTrainingSession(request: CreateTrainingSessionRequest): Observable<TrainingSessionDto> {
    return this.http.post<TrainingSessionDto>(this.apiUrl, request).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training session by ID.
   * Obtenir une session d'entraînement par ID.
   */
  getTrainingSession(sessionId: number): Observable<TrainingSessionDto> {
    return this.http.get<TrainingSessionDto>(`${this.apiUrl}/${sessionId}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Update training session.
   * Mettre à jour une session d'entraînement.
   */
  updateTrainingSession(sessionId: number, request: CreateTrainingSessionRequest): Observable<TrainingSessionDto> {
    return this.http.put<TrainingSessionDto>(`${this.apiUrl}/${sessionId}`, request).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get all training sessions for the current user.
   * Obtenir toutes les sessions d'entraînement de l'utilisateur actuel.
   */
  getUserTrainingSessions(): Observable<TrainingSessionDto[]> {
    return this.http.get<TrainingSessionDto[]>(this.apiUrl).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training sessions for a specific user with pagination.
   * Obtenir les sessions d'entraînement d'un utilisateur spécifique avec pagination.
   */
  getUserTrainingSessionsWithPagination(userId: number, page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}?page=${page}&size=${size}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training sessions by date range.
   * Obtenir les sessions d'entraînement par plage de dates.
   */
  getTrainingSessionsByDateRange(startDate: string, endDate: string): Observable<TrainingSessionDto[]> {
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training sessions by type.
   * Obtenir les sessions d'entraînement par type.
   */
  getTrainingSessionsByType(sessionType: string): Observable<TrainingSessionDto[]> {
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/type/${sessionType}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training sessions by program.
   * Obtenir les sessions d'entraînement par programme.
   */
  getTrainingSessionsByProgram(trainingProgramId: number): Observable<TrainingSessionDto[]> {
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/program/${trainingProgramId}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Search training sessions by name.
   * Rechercher des sessions d'entraînement par nom.
   */
  searchTrainingSessionsByName(name: string): Observable<TrainingSessionDto[]> {
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/search?name=${name}`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get most recent training session.
   * Obtenir la session d'entraînement la plus récente.
   */
  getMostRecentTrainingSession(): Observable<TrainingSessionDto> {
    return this.http.get<TrainingSessionDto>(`${this.apiUrl}/recent`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Get training sessions count.
   * Obtenir le nombre total de sessions d'entraînement.
   */
  getTrainingSessionsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      tap(response => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Delete training session.
   * Supprimer une session d'entraînement.
   */
  deleteTrainingSession(sessionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sessionId}`).pipe(
      tap(() => {
        // Success callback
      }),
      catchError(error => {
        throw error;
      })
    );
  }
} 