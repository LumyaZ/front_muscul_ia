import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  TrainingInfo, 
  CreateTrainingInfoRequest, 
  UpdateTrainingInfoRequest 
} from '../models/training-info.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingInfoService {
  private readonly apiUrl = 'http://localhost:8080/api/training-info';

  constructor(private http: HttpClient) {}

  /**
   * Create training information for the current user
   * Créer les informations d'entraînement pour l'utilisateur actuel
   */
  createTrainingInfo(request: CreateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.post<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Get training information for the current user
   * Obtenir les informations d'entraînement pour l'utilisateur actuel
   */
  getTrainingInfo(): Observable<TrainingInfo> {
    return this.http.get<TrainingInfo>(this.apiUrl);
  }

  /**
   * Get training information for a specific user by ID
   * Obtenir les informations d'entraînement pour un utilisateur spécifique par ID
   */
  getTrainingInfoByUserId(userId: number): Observable<TrainingInfo> {
    return this.http.get<TrainingInfo>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update training information for the current user
   * Mettre à jour les informations d'entraînement pour l'utilisateur actuel
   */
  updateTrainingInfo(request: UpdateTrainingInfoRequest): Observable<TrainingInfo> {
    return this.http.put<TrainingInfo>(this.apiUrl, request);
  }

  /**
   * Delete training information for the current user
   * Supprimer les informations d'entraînement pour l'utilisateur actuel
   */
  deleteTrainingInfo(): Observable<void> {
    return this.http.delete<void>(this.apiUrl);
  }

  /**
   * Check if training information exists for the current user
   * Vérifier si les informations d'entraînement existent pour l'utilisateur actuel
   */
  existsTrainingInfo(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists`);
  }
} 