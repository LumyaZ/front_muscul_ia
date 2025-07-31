import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap, catchError } from "rxjs";
import { environment } from "../../environments/environment";

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

// Interface pour correspondre au DTO CreateTrainingSessionRequest du backend
export interface CreateTrainingSessionRequest {
  name: string;
  description?: string;
  sessionDate: string; // Format ISO string
  durationMinutes: number;
  sessionType?: string;
  trainingProgramId?: number;
}

// Interface pour la réponse du backend
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

@Injectable({
  providedIn: "root"
})
export class TrainingSessionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/training-sessions`;

  /**
   * Create a new training session
   */
  createTrainingSession(request: CreateTrainingSessionRequest): Observable<TrainingSessionDto> {
    console.log('=== TRAINING SESSION SERVICE: CREATE ===');
    console.log('Request data:', request);
    console.log('API URL:', this.apiUrl);
    
    return this.http.post<TrainingSessionDto>(this.apiUrl, request).pipe(
      tap(response => {
        console.log('Training session created successfully:', response);
      }),
      catchError(error => {
        console.error('Error creating training session:', error);
        throw error;
      })
    );
  }

  /**
   * Get training session by ID
   */
  getTrainingSession(sessionId: number): Observable<TrainingSessionDto> {
    console.log('=== TRAINING SESSION SERVICE: GET BY ID ===');
    console.log('Session ID:', sessionId);
    
    return this.http.get<TrainingSessionDto>(`${this.apiUrl}/${sessionId}`).pipe(
      tap(response => {
        console.log('Training session retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting training session:', error);
        throw error;
      })
    );
  }

  /**
   * Update training session
   */
  updateTrainingSession(sessionId: number, request: CreateTrainingSessionRequest): Observable<TrainingSessionDto> {
    console.log('=== TRAINING SESSION SERVICE: UPDATE ===');
    console.log('Session ID:', sessionId);
    console.log('Request data:', request);
    
    return this.http.put<TrainingSessionDto>(`${this.apiUrl}/${sessionId}`, request).pipe(
      tap(response => {
        console.log('Training session updated successfully:', response);
      }),
      catchError(error => {
        console.error('Error updating training session:', error);
        throw error;
      })
    );
  }

  /**
   * Get all training sessions for the current user
   */
  getUserTrainingSessions(): Observable<TrainingSessionDto[]> {
    console.log('=== TRAINING SESSION SERVICE: GET USER SESSIONS ===');
    console.log('API URL:', this.apiUrl);
    
    return this.http.get<TrainingSessionDto[]>(this.apiUrl).pipe(
      tap(response => {
        console.log('User training sessions retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting user training sessions:', error);
        throw error;
      })
    );
  }

  /**
   * Get training sessions for a specific user with pagination
   */
  getUserTrainingSessionsWithPagination(userId: number, page: number = 0, size: number = 10): Observable<any> {
    console.log('=== TRAINING SESSION SERVICE: GET USER SESSIONS WITH PAGINATION ===');
    console.log('User ID:', userId);
    console.log('Page:', page);
    console.log('Size:', size);
    
    return this.http.get<any>(`${this.apiUrl}/user/${userId}?page=${page}&size=${size}`).pipe(
      tap(response => {
        console.log('User training sessions with pagination retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting user training sessions with pagination:', error);
        throw error;
      })
    );
  }

  /**
   * Get training sessions by date range
   */
  getTrainingSessionsByDateRange(startDate: string, endDate: string): Observable<TrainingSessionDto[]> {
    console.log('=== TRAINING SESSION SERVICE: GET BY DATE RANGE ===');
    console.log('Start date:', startDate);
    console.log('End date:', endDate);
    
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`).pipe(
      tap(response => {
        console.log('Training sessions by date range retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting training sessions by date range:', error);
        throw error;
      })
    );
  }

  /**
   * Get training sessions by type
   */
  getTrainingSessionsByType(sessionType: string): Observable<TrainingSessionDto[]> {
    console.log('=== TRAINING SESSION SERVICE: GET BY TYPE ===');
    console.log('Session type:', sessionType);
    
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/type/${sessionType}`).pipe(
      tap(response => {
        console.log('Training sessions by type retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting training sessions by type:', error);
        throw error;
      })
    );
  }

  /**
   * Get training sessions by program
   */
  getTrainingSessionsByProgram(trainingProgramId: number): Observable<TrainingSessionDto[]> {
    console.log('=== TRAINING SESSION SERVICE: GET BY PROGRAM ===');
    console.log('Training program ID:', trainingProgramId);
    
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/program/${trainingProgramId}`).pipe(
      tap(response => {
        console.log('Training sessions by program retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting training sessions by program:', error);
        throw error;
      })
    );
  }

  /**
   * Search training sessions by name
   */
  searchTrainingSessionsByName(name: string): Observable<TrainingSessionDto[]> {
    console.log('=== TRAINING SESSION SERVICE: SEARCH BY NAME ===');
    console.log('Search name:', name);
    
    return this.http.get<TrainingSessionDto[]>(`${this.apiUrl}/search?name=${name}`).pipe(
      tap(response => {
        console.log('Training sessions search results:', response);
      }),
      catchError(error => {
        console.error('Error searching training sessions:', error);
        throw error;
      })
    );
  }

  /**
   * Get most recent training session
   */
  getMostRecentTrainingSession(): Observable<TrainingSessionDto> {
    console.log('=== TRAINING SESSION SERVICE: GET MOST RECENT ===');
    
    return this.http.get<TrainingSessionDto>(`${this.apiUrl}/recent`).pipe(
      tap(response => {
        console.log('Most recent training session retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting most recent training session:', error);
        throw error;
      })
    );
  }

  /**
   * Get training sessions count
   */
  getTrainingSessionsCount(): Observable<number> {
    console.log('=== TRAINING SESSION SERVICE: GET COUNT ===');
    
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      tap(response => {
        console.log('Training sessions count retrieved:', response);
      }),
      catchError(error => {
        console.error('Error getting training sessions count:', error);
        throw error;
      })
    );
  }

  /**
   * Delete training session
   */
  deleteTrainingSession(sessionId: number): Observable<void> {
    console.log('=== TRAINING SESSION SERVICE: DELETE ===');
    console.log('Session ID to delete:', sessionId);
    
    return this.http.delete<void>(`${this.apiUrl}/${sessionId}`).pipe(
      tap(() => {
        console.log('Training session deleted successfully');
      }),
      catchError(error => {
        console.error('Error deleting training session:', error);
        throw error;
      })
    );
  }
} 