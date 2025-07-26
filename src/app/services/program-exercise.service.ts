import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProgramExercise {
  id: number;
  trainingProgramId: number;
  exerciseId: number;
  exerciseName: string;
  exerciseDescription: string;
  exerciseCategory: string;
  exerciseMuscleGroup: string;
  exerciseEquipmentNeeded: string;
  exerciseDifficultyLevel: string;
  orderInProgram: number;
  setsCount: number;
  repsCount: number;
  durationSeconds: number;
  restDurationSeconds: number;
  weightKg: number;
  distanceMeters: number;
  notes: string;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramExerciseService {
  private apiUrl = `${environment.apiUrl}/program-exercises`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer tous les exercices d'un programme par son ID
   * @param programId L'ID du programme
   * @returns Observable avec la liste des exercices du programme
   */
  getExercisesByProgramId(programId: number): Observable<ProgramExercise[]> {
    return this.http.get<ProgramExercise[]>(`${this.apiUrl}/program/${programId}`);
  }

  /**
   * Récupérer un exercice de programme par son ID
   * @param id L'ID de l'exercice de programme
   * @returns Observable avec l'exercice de programme
   */
  getProgramExerciseById(id: number): Observable<ProgramExercise> {
    return this.http.get<ProgramExercise>(`${this.apiUrl}/${id}`);
  }
} 