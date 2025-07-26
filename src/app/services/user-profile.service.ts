import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '../models/user-profile.model';

/**
 * Interface for creating a user profile with email (public endpoint).
 * Interface pour créer un profil utilisateur avec email (endpoint public).
 * 
 * This interface is used for the public endpoint that allows creating
 * user profiles during the registration process without requiring
 * prior authentication.
 * 
 * Cette interface est utilisée pour l'endpoint public qui permet de créer
 * des profils utilisateur pendant le processus d'enregistrement sans
 * nécessiter d'authentification préalable.
 */
export interface CreateUserProfileWithEmailRequest {
  /**
   * User's email address.
   * Adresse email de l'utilisateur.
   */
  email: string;
  
  /**
   * User's first name.
   * Prénom de l'utilisateur.
   */
  firstName: string;
  
  /**
   * User's last name.
   * Nom de famille de l'utilisateur.
   */
  lastName: string;
  
  /**
   * User's date of birth in ISO string format.
   * Date de naissance de l'utilisateur au format chaîne ISO.
   */
  dateOfBirth: string;
  
  /**
   * User's phone number (optional).
   * Numéro de téléphone de l'utilisateur (optionnel).
   */
  phoneNumber?: string;
}

/**
 * Service for managing user profile operations.
 * Service pour gérer les opérations de profil utilisateur.
 * 
 * This service provides methods to create, read, update, and delete
 * user profiles. It handles both authenticated and public endpoints
 * for profile management operations.
 * 
 * Ce service fournit des méthodes pour créer, lire, mettre à jour et
 * supprimer des profils utilisateur. Il gère à la fois les endpoints
 * authentifiés et publics pour les opérations de gestion de profil.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  /**
   * Base URL for the user profile API endpoints.
   * URL de base pour les endpoints API de profil utilisateur.
   */
  private readonly apiUrl = 'http://localhost:8080/api/profiles';

  /**
   * Constructor for UserProfileService.
   * Constructeur pour UserProfileService.
   * 
   * @param http - Angular HTTP client for making API requests
   */
  constructor(private http: HttpClient) {}

  /**
   * Create a new user profile (requires authentication).
   * Créer un nouveau profil utilisateur (nécessite une authentification).
   * 
   * This method creates a new user profile for the currently authenticated user.
   * It requires a valid authentication token and uses the CreateUserProfileRequest
   * interface for the request payload.
   * 
   * Cette méthode crée un nouveau profil utilisateur pour l'utilisateur
   * actuellement authentifié. Elle nécessite un token d'authentification
   * valide et utilise l'interface CreateUserProfileRequest pour le payload.
   * 
   * @param request - Profile creation request data
   * @returns Observable<UserProfile> - Created user profile
   * @throws Error - If authentication fails or request is invalid
   */
  createProfile(request: CreateUserProfileRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, request);
  }

  /**
   * Create a new user profile by email (public endpoint for new users).
   * Créer un nouveau profil utilisateur par email (endpoint public pour les nouveaux utilisateurs).
   * 
   * This method creates a user profile using the public endpoint, typically
   * used during the registration process. It doesn't require authentication
   * and uses the CreateUserProfileWithEmailRequest interface.
   * 
   * Cette méthode crée un profil utilisateur en utilisant l'endpoint public,
   * typiquement utilisé pendant le processus d'enregistrement. Elle ne nécessite
   * pas d'authentification et utilise l'interface CreateUserProfileWithEmailRequest.
   * 
   * @param request - Profile creation request with email
   * @returns Observable<UserProfile> - Created user profile
   * @throws Error - If request data is invalid or email already exists
   */
  createProfileByEmail(request: CreateUserProfileWithEmailRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/public`, request);
  }

  /**
   * Get current user's profile.
   * Obtenir le profil de l'utilisateur actuel.
   * 
   * This method retrieves the profile of the currently authenticated user.
   * It requires a valid authentication token and returns the complete
   * user profile information.
   * 
   * Cette méthode récupère le profil de l'utilisateur actuellement
   * authentifié. Elle nécessite un token d'authentification valide
   * et retourne les informations complètes du profil utilisateur.
   * 
   * @returns Observable<UserProfile> - Current user's profile
   * @throws Error - If authentication fails or profile doesn't exist
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  /**
   * Get user profile by ID.
   * Obtenir le profil utilisateur par ID.
   * 
   * This method retrieves a user profile by its unique identifier.
   * It can be used to get profiles of other users if the current
   * user has appropriate permissions.
   * 
   * Cette méthode récupère un profil utilisateur par son identifiant unique.
   * Elle peut être utilisée pour obtenir les profils d'autres utilisateurs
   * si l'utilisateur actuel a les permissions appropriées.
   * 
   * @param userId - Unique identifier of the user
   * @returns Observable<UserProfile> - User profile
   * @throws Error - If user doesn't exist or access is denied
   */
  getProfileById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update current user's profile.
   * Mettre à jour le profil de l'utilisateur actuel.
   * 
   * This method updates the profile of the currently authenticated user.
   * It requires a valid authentication token and uses the UpdateUserProfileRequest
   * interface for the request payload.
   * 
   * Cette méthode met à jour le profil de l'utilisateur actuellement
   * authentifié. Elle nécessite un token d'authentification valide
   * et utilise l'interface UpdateUserProfileRequest pour le payload.
   * 
   * @param request - Profile update request data
   * @returns Observable<UserProfile> - Updated user profile
   * @throws Error - If authentication fails or request is invalid
   */
  updateMyProfile(request: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, request);
  }

  /**
   * Delete current user's profile.
   * Supprimer le profil de l'utilisateur actuel.
   * 
   * This method permanently deletes the profile of the currently
   * authenticated user. This action is irreversible and will remove
   * all profile-related data.
   * 
   * Cette méthode supprime définitivement le profil de l'utilisateur
   * actuellement authentifié. Cette action est irréversible et supprimera
   * toutes les données liées au profil.
   * 
   * @returns Observable<void> - Success response
   * @throws Error - If authentication fails or profile doesn't exist
   */
  deleteMyProfile(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }

  /**
   * Check if user has a profile.
   * Vérifier si l'utilisateur a un profil.
   * 
   * This method checks whether the currently authenticated user
   * has an existing profile. It returns true if a profile exists,
   * false otherwise. This is useful for determining if a user
   * needs to complete their profile setup.
   * 
   * Cette méthode vérifie si l'utilisateur actuellement authentifié
   * a un profil existant. Elle retourne true si un profil existe,
   * false sinon. C'est utile pour déterminer si un utilisateur
   * doit compléter la configuration de son profil.
   * 
   * @returns Observable<boolean> - True if profile exists, false otherwise
   */
  hasProfile(): Observable<boolean> {
    return new Observable(observer => {
      this.getMyProfile().subscribe({
        next: () => observer.next(true),
        error: () => observer.next(false),
        complete: () => observer.complete()
      });
    });
  }
} 