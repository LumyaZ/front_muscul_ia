import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  TrainingInfo, 
  CreateTrainingInfoRequest, 
  UpdateTrainingInfoRequest 
} from '../models/training-info.model';

/**
 * Service for managing training information operations.
 * Service pour gérer les opérations d'informations d'entraînement.
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingInfoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/training-info`;

  /**
   * Create training information for the current user.
   * Créer les informations d'entraînement pour l'utilisateur actuel.
   */
  createTrainingInfo(request: CreateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.post<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Get training information for the current user.
   * Obtenir les informations d'entraînement pour l'utilisateur actuel.
   */
  getTrainingInfo(): Observable<TrainingInfo> {
    console.log('🔍 === TRAINING-INFO SERVICE CALLED ===');
    console.log('API URL:', this.apiUrl);
    console.log('localStorage token:', localStorage.getItem('auth_token'));
    console.log('localStorage user:', localStorage.getItem('current_user'));
    
    return this.http.get<TrainingInfo>(this.apiUrl).pipe(
      tap({
        next: (response) => {
          console.log('✅ TrainingInfo API call successful:', response);
        },
        error: (error) => {
          console.log('❌ TrainingInfo API call failed:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          console.log('Error details:', error.error);
        }
      }),
      catchError((error) => {
        console.log('❌ TrainingInfo service error caught:', error);
        throw error;
      })
    );
  }

  /**
   * Get training information for a specific user by ID.
   * Obtenir les informations d'entraînement pour un utilisateur spécifique par ID.
   */
  getTrainingInfoByUserId(userId: number): Observable<TrainingInfo> {
    return this.http.get<TrainingInfo>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update training information for the current user.
   * Mettre à jour les informations d'entraînement pour l'utilisateur actuel.
   */
  updateTrainingInfo(request: UpdateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.put<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Delete training information for the current user.
   * Supprimer les informations d'entraînement pour l'utilisateur actuel.
   */
  deleteTrainingInfo(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /**
   * Check if training information exists for the current user.
   * Vérifier si les informations d'entraînement existent pour l'utilisateur actuel.
   */
  existsTrainingInfo(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists`);
  }
} 