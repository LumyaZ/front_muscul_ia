import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TrainingProgram, CreateTrainingProgramRequest, UpdateTrainingProgramRequest } from '../models/training-program.model';
import { CreateProgramExerciseRequest } from '../models/program-exercise.model';

/**
 * Service for managing training programs.
 * Service pour la gestion des programmes d'entraînement.
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/training-programs`;

  /**
   * Get all public training programs.
   * Récupérer tous les programmes d'entraînement publics.
   */
  getPublicPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/public`);
  }

  /**
   * Get all training programs for the current user.
   * Récupérer tous les programmes d'entraînement de l'utilisateur connecté.
   */
  getUserPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/user`);
  }

  /**
   * Get a training program by its ID.
   * Récupérer un programme d'entraînement par son ID.
   */
  getProgramById(id: number): Observable<TrainingProgram> {
    return this.http.get<TrainingProgram>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new training program.
   * Créer un nouveau programme d'entraînement.
   */
  createProgram(program: CreateTrainingProgramRequest, userId: number): Observable<TrainingProgram> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<TrainingProgram>(this.apiUrl, program, { params });
  }

  /**
   * Create a training program with simplified data.
   * Créer un programme d'entraînement avec des données simplifiées.
   */
  createTrainingProgram(programData: any, userId: number): Observable<TrainingProgram> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.http.post<TrainingProgram>(this.apiUrl, programData, { params });
  }

  /**
   * Update an existing training program.
   * Mettre à jour un programme d'entraînement existant.
   */
  updateProgram(id: number, program: UpdateTrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.put<TrainingProgram>(`${this.apiUrl}/${id}`, program);
  }

  /**
   * Delete a training program.
   * Supprimer un programme d'entraînement.
   */
  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search training programs.
   * Rechercher des programmes d'entraînement.
   */
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

  /**
   * Get programs by difficulty level.
   * Récupérer les programmes par niveau de difficulté.
   */
  getProgramsByDifficulty(difficulty: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/difficulty/${difficulty}`);
  }

  /**
   * Get programs by category.
   * Récupérer les programmes par catégorie.
   */
  getProgramsByCategory(category: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Add a training program to the current user's programs.
   * Ajouter un programme d'entraînement aux programmes de l'utilisateur connecté.
   */
  addProgramToUser(programId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return new Observable(subscriber => subscriber.error('User not authenticated'));
    }
    return this.http.post<any>(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=${programId}&userId=${currentUser.id}`, {});
  }
} 