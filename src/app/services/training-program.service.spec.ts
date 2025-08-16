import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainingProgramService } from './training-program.service';
import { TrainingProgram, CreateTrainingProgramRequest, UpdateTrainingProgramRequest } from '../models/training-program.model';
import { CreateProgramExerciseRequest } from '../models/program-exercise.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('TrainingProgramService', () => {
  let service: TrainingProgramService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  const apiUrl = `${environment.apiUrl}/training-programs`;

  const mockTrainingProgram: TrainingProgram = {
    id: 1,
    name: 'Beginner Strength Program',
    description: 'A comprehensive strength training program for beginners',
    difficultyLevel: 'BEGINNER',
    category: 'STRENGTH',
    targetAudience: 'BEGINNERS',
    createdByUserId: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  const mockCreateRequest: CreateTrainingProgramRequest = {
    name: 'Beginner Strength Program',
    description: 'A comprehensive strength training program for beginners',
    difficultyLevel: 'BEGINNER',
    category: 'STRENGTH',
    targetAudience: 'BEGINNERS'
  };

  const mockUpdateRequest: UpdateTrainingProgramRequest = {
    name: 'Updated Strength Program',
    description: 'Updated description',
    difficultyLevel: 'INTERMEDIATE'
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue({ id: 1, email: 'test@test.com', creationDate: '2024-01-01' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TrainingProgramService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(TrainingProgramService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPublicPrograms', () => {
    it('should get public programs successfully', () => {
      const mockPrograms = [mockTrainingProgram];
      
      service.getPublicPrograms().subscribe(response => {
        expect(response).toEqual(mockPrograms);
        expect(response.length).toBe(1);
        expect(response[0].id).toBe(1);
        expect(response[0].name).toBe('Beginner Strength Program');
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle empty response', () => {
      service.getPublicPrograms().subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      req.flush([]);
    });

    it('should handle server error', () => {
      service.getPublicPrograms().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserPrograms', () => {
    it('should get user programs successfully', () => {
      const mockPrograms = [mockTrainingProgram];
      
      service.getUserPrograms().subscribe(response => {
        expect(response).toEqual(mockPrograms);
        expect(response.length).toBe(1);
        expect(response[0].createdByUserId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle user not found', () => {
      authService.getCurrentUser.and.returnValue(null);

      service.getUserPrograms().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user`);
      req.flush({ message: 'User not found' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getProgramById', () => {
    it('should get program by ID successfully', () => {
      const programId = 1;
      
      service.getProgramById(programId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
        expect(response.id).toBe(programId);
        expect(response.name).toBe('Beginner Strength Program');
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingProgram);
    });

    it('should handle program not found', () => {
      const programId = 999;

      service.getProgramById(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createProgram', () => {
    it('should create program successfully', () => {
      const userId = 1;
      service.createProgram(mockCreateRequest, userId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
        expect(response.id).toBe(1);
        expect(response.name).toBe('Beginner Strength Program');
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingProgram);
    });

    it('should handle invalid request data', () => {
      const invalidRequest = { ...mockCreateRequest, name: '' };

      const userId = 1;
      service.createProgram(invalidRequest, userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      req.flush({ message: 'Invalid request data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      const userId = 1;
      service.createProgram(mockCreateRequest, userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateProgram', () => {
    it('should update program successfully', () => {
      const programId = 1;
      
      service.updateProgram(programId, mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
        expect(response.id).toBe(programId);
        expect(response.name).toBe('Beginner Strength Program');
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingProgram);
    });

    it('should handle program not found for update', () => {
      const programId = 999;

      service.updateProgram(programId, mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteProgram', () => {
    it('should delete program successfully', () => {
      const programId = 1;
      
      service.deleteProgram(programId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle program not found for deletion', () => {
      const programId = 999;

      service.deleteProgram(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchPrograms', () => {
    it('should search programs successfully', () => {
      const searchParams = {
        name: 'Strength',
        difficultyLevel: 'BEGINNER',
        category: 'STRENGTH',
        targetAudience: 'BEGINNERS'
      };
      const mockPrograms = [mockTrainingProgram];
      
      service.searchPrograms(
        searchParams.name,
        searchParams.difficultyLevel,
        searchParams.category,
        searchParams.targetAudience
      ).subscribe(response => {
        expect(response).toEqual(mockPrograms);
        expect(response.length).toBe(1);
        expect(response[0].name.toLowerCase()).toContain(searchParams.name.toLowerCase());
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${searchParams.name}&difficultyLevel=${searchParams.difficultyLevel}&category=${searchParams.category}&targetAudience=${searchParams.targetAudience}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle empty search results', () => {
      const searchParams = {
        name: 'Nonexistent',
        difficultyLevel: 'BEGINNER',
        category: 'STRENGTH',
        targetAudience: 'BEGINNERS'
      };

      service.searchPrograms(
        searchParams.name,
        searchParams.difficultyLevel,
        searchParams.category,
        searchParams.targetAudience
      ).subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${searchParams.name}&difficultyLevel=${searchParams.difficultyLevel}&category=${searchParams.category}&targetAudience=${searchParams.targetAudience}`);
      req.flush([]);
    });
  });

  describe('getProgramsByDifficulty', () => {
    it('should get programs by difficulty successfully', () => {
      const difficulty = 'BEGINNER';
      const mockPrograms = [mockTrainingProgram];
      
      service.getProgramsByDifficulty(difficulty).subscribe(response => {
        expect(response).toEqual(mockPrograms);
        expect(response.length).toBe(1);
        expect(response[0].difficultyLevel).toBe(difficulty);
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficulty}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle difficulty not found', () => {
      const difficulty = 'INVALID';

      service.getProgramsByDifficulty(difficulty).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficulty}`);
      req.flush({ message: 'Difficulty level not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getProgramsByCategory', () => {
    it('should get programs by category successfully', () => {
      const category = 'STRENGTH';
      const mockPrograms = [mockTrainingProgram];
      
      service.getProgramsByCategory(category).subscribe(response => {
        expect(response).toEqual(mockPrograms);
        expect(response.length).toBe(1);
        expect(response[0].category).toBe(category);
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle category not found', () => {
      const category = 'INVALID';

      service.getProgramsByCategory(category).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      req.flush({ message: 'Category not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addProgramToUser', () => {
    it('should add program to user successfully', () => {
      const programId = 1;
      const mockResponse = { success: true };
      
      service.addProgramToUser(programId).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.success).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=${programId}&userId=1`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle program not found', () => {
      const programId = 999;

      service.addProgramToUser(programId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=${programId}&userId=1`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
      expect(authService).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/training-programs`);
    });

    it('should use AuthService for user information', () => {
      service.addProgramToUser(1).subscribe();
      expect(authService.getCurrentUser).toHaveBeenCalled();
      
      const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=1&userId=1`);
      req.flush({ success: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.getPublicPrograms().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      const userId = 1;
      service.createProgram(mockCreateRequest, userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized errors', () => {
      service.getUserPrograms().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
}); 