import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrainingProgram } from '../models/training-program.model';

/**
 * Service for AI-powered training program generation.
 * Service pour la génération de programmes d'entraînement avec l'IA.
 */
@Injectable({
  providedIn: 'root'
})
export class AITrainingService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/ai-training`;

  /**
   * Generate a personalized training program using AI.
   * Générer un programme d'entraînement personnalisé avec l'IA.
   */
  generateProgramWithAI(userId: number): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(`${this.apiUrl}/generate`, null, {
      params: { userId: userId.toString() }
    });
  }

  /**
   * Test the connection with the AI service.
   * Tester la connexion avec le service IA.
   */
  testAIConnection(): Observable<{ connected: boolean; message: string }> {
    return this.http.post<{ connected: boolean; message: string }>(`${this.apiUrl}/test-connection`, null);
  }

  /**
   * Get AI service status and health information.
   * Obtenir le statut et les informations de santé du service IA.
   */
  getAIStatus(): Observable<{
    service: string;
    status: string;
    ai_connected: boolean;
    timestamp: number;
    error?: string;
  }> {
    return this.http.get<{
      service: string;
      status: string;
      ai_connected: boolean;
      timestamp: number;
      error?: string;
    }>(`${this.apiUrl}/status`);
  }
} 