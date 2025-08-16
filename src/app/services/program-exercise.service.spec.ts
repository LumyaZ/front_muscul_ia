import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProgramExerciseService } from './program-exercise.service';
import { ProgramExercise, CreateProgramExerciseRequest } from '../models/program-exercise.model';
import { environment } from '../../environments/environment';

describe('ProgramExerciseService', () => {
  let service: ProgramExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/program-exercises`;

  const mockProgramExercise: ProgramExercise = {
    id: 1,
    trainingProgramId: 1,
    exerciseId: 1,
    exerciseName: 'Push-ups',
    exerciseDescription: 'Classic push-ups for chest and triceps',
    exerciseCategory: 'Strength',
    exerciseMuscleGroup: 'Chest',
    exerciseEquipmentNeeded: 'None',
    exerciseDifficultyLevel: 'Beginner',
    setsCount: 3,
    repsCount: 10,
    restDurationSeconds: 60,
    weightKg: 0,
    distanceMeters: 0,
    notes: 'Test exercise'
  };

  const mockCreateRequest: CreateProgramExerciseRequest = {
    trainingProgramId: 1,
    exerciseId: 1,
    setsCount: 3,
    repsCount: 12,
    restDurationSeconds: 90,
    weightKg: 0,
    notes: 'Test exercise'
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
    it('should get exercises for a program successfully', () => {
      const programId = 1;
      const mockExercises = [mockProgramExercise];

      service.getExercisesByProgramId(programId).subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].id).toBe(1);
        expect(response[0].exerciseName).toBe('Push-ups');
        expect(response[0].trainingProgramId).toBe(programId);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle empty response when no exercises found', () => {
      const programId = 999;

      service.getExercisesByProgramId(programId).subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle server error', () => {
      const programId = 1;

      service.getExercisesByProgramId(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle program not found', () => {
      const programId = 999;

      service.getExercisesByProgramId(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getProgramExerciseById', () => {
    it('should get program exercise by ID successfully', () => {
      const exerciseId = 1;

      service.getProgramExerciseById(exerciseId).subscribe(response => {
        expect(response).toEqual(mockProgramExercise);
        expect(response.id).toBe(exerciseId);
        expect(response.exerciseName).toBe('Push-ups');
        expect(response.trainingProgramId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProgramExercise);
    });

    it('should handle exercise not found', () => {
      const exerciseId = 999;

      service.getProgramExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Exercise not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      const exerciseId = 1;

      service.getProgramExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addExerciseToProgram', () => {
    it('should add exercise to program successfully', () => {
      const programId = 1;

      service.addExerciseToProgram(programId, mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockProgramExercise);
        expect(response.id).toBe(1);
        expect(response.trainingProgramId).toBe(programId);
        expect(response.exerciseId).toBe(mockCreateRequest.exerciseId);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockProgramExercise);
    });

    it('should handle invalid exercise data', () => {
      const programId = 1;
      const invalidRequest = { ...mockCreateRequest, exerciseId: -1 };

      service.addExerciseToProgram(programId, invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.flush({ message: 'Invalid exercise data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle program not found', () => {
      const programId = 999;

      service.addExerciseToProgram(programId, mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      const programId = 1;

      service.addExerciseToProgram(programId, mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('createProgramExercise', () => {
    it('should create program exercise successfully', () => {
      service.createProgramExercise(mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockProgramExercise);
        expect(response.id).toBe(1);
        expect(response.trainingProgramId).toBe(mockCreateRequest.trainingProgramId);
        expect(response.exerciseId).toBe(mockCreateRequest.exerciseId);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${mockCreateRequest.trainingProgramId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockProgramExercise);
    });

    it('should handle invalid request data', () => {
      const invalidRequest = { ...mockCreateRequest, trainingProgramId: -1 };

      service.createProgramExercise(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${invalidRequest.trainingProgramId}`);
      req.flush({ message: 'Invalid request data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      service.createProgramExercise(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${mockCreateRequest.trainingProgramId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateProgramExercise', () => {
    it('should update program exercise successfully', () => {
      const exerciseId = 1;
      const updateData: CreateProgramExerciseRequest = {
        trainingProgramId: 1,
        exerciseId: 1,
        setsCount: 4,
        repsCount: 15,
        restDurationSeconds: 90,
        weightKg: 0,
        notes: 'Updated exercise'
      };

      const updatedExercise = { ...mockProgramExercise, ...updateData };

      service.updateProgramExercise(exerciseId, updateData).subscribe(response => {
        expect(response).toEqual(updatedExercise);
        expect(response.setsCount).toBe(4);
        expect(response.repsCount).toBe(15);
        expect(response.notes).toBe('Updated exercise');
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedExercise);
    });

    it('should handle exercise not found for update', () => {
      const exerciseId = 999;
      const updateData: CreateProgramExerciseRequest = {
        trainingProgramId: 1,
        exerciseId: 1,
        setsCount: 4,
        repsCount: 10,
        restDurationSeconds: 60,
        weightKg: 0,
        notes: 'Test exercise'
      };

      service.updateProgramExercise(exerciseId, updateData).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Exercise not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteProgramExercise', () => {
    it('should delete program exercise successfully', () => {
      const exerciseId = 1;

      service.deleteProgramExercise(exerciseId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle exercise not found for deletion', () => {
      const exerciseId = 999;

      service.deleteProgramExercise(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Exercise not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/program-exercises`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const programId = 1;

      service.getExercisesByProgramId(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${programId}`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      const exerciseId = 1;

      service.getProgramExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });
  });
}); 