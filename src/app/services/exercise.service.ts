import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interface representing an exercise.
 * Interface représentant un exercice.
 */
export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  equipmentNeeded: string;
  difficultyLevel: string;
  videoUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for managing exercise operations.
 * Service pour gérer les opérations d'exercices.
 */
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/exercises`;

  /**
   * Get all available exercises.
   * Obtenir tous les exercices disponibles.
   */
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  /**
   * Get an exercise by its ID.
   * Obtenir un exercice par son ID.
   */
  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get exercises by category.
   * Obtenir les exercices par catégorie.
   */
  getExercisesByCategory(category: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get exercises by muscle group.
   * Obtenir les exercices par groupe musculaire.
   */
  getExercisesByMuscleGroup(muscleGroup: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/muscle-group/${muscleGroup}`);
  }

  /**
   * Get exercises by difficulty level.
   * Obtenir les exercices par niveau de difficulté.
   */
  getExercisesByDifficulty(difficultyLevel: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/difficulty/${difficultyLevel}`);
  }

  /**
   * Search exercises by name or description.
   * Rechercher des exercices par nom ou description.
   */
  searchExercises(searchTerm: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
  }
} 