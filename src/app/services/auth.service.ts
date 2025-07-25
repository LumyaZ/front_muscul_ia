import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { CreateUserWithProfileRequest, CreateUserWithProfileResponse } from '../models/user-profile.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

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
   * @param request - Données de connexion
   * @returns Observable - Réponse avec utilisateur et token JWT
   */
  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        // Sauvegarder le token JWT retourné par le backend
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Register a new user.
   * Inscription d'un nouvel utilisateur.
   * 
   * @param request - Données d'inscription
   * @returns Observable - Réponse avec utilisateur et token JWT
   */
  signup(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request).pipe(
      tap((response) => {
        // Sauvegarder le token JWT retourné par le backend
        this.saveAuthData(response.user, response.token);
        this.router.navigate(['/dashboard']);
      }),
    );
  }



  /**
   * Save authentication data to localStorage.
   * Sauvegarder les données d'authentification dans localStorage.
   * 
   * @param user - Données utilisateur
   * @param token - Token JWT
   */
  private saveAuthData(user: User, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Get current user from localStorage
   * Récupérer l'utilisateur actuel depuis localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Get current token from localStorage.
   * Récupérer le token actuel depuis localStorage.
   * 
   * @returns string | null - Token JWT ou null
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
