import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserTrainingProgramService } from './user-training-program.service';
import { UserTrainingProgram } from '../models/user-training-program.model';
import { environment } from '../../environments/environment';

describe('UserTrainingProgramService', () => {
  let service: UserTrainingProgramService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/user-training-programs`;

  const mockUserTrainingProgram: UserTrainingProgram = {
    id: 1,
    user: {
      id: 1,
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    trainingProgram: {
      id: 1,
      name: 'Programme Débutant',
      description: 'Description du programme',
      category: 'Musculation',
      difficultyLevel: 'Débutant',
      targetAudience: 'Débutants',
      createdByUserId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    userId: 1,
    trainingProgramId: 1,
    trainingProgramName: 'Programme Débutant',
    trainingProgramDescription: 'Description du programme',
    trainingProgramDifficultyLevel: 'Débutant',
    trainingProgramCategory: 'Musculation'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserTrainingProgramService]
    });
    service = TestBed.inject(UserTrainingProgramService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserPrograms', () => {
    it('should get user training programs successfully', () => {
      const userId = 1;
      const mockPrograms = [mockUserTrainingProgram];
      
      service.getUserPrograms(userId).subscribe(response => {
        expect(response).toEqual(mockPrograms);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('subscribeUserToProgram', () => {
    it('should subscribe user to program successfully', () => {
      const userId = 1;
      const trainingProgramId = 1;
      
      service.subscribeUserToProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockUserTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUserTrainingProgram);
    });
  });

  describe('unsubscribeUserFromProgram', () => {
    it('should unsubscribe user from program successfully', () => {
      const userId = 1;
      const trainingProgramId = 1;
      
      service.unsubscribeUserFromProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/unsubscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getUserProgram', () => {
    it('should get user program successfully', () => {
      const userId = 1;
      const trainingProgramId = 1;
      
      service.getUserProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockUserTrainingProgram);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserTrainingProgram);
    });
  });
}); 