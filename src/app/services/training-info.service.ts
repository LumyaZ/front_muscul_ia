import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  TrainingInfo, 
  CreateTrainingInfoRequest, 
  UpdateTrainingInfoRequest 
} from '../models/training-info.model';

/**
 * Service for managing training information operations.
 * Service pour gérer les opérations d'informations d'entraînement.
 * 
 * This service provides methods to create, read, update, and delete
 * training information for users. It handles all CRUD operations
 * related to user training preferences, goals, and settings.
 * 
 * Ce service fournit des méthodes pour créer, lire, mettre à jour et
 * supprimer les informations d'entraînement des utilisateurs. Il gère
 * toutes les opérations CRUD liées aux préférences d'entraînement,
 * objectifs et paramètres des utilisateurs.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingInfoService {
  
  /**
   * Base URL for the training info API endpoints.
   * URL de base pour les endpoints API d'informations d'entraînement.
   */
  private readonly apiUrl = 'http://localhost:8080/api/training-info';

  /**
   * Constructor for TrainingInfoService.
   * Constructeur pour TrainingInfoService.
   * 
   * @param http - Angular HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Create training information for the current user.
   * Créer les informations d'entraînement pour l'utilisateur actuel.
   * 
   * This method creates new training information for the currently
   * authenticated user. It requires a valid authentication token and
   * uses the CreateTrainingInfoRequest interface for the request payload.
   * 
   * Cette méthode crée de nouvelles informations d'entraînement pour
   * l'utilisateur actuellement authentifié. Elle nécessite un token
   * d'authentification valide et utilise l'interface CreateTrainingInfoRequest
   * pour le payload de la requête.
   * 
   * @param request - Training information creation request data
   * @returns Observable<TrainingInfo> - Created training information
   * @throws Error - If authentication fails or request is invalid
   */
  createTrainingInfo(request: CreateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.post<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Get training information for the current user.
   * Obtenir les informations d'entraînement pour l'utilisateur actuel.
   * 
   * This method retrieves the training information of the currently
   * authenticated user. It requires a valid authentication token and
   * returns the complete training information including preferences,
   * goals, and settings.
   * 
   * Cette méthode récupère les informations d'entraînement de
   * l'utilisateur actuellement authentifié. Elle nécessite un token
   * d'authentification valide et retourne les informations complètes
   * d'entraînement incluant les préférences, objectifs et paramètres.
   * 
   * @returns Observable<TrainingInfo> - Current user's training information
   * @throws Error - If authentication fails or training info doesn't exist
   */
  getTrainingInfo(): Observable<TrainingInfo> {
    return this.http.get<TrainingInfo>(this.apiUrl);
  }

  /**
   * Get training information for a specific user by ID.
   * Obtenir les informations d'entraînement pour un utilisateur spécifique par ID.
   * 
   * This method retrieves training information for a specific user
   * by their unique identifier. It can be used to get training
   * information of other users if the current user has appropriate
   * permissions.
   * 
   * Cette méthode récupère les informations d'entraînement pour un
   * utilisateur spécifique par son identifiant unique. Elle peut être
   * utilisée pour obtenir les informations d'entraînement d'autres
   * utilisateurs si l'utilisateur actuel a les permissions appropriées.
   * 
   * @param userId - Unique identifier of the user
   * @returns Observable<TrainingInfo> - User's training information
   * @throws Error - If user doesn't exist or access is denied
   */
  getTrainingInfoByUserId(userId: number): Observable<TrainingInfo> {
    return this.http.get<TrainingInfo>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update training information for the current user.
   * Mettre à jour les informations d'entraînement pour l'utilisateur actuel.
   * 
   * This method updates the training information of the currently
   * authenticated user. It requires a valid authentication token and
   * uses the UpdateTrainingInfoRequest interface for the request payload.
   * 
   * Cette méthode met à jour les informations d'entraînement de
   * l'utilisateur actuellement authentifié. Elle nécessite un token
   * d'authentification valide et utilise l'interface UpdateTrainingInfoRequest
   * pour le payload de la requête.
   * 
   * @param request - Training information update request data
   * @returns Observable<TrainingInfo> - Updated training information
   * @throws Error - If authentication fails or request is invalid
   */
  updateTrainingInfo(request: UpdateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.put<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Delete training information for the current user.
   * Supprimer les informations d'entraînement pour l'utilisateur actuel.
   * 
   * This method permanently deletes the training information of the
   * currently authenticated user. This action is irreversible and
   * will remove all training-related preferences and settings.
   * 
   * Cette méthode supprime définitivement les informations d'entraînement
   * de l'utilisateur actuellement authentifié. Cette action est irréversible
   * et supprimera toutes les préférences et paramètres liés à l'entraînement.
   * 
   * @returns Observable<void> - Success response
   * @throws Error - If authentication fails or training info doesn't exist
   */
  deleteTrainingInfo(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /**
   * Check if training information exists for the current user.
   * Vérifier si les informations d'entraînement existent pour l'utilisateur actuel.
   * 
   * This method checks whether the currently authenticated user
   * has existing training information. It returns true if training
   * information exists, false otherwise. This is useful for determining
   * if a user needs to complete their training information setup.
   * 
   * Cette méthode vérifie si l'utilisateur actuellement authentifié
   * a des informations d'entraînement existantes. Elle retourne true
   * si les informations d'entraînement existent, false sinon. C'est
   * utile pour déterminer si un utilisateur doit compléter la configuration
   * de ses informations d'entraînement.
   * 
   * @returns Observable<boolean> - True if training info exists, false otherwise
   */
  existsTrainingInfo(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists`);
  }
} 