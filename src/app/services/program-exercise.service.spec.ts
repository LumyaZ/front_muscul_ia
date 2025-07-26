import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramExerciseService, ProgramExercise } from './program-exercise.service';

describe('ProgramExerciseService', () => {
  let service: ProgramExerciseService;
  let httpMock: HttpTestingController;

  const mockProgramExercise: ProgramExercise = {
    id: 1,
    trainingProgramId: 1,
    exerciseId: 1,
    exerciseName: 'Pompes',
    exerciseDescription: 'Exercice de musculation pour les pectoraux',
    exerciseCategory: 'Musculation',
    exerciseMuscleGroup: 'Pectoraux',
    exerciseEquipmentNeeded: 'Poids du corps',
    exerciseDifficultyLevel: 'Débutant',
    orderInProgram: 1,
    setsCount: 3,
    repsCount: 12,
    durationSeconds: 60,
    restDurationSeconds: 90,
    weightKg: 0,
    distanceMeters: 0,
    notes: 'Exercice de base',
    isOptional: false,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
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

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle empty response when no exercises found', () => {
      const programId = 999;

      service.getExercisesByProgramId(programId).subscribe(exercises => {
        expect(exercises).toEqual([]);
        expect(exercises.length).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle HTTP error when retrieving exercises', () => {
      const programId = 1;
      const errorMessage = 'Program not found';

      service.getExercisesByProgramId(programId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle network error when retrieving exercises', () => {
      const programId = 1;

      service.getExercisesByProgramId(programId).subscribe({
        next: () => fail('should have failed with network error'),
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
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

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProgramExercise);
    });

    it('should handle HTTP error when retrieving specific exercise', () => {
      const exerciseId = 999;
      const errorMessage = 'Exercise not found';

      service.getProgramExerciseById(exerciseId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error when retrieving specific exercise', () => {
      const exerciseId = 1;
      const errorMessage = 'Internal server error';

      service.getProgramExerciseById(exerciseId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('API URL construction', () => {
    it('should use correct API base URL', () => {
      const programId = 1;
      const mockExercises = [mockProgramExercise];

      service.getExercisesByProgramId(programId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      expect(req.request.url).toContain('http://localhost:8080/api/program-exercises/program/');
      req.flush(mockExercises);
    });

    it('should construct correct URL for individual exercise', () => {
      const exerciseId = 1;

      service.getProgramExerciseById(exerciseId).subscribe();

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/${exerciseId}`);
      expect(req.request.url).toContain('http://localhost:8080/api/program-exercises/');
      req.flush(mockProgramExercise);
    });
  });

  describe('Data transformation', () => {
    it('should correctly map all exercise properties', () => {
      const programId = 1;
      const mockExercises = [mockProgramExercise];

      service.getExercisesByProgramId(programId).subscribe(exercises => {
        const exercise = exercises[0];
        expect(exercise.id).toBe(mockProgramExercise.id);
        expect(exercise.trainingProgramId).toBe(mockProgramExercise.trainingProgramId);
        expect(exercise.exerciseId).toBe(mockProgramExercise.exerciseId);
        expect(exercise.exerciseName).toBe(mockProgramExercise.exerciseName);
        expect(exercise.exerciseDescription).toBe(mockProgramExercise.exerciseDescription);
        expect(exercise.exerciseCategory).toBe(mockProgramExercise.exerciseCategory);
        expect(exercise.exerciseMuscleGroup).toBe(mockProgramExercise.exerciseMuscleGroup);
        expect(exercise.exerciseEquipmentNeeded).toBe(mockProgramExercise.exerciseEquipmentNeeded);
        expect(exercise.exerciseDifficultyLevel).toBe(mockProgramExercise.exerciseDifficultyLevel);
        expect(exercise.orderInProgram).toBe(mockProgramExercise.orderInProgram);
        expect(exercise.setsCount).toBe(mockProgramExercise.setsCount);
        expect(exercise.repsCount).toBe(mockProgramExercise.repsCount);
        expect(exercise.durationSeconds).toBe(mockProgramExercise.durationSeconds);
        expect(exercise.restDurationSeconds).toBe(mockProgramExercise.restDurationSeconds);
        expect(exercise.weightKg).toBe(mockProgramExercise.weightKg);
        expect(exercise.distanceMeters).toBe(mockProgramExercise.distanceMeters);
        expect(exercise.notes).toBe(mockProgramExercise.notes);
        expect(exercise.isOptional).toBe(mockProgramExercise.isOptional);
        expect(exercise.createdAt).toBe(mockProgramExercise.createdAt);
        expect(exercise.updatedAt).toBe(mockProgramExercise.updatedAt);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      req.flush(mockExercises);
    });

    it('should handle optional fields correctly', () => {
      const programId = 1;
      const exerciseWithOptionalFields = {
        ...mockProgramExercise,
        notes: null,
        weightKg: null,
        distanceMeters: null,
        isOptional: null
      };

      service.getExercisesByProgramId(programId).subscribe(exercises => {
        const exercise = exercises[0];
        expect(exercise.notes).toBeNull();
        expect(exercise.weightKg).toBeNull();
        expect(exercise.distanceMeters).toBeNull();
        expect(exercise.isOptional).toBeNull();
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/program-exercises/program/${programId}`);
      req.flush([exerciseWithOptionalFields]);
    });
  });
}); 