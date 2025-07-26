import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TrainingProgram {
  id: number;
  name: string;
  description: string;
  difficultyLevel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  category: string;
  targetAudience: string;
  equipmentRequired: string;
  isPublic: boolean;
  isActive: boolean;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingProgramRequest {
  name: string;
  description: string;
  difficultyLevel: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  category: string;
  targetAudience: string;
  equipmentRequired: string;
  isPublic: boolean;
  exercises: ProgramExerciseRequest[];
}

export interface ProgramExerciseRequest {
  exerciseId: number;
  orderInProgram: number;
  setsCount: number;
  repsCount?: number;
  durationSeconds?: number;
  restDurationSeconds: number;
  weightKg?: number;
  isOptional: boolean;
}

export interface UpdateTrainingProgramRequest {
  name?: string;
  description?: string;
  difficultyLevel?: string;
  durationWeeks?: number;
  sessionsPerWeek?: number;
  estimatedDurationMinutes?: number;
  category?: string;
  targetAudience?: string;
  equipmentRequired?: string;
  isPublic?: boolean;
  exercises?: ProgramExerciseRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainingProgramService {
  private apiUrl = `${environment.apiUrl}/training-programs`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les programmes publics
  getPublicPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/public`);
  }

  // Récupérer tous les programmes de l'utilisateur connecté
  getUserPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/user`);
  }

  // Récupérer un programme par ID
  getProgramById(id: number): Observable<TrainingProgram> {
    return this.http.get<TrainingProgram>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau programme
  createProgram(program: CreateTrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(this.apiUrl, program);
  }

  // Mettre à jour un programme
  updateProgram(id: number, program: UpdateTrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.put<TrainingProgram>(`${this.apiUrl}/${id}`, program);
  }

  // Supprimer un programme
  deleteProgram(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Rechercher des programmes
  searchPrograms(
    name?: string,
    difficultyLevel?: string,
    category?: string,
    targetAudience?: string,
    isPublic?: boolean
  ): Observable<TrainingProgram[]> {
    let params = new HttpParams();
    
    if (name) params = params.set('name', name);
    if (difficultyLevel) params = params.set('difficultyLevel', difficultyLevel);
    if (category) params = params.set('category', category);
    if (targetAudience) params = params.set('targetAudience', targetAudience);
    if (isPublic !== undefined) params = params.set('isPublic', isPublic.toString());

    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/search`, { params });
  }

  // Récupérer les programmes par difficulté
  getProgramsByDifficulty(difficulty: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/difficulty/${difficulty}`);
  }

  // Récupérer les programmes par catégorie
  getProgramsByCategory(category: string): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/category/${category}`);
  }
} 