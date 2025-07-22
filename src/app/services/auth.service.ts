import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

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

  private apiUrl = environment.apiUrl + '/auth';

  /**
   * Login user with email and password
   * Connexion utilisateur avec email et mot de passe
   */
  login(request: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, request).pipe(
      tap((user) => {
        // Générer un token simple (en production, le back devrait le fournir)
        const token = this.generateToken();
        // Sauvegarder dans localStorage
        this.saveAuthData(user, token);
        // Naviguer vers le dashboard
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Register a new user
   * Inscription d'un nouvel utilisateur
   */
  signup(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, request).pipe(
      tap((user) => {
        // Générer un token simple (en production, le back devrait le fournir)
        const token = this.generateToken();
        // Sauvegarder dans localStorage
        this.saveAuthData(user, token);
        // Naviguer vers le dashboard
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  /**
   * Generate a simple token (in production, this should come from the backend)
   * Générer un token simple (en production, cela devrait venir du backend)
   */
  private generateToken(): string {
    return (
      'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  /**
   * Save authentication data to localStorage
   * Sauvegarder les données d'authentification dans localStorage
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
   * Get current token from localStorage
   * Récupérer le token actuel depuis localStorage
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
}
