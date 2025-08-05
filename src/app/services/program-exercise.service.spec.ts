import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramExerciseService } from './program-exercise.service';
import { ProgramExercise } from '../models/program-exercise.model';
import { environment } from '../../environments/environment';

describe('ProgramExerciseService', () => {
  let service: ProgramExerciseService;
  let httpMock: HttpTestingController;

  const mockProgramExercise: ProgramExercise = {
    id: 1,
    trainingProgramId: 1,
    exerciseId: 1,
    exerciseName: 'Pompes',
    exerciseDescription: 'Exercice de musculation pour les pectoraux',
    exerciseMuscleGroup: 'Pectoraux',
    orderIndex: 1,
    setsCount: 3,
    repsCount: 12,
    durationSeconds: 60,
    restDurationSeconds: 90,
    weightKg: 0,
    notes: 'Exercice de base',
    isOptional: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProgramExerciseService]
    });

    service = TestBed.inject(ProgramExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getExercisesByProgramId', () => {
    it('should retrieve exercises for a program successfully', () => {
      const programId = 1;
      const mockExercises = [mockProgramExercise];

      service.getExercisesByProgramId(programId).subscribe(exercises => {
        expect(exercises).toEqual(mockExercises);
        expect(exercises.length).toBe(1);
        expect(exercises[0].id).toBe(1);
        expect(exercises[0].exerciseName).toBe('Pompes');
        expect(exercises[0].trainingProgramId).toBe(programId);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle empty response when no exercises found', () => {
      const programId = 999;

      service.getExercisesByProgramId(programId).subscribe(exercises => {
        expect(exercises).toEqual([]);
        expect(exercises.length).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getProgramExerciseById', () => {
    it('should retrieve a specific program exercise successfully', () => {
      const exerciseId = 1;

      service.getProgramExerciseById(exerciseId).subscribe(exercise => {
        expect(exercise).toEqual(mockProgramExercise);
        expect(exercise.id).toBe(exerciseId);
        expect(exercise.exerciseName).toBe('Pompes');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/program-exercises/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProgramExercise);
    });
  });

  describe('addExerciseToProgram', () => {
    it('should add exercise to program successfully', () => {
      const programId = 1;
      const exerciseData = {
        trainingProgramId: 1,
        exerciseId: 1,
        setsCount: 3,
        repsCount: 12,
        restDurationSeconds: 90,
        weightKg: 0,
        notes: 'Test exercise',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      service.addExerciseToProgram(programId, exerciseData).subscribe(exercise => {
        expect(exercise).toEqual(mockProgramExercise);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(exerciseData);
      req.flush(mockProgramExercise);
    });
  });
}); 