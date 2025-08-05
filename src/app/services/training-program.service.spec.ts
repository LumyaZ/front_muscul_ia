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
      });

      const req = httpMock.expectOne(`${apiUrl}/public`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('getUserPrograms', () => {
    it('should get user programs successfully', () => {
      const mockPrograms = [mockTrainingProgram];
      
      service.getUserPrograms().subscribe(response => {
        expect(response).toEqual(mockPrograms);
      });

      const req = httpMock.expectOne(`${apiUrl}/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('getProgramById', () => {
    it('should get program by ID successfully', () => {
      const programId = 1;
      
      service.getProgramById(programId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingProgram);
    });
  });

  describe('createProgram', () => {
    it('should create program successfully', () => {
      const userId = 1;
      
      service.createProgram(mockCreateRequest, userId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingProgram);
    });
  });

  describe('createProgram', () => {
    it('should create training program successfully', () => {
      const programData = mockCreateRequest;
      const userId = 1;
      
      service.createProgram(programData, userId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}?userId=${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(programData);
      req.flush(mockTrainingProgram);
    });
  });

  describe('updateProgram', () => {
    it('should update program successfully', () => {
      const programId = 1;
      
      service.updateProgram(programId, mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}/${programId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingProgram);
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
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${searchParams.name}&difficultyLevel=${searchParams.difficultyLevel}&category=${searchParams.category}&targetAudience=${searchParams.targetAudience}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('getProgramsByDifficulty', () => {
    it('should get programs by difficulty successfully', () => {
      const difficulty = 'BEGINNER';
      const mockPrograms = [mockTrainingProgram];
      
      service.getProgramsByDifficulty(difficulty).subscribe(response => {
        expect(response).toEqual(mockPrograms);
      });

      const req = httpMock.expectOne(`${apiUrl}/difficulty/${difficulty}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('getProgramsByCategory', () => {
    it('should get programs by category successfully', () => {
      const category = 'STRENGTH';
      const mockPrograms = [mockTrainingProgram];
      
      service.getProgramsByCategory(category).subscribe(response => {
        expect(response).toEqual(mockPrograms);
      });

      const req = httpMock.expectOne(`${apiUrl}/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('addProgramToUser', () => {
    it('should add program to user successfully', () => {
      const programId = 1;
      const mockResponse = { success: true };
      
      service.addProgramToUser(programId).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/subscribe?trainingProgramId=${programId}&userId=1`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
}); 