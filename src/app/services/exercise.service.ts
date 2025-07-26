import { Injectable } from '@angular/core';
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
 * 
 * This service provides methods to create, read, update, and delete
 * exercises. It handles all CRUD operations related to exercise
 * management.
 * 
 * Ce service fournit des méthodes pour créer, lire, mettre à jour et
 * supprimer des exercices. Il gère toutes les opérations CRUD liées
 * à la gestion des exercices.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  
  /**
   * Base URL for the exercise API endpoints.
   * URL de base pour les endpoints API d'exercices.
   */
  private readonly apiUrl = `${environment.apiUrl}/exercises`;

  /**
   * Constructor for ExerciseService.
   * Constructeur pour ExerciseService.
   * 
   * @param http - Angular HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Get all available exercises.
   * Obtenir tous les exercices disponibles.
   * 
   * This method retrieves all exercises from the database.
   * It returns a list of all available exercises that can be
   * used in training programs.
   * 
   * Cette méthode récupère tous les exercices de la base de données.
   * Elle retourne une liste de tous les exercices disponibles qui peuvent
   * être utilisés dans les programmes d'entraînement.
   * 
   * @returns Observable<Exercise[]> - List of all exercises
   * @throws Error - If the request fails
   */
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  /**
   * Get an exercise by its ID.
   * Obtenir un exercice par son ID.
   * 
   * This method retrieves a specific exercise by its unique identifier.
   * 
   * Cette méthode récupère un exercice spécifique par son identifiant unique.
   * 
   * @param id - Unique identifier of the exercise
   * @returns Observable<Exercise> - Exercise details
   * @throws Error - If the exercise doesn't exist or request fails
   */
  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get exercises by category.
   * Obtenir les exercices par catégorie.
   * 
   * This method retrieves all exercises that belong to a specific category.
   * 
   * Cette méthode récupère tous les exercices qui appartiennent à une catégorie spécifique.
   * 
   * @param category - Category of exercises to retrieve
   * @returns Observable<Exercise[]> - List of exercises in the category
   * @throws Error - If the request fails
   */
  getExercisesByCategory(category: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/category/${category}`);
  }

  /**
   * Get exercises by muscle group.
   * Obtenir les exercices par groupe musculaire.
   * 
   * This method retrieves all exercises that target a specific muscle group.
   * 
   * Cette méthode récupère tous les exercices qui ciblent un groupe musculaire spécifique.
   * 
   * @param muscleGroup - Muscle group to filter by
   * @returns Observable<Exercise[]> - List of exercises for the muscle group
   * @throws Error - If the request fails
   */
  getExercisesByMuscleGroup(muscleGroup: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/muscle-group/${muscleGroup}`);
  }

  /**
   * Get exercises by difficulty level.
   * Obtenir les exercices par niveau de difficulté.
   * 
   * This method retrieves all exercises of a specific difficulty level.
   * 
   * Cette méthode récupère tous les exercices d'un niveau de difficulté spécifique.
   * 
   * @param difficultyLevel - Difficulty level to filter by
   * @returns Observable<Exercise[]> - List of exercises with the difficulty level
   * @throws Error - If the request fails
   */
  getExercisesByDifficulty(difficultyLevel: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/difficulty/${difficultyLevel}`);
  }

  /**
   * Search exercises by name or description.
   * Rechercher des exercices par nom ou description.
   * 
   * This method searches for exercises that match the provided search term
   * in their name or description.
   * 
   * Cette méthode recherche des exercices qui correspondent au terme de recherche
   * fourni dans leur nom ou description.
   * 
   * @param searchTerm - Term to search for
   * @returns Observable<Exercise[]> - List of matching exercises
   * @throws Error - If the request fails
   */
  searchExercises(searchTerm: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
  }
} 