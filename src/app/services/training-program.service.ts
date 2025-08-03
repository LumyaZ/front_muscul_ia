import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Interface representing a training program.
 * Interface représentant un programme d'entraînement.
 */
export interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  difficultyLevel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  category: string;
  targetAudience: string;
  equipmentRequired: string;
  isPublic: boolean;
  isActive: boolean;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new training program.
 * Interface pour créer un nouveau programme d'entraînement.
 */
export interface CreateTrainingProgramRequest {
  name: string;
  description: string;
  difficultyLevel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  category: string;
  targetAudience: string;
  equipmentRequired: string;
  isPublic: boolean;
  exercises: ProgramExerciseRequest[];
}

/**
 * Interface for program exercise requests.
 * Interface pour les requêtes d'exercices de programme.
 */
export interface ProgramExerciseRequest {
  exerciseId: number;
  orderInProgram: number;
  setsCount: number;
  repsCount?: number;
  durationSeconds?: number;
  restDurationSeconds: number;
  weightKg?: number;
  isOptional: boolean;
}

/**
 * Interface for updating a training program.
 * Interface pour mettre à jour un programme d'entraînement.
 */
export interface UpdateTrainingProgramRequest {
  name?: string;
  description?: string;
  difficultyLevel?: string;
  durationWeeks?: number;
  sessionsPerWeek?: number;
  estimatedDurationMinutes?: number;
  category?: string;
  targetAudience?: string;
  equipmentRequired?: string;
  isPublic?: boolean;
  exercises?: ProgramExerciseRequest[];
}

/**
 * Service for managing training programs.
 * Service pour la gestion des programmes d'entraînement.
 * 
 * This service provides methods to interact with the training program API,
 * including CRUD operations, searching, and filtering capabilities.
 * 
 * Ce service fournit des méthodes pour interagir avec l'API des programmes
 * d'entraînement, incluant les opérations CRUD, la recherche et les capacités
 * de filtrage.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  private apiUrl = `${environment.apiUrl}/training-programs`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get all public training programs.
   * Récupérer tous les programmes d'entraînement publics.
   * 
   * @returns Observable<TrainingProgram[]> - List of public training programs
   */
  getPublicPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/public`);
  }

  /**
   * Get all training programs for the current user.
   * Récupérer tous les programmes d'entraînement de l'utilisateur connecté.
   * 
   * @returns Observable<TrainingProgram[]> - List of user's training programs
   */
  getUserPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/user`);
  }

  /**
   * Get a training program by its ID.
   * Récupérer un programme d'entraînement par son ID.
   * 
   * @param id - Training program ID
   * @returns Observable<TrainingProgram> - Training program details
   */
  getProgramById(id: number): Observable<TrainingProgram> {
    return this.http.get<TrainingProgram>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new training program.
   * Créer un nouveau programme d'entraînement.
   * 
   * @param program - The training program data
   * @param userId - The ID of the user creating the program
   * @returns Observable of the created training program
   */
  createProgram(program: CreateTrainingProgramRequest, userId: number): Observable<TrainingProgram> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<TrainingProgram>(this.apiUrl, program, { params });
  }

  /**
   * Create a training program with simplified data.
   * Créer un programme d'entraînement avec des données simplifiées.
   * 
   * @param programData - Simplified program data
   * @param userId - The ID of the user creating the program
   * @returns Observable of the created training program
   */
  createTrainingProgram(programData: any, userId: number): Observable<TrainingProgram> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<TrainingProgram>(this.apiUrl, programData, { params });
  }

  /**
   * Update an existing training program.
   * Mettre à jour un programme d'entraînement existant.
   * 
   * @param id - Training program ID to update
   * @param program - Updated training program data
   * @returns Observable<TrainingProgram> - Updated training program
   */
  updateProgram(id: number, program: UpdateTrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.put<TrainingProgram>(`${this.apiUrl}/${id}`, program);
  }

  /**
   * Delete a training program.
   * Supprimer un programme d'entraînement.
   * 
   * @param id - Training program ID to delete
   * @returns Observable<void> - Success response
   */
  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des programmes
  searchPrograms(
    name?: string,
    difficultyLevel?: string,
    category?: string,
    targetAudience?: string,
    isPublic?: boolean
  ): Observable<TrainingProgram[]> {
    let params = new HttpParams();
    
    if (name) params = params.set('name', name);
    if (difficultyLevel) params = params.set('difficultyLevel', difficultyLevel);
    if (category) params = params.set('category', category);
    if (targetAudience) params = params.set('targetAudience', targetAudience);
    if (isPublic !== undefined) params = params.set('isPublic', isPublic.toString());

    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/search`, { params });
  }

  // Récupérer les programmes par difficulté
  getProgramsByDifficulty(difficulty: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/difficulty/${difficulty}`);
  }

  // Récupérer les programmes par catégorie
  getProgramsByCategory(category: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Add a training program to the current user's programs.
   * Ajouter un programme d'entraînement aux programmes de l'utilisateur connecté.
   * 
   * @param programId - The training program ID to add
   * @returns Observable<any> - Success response
   */
  addProgramToUser(programId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return new Observable(subscriber => subscriber.error('User not authenticated'));
    }
    return this.http.post<any>(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=${programId}&userId=${currentUser.id}`, {});
  }
} 