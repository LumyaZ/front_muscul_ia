import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { CreateUserWithProfileRequest, CreateUserWithProfileResponse } from '../models/user-profile.model';

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
 * 
 * This service provides methods to handle user authentication including login,
 * registration, token management, and session handling. It manages JWT tokens
 * and user data in localStorage for persistent sessions.
 * 
 * Ce service fournit des méthodes pour gérer l'authentification utilisateur
 * incluant la connexion, l'inscription, la gestion des tokens et la gestion
 * des sessions. Il gère les tokens JWT et les données utilisateur dans
 * localStorage pour des sessions persistantes.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = environment.apiUrl + '/auth';

  /**
   * Login user with email and password.
   * Connexion utilisateur avec email et mot de passe.
   * 
   * @param request - Login credentials (email and password)
   * @returns Observable<any> - Response with user data and JWT token
   */
  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        // Save JWT token returned by backend
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Register a new user.
   * Inscription d'un nouvel utilisateur.
   * 
   * @param request - Registration data (email, password, confirmPassword)
   * @returns Observable<any> - Response with user data and JWT token
   */
  signup(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        // Save JWT token returned by backend
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Save authentication data to localStorage.
   * Sauvegarder les données d'authentification dans localStorage.
   * 
   * @param user - User data to save
   * @param token - JWT token to save
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Get current user from localStorage.
   * Récupérer l'utilisateur actuel depuis localStorage.
   * 
   * @returns User | null - Current user data or null if not authenticated
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current token from localStorage.
   * Récupérer le token actuel depuis localStorage.
   * 
   * @returns string | null - JWT token or null if not authenticated
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Check if user is authenticated
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout user and clear localStorage
   * Déconnexion utilisateur et nettoyage du localStorage
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.router.navigate(['/login']);
  }

  /**
   * Create a new user with profile in one request
   * Créer un nouvel utilisateur avec profil en une seule requête
   */
  createUserWithProfile(request: CreateUserWithProfileRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-user-with-profile`, request);
  }

  /**
   * Register a new user (legacy method)
   * Inscrire un nouvel utilisateur (méthode legacy)
   */
  signupLegacy(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}
