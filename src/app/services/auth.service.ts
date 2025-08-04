import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { CreateUserWithProfileRequest } from '../models/user-profile.model';
import { STORAGE_KEYS } from '../constants/storage.constants';

/**
 * Interface for login request.
 * Interface pour la requête de connexion.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for registration request.
 * Interface pour la requête d'inscription.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Interface for authentication response.
 * Interface pour la réponse d'authentification.
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Service for managing user authentication.
 * Service pour la gestion de l'authentification utilisateur.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /**
   * Login user with email and password.
   * Connexion utilisateur avec email et mot de passe.
   */
  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Register a new user.
   * Inscription d'un nouvel utilisateur.
   */
  signup(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Save authentication data to localStorage.
   * Sauvegarder les données d'authentification dans localStorage.
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  /**
   * Get current user from localStorage.
   * Récupérer l'utilisateur actuel depuis localStorage.
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current token from localStorage.
   * Récupérer le token actuel depuis localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Check if user is authenticated.
   * Vérifier si l'utilisateur est authentifié.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout user and clear localStorage.
   * Déconnexion utilisateur et nettoyage du localStorage.
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.router.navigate(['/login']);
  }

  /**
   * Create a new user with profile in one request.
   * Créer un nouvel utilisateur avec profil en une seule requête.
   */
  createUserWithProfile(request: CreateUserWithProfileRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-user-with-profile`, request);
  }

  /**
   * Register a new user (legacy method - deprecated).
   * Inscrire un nouvel utilisateur (méthode legacy - dépréciée).
   */
  signupLegacy(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}
