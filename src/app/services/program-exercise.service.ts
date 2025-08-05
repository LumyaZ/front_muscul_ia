import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProgramExercise, CreateProgramExerciseRequest } from '../models/program-exercise.model';

/**
 * Service for managing program exercise operations.
 * Service pour gérer les opérations d'exercices de programme.
 */
@Injectable({
  providedIn: 'root'
})
export class ProgramExerciseService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/program-exercises`;

  /**
   * Get all exercises for a specific training program by its ID.
   * Récupérer tous les exercices d'un programme d'entraînement par son ID.
   */
  getExercisesByProgramId(programId: number): Observable<ProgramExercise[]> {
    return this.http.get<ProgramExercise[]>(`${this.apiUrl}/program/${programId}`);
  }

  /**
   * Get a specific program exercise by its ID.
   * Récupérer un exercice de programme spécifique par son ID.
   */
  getProgramExerciseById(id: number): Observable<ProgramExercise> {
    return this.http.get<ProgramExercise>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new program exercise.
   * Créer un nouvel exercice de programme.
   */
  createProgramExercise(request: CreateProgramExerciseRequest): Observable<ProgramExercise> {
    return this.http.post<ProgramExercise>(`${this.apiUrl}/program/${request.trainingProgramId}`, request);
  }

  /**
   * Update an existing program exercise.
   * Mettre à jour un exercice de programme existant.
   */
  updateProgramExercise(id: number, request: CreateProgramExerciseRequest): Observable<ProgramExercise> {
    return this.http.put<ProgramExercise>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete a program exercise.
   * Supprimer un exercice de programme.
   */
  deleteProgramExercise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add an exercise to a training program.
   * Ajouter un exercice à un programme d'entraînement.
   */
  addExerciseToProgram(programId: number, exerciseData: CreateProgramExerciseRequest): Observable<ProgramExercise> {
    return this.http.post<ProgramExercise>(`${this.apiUrl}/program/${programId}`, exerciseData);
  }
} 