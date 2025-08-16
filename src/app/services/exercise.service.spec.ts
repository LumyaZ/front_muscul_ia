import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExerciseService } from './exercise.service';
import { Exercise, CreateExerciseRequest, UpdateExerciseRequest } from '../models/exercise.model';
import { environment } from '../../environments/environment';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/exercises`;

  const mockExercise: Exercise = {
    id: 1,
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for chest and triceps',
    category: 'Bodyweight',
    muscleGroup: 'Chest',
    equipmentNeeded: 'None',
    difficultyLevel: 'Beginner',
    isActive: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllExercises', () => {
    it('should get all exercises successfully', () => {
      const mockExercises = [mockExercise];
      
      service.getAllExercises().subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].id).toBe(1);
        expect(response[0].name).toBe('Push-ups');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle empty response', () => {
      service.getAllExercises().subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('should handle server error', () => {
      service.getAllExercises().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getExerciseById', () => {
    it('should get exercise by ID successfully', () => {
      const exerciseId = 1;
      
      service.getExerciseById(exerciseId).subscribe(response => {
        expect(response).toEqual(mockExercise);
        expect(response.id).toBe(exerciseId);
        expect(response.name).toBe('Push-ups');
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercise);
    });

    it('should handle exercise not found', () => {
      const exerciseId = 999;

      service.getExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Exercise not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      const exerciseId = 1;

      service.getExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getExercisesByCategory', () => {
    it('should get exercises by category successfully', () => {
      const category = 'Bodyweight';
      const mockExercises = [mockExercise];
      
      service.getExercisesByCategory(category).subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].category).toBe(category);
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle category not found', () => {
      const category = 'InvalidCategory';

      service.getExercisesByCategory(category).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      req.flush({ message: 'Category not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getExercisesByMuscleGroup', () => {
    it('should get exercises by muscle group successfully', () => {
      const muscleGroup = 'Chest';
      const mockExercises = [mockExercise];
      
      service.getExercisesByMuscleGroup(muscleGroup).subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].muscleGroup).toBe(muscleGroup);
      });

      const req = httpMock.expectOne(`${apiUrl}/muscle-group/${muscleGroup}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle muscle group not found', () => {
      const muscleGroup = 'InvalidMuscleGroup';

      service.getExercisesByMuscleGroup(muscleGroup).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/muscle-group/${muscleGroup}`);
      req.flush({ message: 'Muscle group not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getExercisesByDifficulty', () => {
    it('should get exercises by difficulty level successfully', () => {
      const difficultyLevel = 'Beginner';
      const mockExercises = [mockExercise];
      
      service.getExercisesByDifficulty(difficultyLevel).subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].difficultyLevel).toBe(difficultyLevel);
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficultyLevel}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle difficulty level not found', () => {
      const difficultyLevel = 'InvalidDifficulty';

      service.getExercisesByDifficulty(difficultyLevel).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficultyLevel}`);
      req.flush({ message: 'Difficulty level not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchExercises', () => {
    it('should search exercises successfully', () => {
      const searchTerm = 'push';
      const mockExercises = [mockExercise];
      
      service.searchExercises(searchTerm).subscribe(response => {
        expect(response).toEqual(mockExercises);
        expect(response.length).toBe(1);
        expect(response[0].name.toLowerCase()).toContain(searchTerm);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExercises);
    });

    it('should handle empty search results', () => {
      const searchTerm = 'nonexistent';

      service.searchExercises(searchTerm).subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      req.flush([]);
    });

    it('should handle search error', () => {
      const searchTerm = 'error';

      service.searchExercises(searchTerm).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      req.flush({ message: 'Search error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('createExercise', () => {
    it('should create exercise successfully', () => {
      const createRequest = {
        name: 'New Exercise',
        description: 'A new exercise',
        category: 'Strength',
        muscleGroup: 'Chest',
        equipmentNeeded: 'Dumbbells',
        difficultyLevel: 'Intermediate'
      };

      service.createExercise(createRequest).subscribe(response => {
        expect(response).toEqual(mockExercise);
        expect(response.id).toBe(1);
        expect(response.name).toBe('Push-ups');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockExercise);
    });

    it('should handle invalid exercise data', () => {
      const invalidRequest: CreateExerciseRequest = { 
        name: '', 
        description: '', 
        category: '' 
      };

      service.createExercise(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid exercise data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      const createRequest: CreateExerciseRequest = { 
        name: 'Test Exercise', 
        description: 'Test description', 
        category: 'Strength' 
      };

      service.createExercise(createRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateExercise', () => {
    it('should update exercise successfully', () => {
      const exerciseId = 1;
      const updateRequest = {
        name: 'Updated Exercise',
        description: 'Updated description',
        category: 'Strength',
        muscleGroup: 'Chest',
        equipmentNeeded: 'Dumbbells',
        difficultyLevel: 'Advanced'
      };

      service.updateExercise(exerciseId, updateRequest).subscribe(response => {
        expect(response).toEqual(mockExercise);
        expect(response.id).toBe(exerciseId);
        expect(response.name).toBe('Push-ups');
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(mockExercise);
    });

    it('should handle exercise not found for update', () => {
      const exerciseId = 999;
      const updateRequest: CreateExerciseRequest = { 
        name: 'Updated Exercise', 
        description: 'Updated description', 
        category: 'Strength' 
      };

      service.updateExercise(exerciseId, updateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Exercise not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteExercise', () => {
    it('should delete exercise successfully', () => {
      const exerciseId = 1;

      service.deleteExercise(exerciseId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle exercise not found for deletion', () => {
      const exerciseId = 999;

      service.deleteExercise(exerciseId).subscribe({
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
      expect(apiUrl).toBe(`${environment.apiUrl}/exercises`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.getAllExercises().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      const exerciseId = 1;

      service.getExerciseById(exerciseId).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${exerciseId}`);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle bad request errors', () => {
      const searchTerm = '';

      service.searchExercises(searchTerm).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      req.flush({ message: 'Bad request' }, { status: 400, statusText: 'Bad Request' });
    });
  });
}); 