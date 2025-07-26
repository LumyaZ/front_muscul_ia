import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Interface representing an exercise within a training program.
 * Interface représentant un exercice dans un programme d'entraînement.
 * 
 * This interface defines the complete structure of a program exercise,
 * including both the exercise details and the program-specific parameters
 * such as sets, reps, duration, and order within the program.
 * 
 * Cette interface définit la structure complète d'un exercice de programme,
 * incluant à la fois les détails de l'exercice et les paramètres spécifiques
 * au programme tels que les séries, répétitions, durée et ordre dans le programme.
 */
export interface ProgramExercise {
  /**
   * Unique identifier for the program exercise.
   * Identifiant unique pour l'exercice de programme.
   */
  id: number;
  
  /**
   * ID of the training program this exercise belongs to.
   * ID du programme d'entraînement auquel cet exercice appartient.
   */
  trainingProgramId: number;
  
  /**
   * ID of the associated exercise.
   * ID de l'exercice associé.
   */
  exerciseId: number;
  
  /**
   * Name of the exercise.
   * Nom de l'exercice.
   */
  exerciseName: string;
  
  /**
   * Description of the exercise.
   * Description de l'exercice.
   */
  exerciseDescription: string;
  
  /**
   * Category of the exercise (e.g., "Musculation", "Cardio").
   * Catégorie de l'exercice (ex: "Musculation", "Cardio").
   */
  exerciseCategory: string;
  
  /**
   * Target muscle group for the exercise.
   * Groupe musculaire ciblé pour l'exercice.
   */
  exerciseMuscleGroup: string;
  
  /**
   * Equipment needed to perform the exercise.
   * Équipement nécessaire pour effectuer l'exercice.
   */
  exerciseEquipmentNeeded: string;
  
  /**
   * Difficulty level of the exercise.
   * Niveau de difficulté de l'exercice.
   */
  exerciseDifficultyLevel: string;
  
  /**
   * Order of the exercise within the program.
   * Ordre de l'exercice dans le programme.
   */
  orderInProgram: number;
  
  /**
   * Number of sets to perform for this exercise.
   * Nombre de séries à effectuer pour cet exercice.
   */
  setsCount: number;
  
  /**
   * Number of repetitions per set.
   * Nombre de répétitions par série.
   */
  repsCount: number;
  
  /**
   * Duration of the exercise in seconds (for time-based exercises).
   * Durée de l'exercice en secondes (pour les exercices basés sur le temps).
   */
  durationSeconds: number;
  
  /**
   * Rest duration between sets in seconds.
   * Durée de repos entre les séries en secondes.
   */
  restDurationSeconds: number;
  
  /**
   * Weight to use for the exercise in kilograms.
   * Poids à utiliser pour l'exercice en kilogrammes.
   */
  weightKg: number;
  
  /**
   * Distance to cover for the exercise in meters (for cardio exercises).
   * Distance à parcourir pour l'exercice en mètres (pour les exercices cardio).
   */
  distanceMeters: number;
  
  /**
   * Additional notes or instructions for the exercise.
   * Notes ou instructions supplémentaires pour l'exercice.
   */
  notes: string;
  
  /**
   * Flag indicating if this exercise is optional in the program.
   * Indicateur indiquant si cet exercice est optionnel dans le programme.
   */
  isOptional: boolean;
  
  /**
   * Creation timestamp of the program exercise.
   * Horodatage de création de l'exercice de programme.
   */
  createdAt: string;
  
  /**
   * Last update timestamp of the program exercise.
   * Horodatage de dernière mise à jour de l'exercice de programme.
   */
  updatedAt: string;
}

/**
 * Service for managing program exercise operations.
 * Service pour gérer les opérations d'exercices de programme.
 * 
 * This service provides methods to retrieve and manage exercises
 * within training programs. It handles the relationship between
 * exercises and training programs, including program-specific
 * parameters like sets, reps, and order.
 * 
 * Ce service fournit des méthodes pour récupérer et gérer les exercices
 * dans les programmes d'entraînement. Il gère la relation entre les
 * exercices et les programmes d'entraînement, incluant les paramètres
 * spécifiques au programme comme les séries, répétitions et ordre.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root'
})
export class ProgramExerciseService {
  
  /**
   * Base URL for the program exercise API endpoints.
   * URL de base pour les endpoints API d'exercices de programme.
   */
  private apiUrl = `${environment.apiUrl}/program-exercises`;

  /**
   * Constructor for ProgramExerciseService.
   * Constructeur pour ProgramExerciseService.
   * 
   * @param http - Angular HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Get all exercises for a specific training program by its ID.
   * Récupérer tous les exercices d'un programme d'entraînement par son ID.
   * 
   * This method retrieves all exercises associated with a specific
   * training program, including their program-specific parameters
   * such as order, sets, reps, and duration.
   * 
   * Cette méthode récupère tous les exercices associés à un programme
   * d'entraînement spécifique, incluant leurs paramètres spécifiques
   * au programme tels que l'ordre, les séries, répétitions et durée.
   * 
   * @param programId - Unique identifier of the training program
   * @returns Observable<ProgramExercise[]> - List of program exercises
   * @throws Error - If program doesn't exist or access is denied
   */
  getExercisesByProgramId(programId: number): Observable<ProgramExercise[]> {
    return this.http.get<ProgramExercise[]>(`${this.apiUrl}/program/${programId}`);
  }

  /**
   * Get a specific program exercise by its ID.
   * Récupérer un exercice de programme spécifique par son ID.
   * 
   * This method retrieves a specific program exercise by its unique
   * identifier. It returns the complete exercise information including
   * both exercise details and program-specific parameters.
   * 
   * Cette méthode récupère un exercice de programme spécifique par
   * son identifiant unique. Elle retourne les informations complètes
   * de l'exercice incluant à la fois les détails de l'exercice et
   * les paramètres spécifiques au programme.
   * 
   * @param id - Unique identifier of the program exercise
   * @returns Observable<ProgramExercise> - Program exercise details
   * @throws Error - If program exercise doesn't exist or access is denied
   */
  getProgramExerciseById(id: number): Observable<ProgramExercise> {
    return this.http.get<ProgramExercise>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add an exercise to a training program.
   * Ajouter un exercice à un programme d'entraînement.
   * 
   * This method adds a new exercise to an existing training program
   * with specific parameters like sets, reps, duration, and rest periods.
   * It creates a new program exercise entry that links an exercise
   * to a training program with program-specific settings.
   * 
   * Cette méthode ajoute un nouvel exercice à un programme d'entraînement
   * existant avec des paramètres spécifiques comme les séries, répétitions,
   * durée et périodes de repos. Elle crée une nouvelle entrée d'exercice
   * de programme qui lie un exercice à un programme d'entraînement avec
   * des paramètres spécifiques au programme.
   * 
   * @param programId - ID of the training program to add the exercise to
   * @param exerciseData - Exercise data including parameters and settings
   * @returns Observable<ProgramExercise> - Created program exercise
   * @throws Error - If program or exercise doesn't exist, or validation fails
   */
  addExerciseToProgram(programId: number, exerciseData: any): Observable<ProgramExercise> {
    return this.http.post<ProgramExercise>(`${this.apiUrl}/program/${programId}`, exerciseData);
  }
} 