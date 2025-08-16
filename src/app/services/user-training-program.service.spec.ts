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
        expect(response.length).toBe(1);
        expect(response[0].userId).toBe(userId);
        expect(response[0].trainingProgramId).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });

    it('should handle empty response when user has no programs', () => {
      const userId = 1;

      service.getUserPrograms(userId).subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush([]);
    });

    it('should handle user not found', () => {
      const userId = 999;

      service.getUserPrograms(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      const userId = 1;

      service.getUserPrograms(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('subscribeUserToProgram', () => {
    it('should subscribe user to program successfully', () => {
      const userId = 1;
      const trainingProgramId = 1;
      
      service.subscribeUserToProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockUserTrainingProgram);
        expect(response.userId).toBe(userId);
        expect(response.trainingProgramId).toBe(trainingProgramId);
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUserTrainingProgram);
    });

    it('should handle user not found', () => {
      const userId = 999;
      const trainingProgramId = 1;

      service.subscribeUserToProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle program not found', () => {
      const userId = 1;
      const trainingProgramId = 999;

      service.subscribeUserToProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      req.flush({ message: 'Program not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle already subscribed', () => {
      const userId = 1;
      const trainingProgramId = 1;

      service.subscribeUserToProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      req.flush({ message: 'User already subscribed to this program' }, { status: 409, statusText: 'Conflict' });
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

    it('should handle subscription not found', () => {
      const userId = 1;
      const trainingProgramId = 999;

      service.unsubscribeUserFromProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/unsubscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      req.flush({ message: 'Subscription not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserProgram', () => {
    it('should get user program successfully', () => {
      const userId = 1;
      const trainingProgramId = 1;
      
      service.getUserProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockUserTrainingProgram);
        expect(response?.userId).toBe(userId);
        expect(response?.trainingProgramId).toBe(trainingProgramId);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserTrainingProgram);
    });

    it('should handle user program not found', () => {
      const userId = 1;
      const trainingProgramId = 999;

      service.getUserProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      req.flush({ message: 'User program not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      const userId = 1;
      const trainingProgramId = 1;

      service.getUserProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/user-training-programs`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      const userId = 1;

      service.getUserPrograms(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      const userId = 1;
      const trainingProgramId = 1;

      service.subscribeUserToProgram(userId, trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized errors', () => {
      const userId = 1;

      service.getUserPrograms(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
}); 