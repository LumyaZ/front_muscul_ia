import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

export interface UserTrainingProgram {
  id: number;
  user: any;
  trainingProgram: any;
  startedAt: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  currentWeek: number;
  currentSession: number;
  completedAt?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: "root"
})
export class UserTrainingProgramService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user-training-programs`;

  /**
   * Get all training programs that a user is subscribed to
   */
  getUserPrograms(userId: number): Observable<UserTrainingProgram[]> {
    return this.http.get<UserTrainingProgram[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Subscribe a user to a training program
   */
  subscribeUserToProgram(userId: number, trainingProgramId: number): Observable<UserTrainingProgram> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('trainingProgramId', trainingProgramId.toString());
    return this.http.post<UserTrainingProgram>(`${this.apiUrl}/subscribe`, null, { params });
  }

  /**
   * Unsubscribe a user from a training program
   */
  unsubscribeUserFromProgram(userId: number, trainingProgramId: number): Observable<void> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('trainingProgramId', trainingProgramId.toString());
    return this.http.delete<void>(`${this.apiUrl}/unsubscribe`, { params });
  }

  /**
   * Check if a user is subscribed to a specific training program
   */
  getUserProgram(userId: number, trainingProgramId: number): Observable<UserTrainingProgram | null> {
    return this.http.get<UserTrainingProgram | null>(`${this.apiUrl}/user/${userId}/program/${trainingProgramId}`);
  }
}
