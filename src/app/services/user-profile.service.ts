import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '../models/user-profile.model';

/**
 * Interface for creating a user profile with email (public endpoint).
 * Interface pour créer un profil utilisateur avec email (endpoint public).
 */
export interface CreateUserProfileWithEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
}

/**
 * Service for managing user profile operations.
 * Service pour gérer les opérations de profil utilisateur.
 */
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/profiles`;

  /**
   * Create a new user profile (requires authentication).
   * Créer un nouveau profil utilisateur (nécessite une authentification).
   */
  createProfile(request: CreateUserProfileRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, request);
  }

  /**
   * Create a new user profile by email (public endpoint for new users).
   * Créer un nouveau profil utilisateur par email (endpoint public pour les nouveaux utilisateurs).
   */
  createProfileByEmail(request: CreateUserProfileWithEmailRequest): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.apiUrl}/public`, request);
  }

  /**
   * Get current user's profile.
   * Obtenir le profil de l'utilisateur actuel.
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`);
  }

  /**
   * Get user profile by ID.
   * Obtenir le profil utilisateur par ID.
   */
  getProfileById(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update current user's profile.
   * Mettre à jour le profil de l'utilisateur actuel.
   */
  updateMyProfile(request: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, request);
  }

  /**
   * Delete current user's profile.
   * Supprimer le profil de l'utilisateur actuel.
   */
  deleteMyProfile(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/me`);
  }

  /**
   * Check if user has a profile.
   * Vérifier si l'utilisateur a un profil.
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