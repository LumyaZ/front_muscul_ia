import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainingSessionService } from './training-session.service';
import { CreateTrainingSessionRequest, TrainingSession } from '../models/training-session.model';
import { environment } from '../../environments/environment';

describe('TrainingSessionService', () => {
  let service: TrainingSessionService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/training-sessions`;

  const mockTrainingSession: TrainingSession = {
    id: 1,
    name: 'Test Training Session',
    description: 'Test description',
    sessionDate: '2024-01-01T10:00:00Z',
    sessionType: 'Cardio',
    trainingProgramId: 1,
    durationMinutes: 60,
    userId: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  const mockCreateRequest: CreateTrainingSessionRequest = {
    name: 'Test Training Session',
    description: 'Test description',
    sessionDate: '2024-01-01T10:00:00Z',
    durationMinutes: 60,
    sessionType: 'Cardio',
    trainingProgramId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrainingSessionService]
    });
    service = TestBed.inject(TrainingSessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTrainingSession', () => {
    it('should create a training session successfully', () => {
      service.createTrainingSession(mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
        expect(response.id).toBe(1);
        expect(response.name).toBe('Test Training Session');
        expect(response.sessionType).toBe('Cardio');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingSession);
    });

    it('should handle invalid request data', () => {
      const invalidRequest = { ...mockCreateRequest, name: '' };

      service.createTrainingSession(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid request data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      service.createTrainingSession(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTrainingSession', () => {
    it('should get a training session by ID successfully', () => {
      const sessionId = 1;
      
      service.getTrainingSession(sessionId).subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
        expect(response.id).toBe(sessionId);
        expect(response.name).toBe('Test Training Session');
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingSession);
    });

    it('should handle session not found', () => {
      const sessionId = 999;

      service.getTrainingSession(sessionId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      req.flush({ message: 'Training session not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateTrainingSession', () => {
    it('should update a training session successfully', () => {
      const sessionId = 1;
      
      service.updateTrainingSession(sessionId, mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
        expect(response.id).toBe(sessionId);
        expect(response.name).toBe('Test Training Session');
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingSession);
    });

    it('should handle session not found for update', () => {
      const sessionId = 999;

      service.updateTrainingSession(sessionId, mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      req.flush({ message: 'Training session not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getUserTrainingSessions', () => {
    it('should get user training sessions successfully', () => {
      const mockSessions = [mockTrainingSession];
      
      service.getUserTrainingSessions().subscribe(response => {
        expect(response).toEqual(mockSessions);
        expect(response.length).toBe(1);
        expect(response[0].userId).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should handle empty response', () => {
      service.getUserTrainingSessions().subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('should handle server error', () => {
      service.getUserTrainingSessions().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getUserTrainingSessionsWithPagination', () => {
    it('should get user training sessions with pagination successfully', () => {
      const userId = 1;
      const page = 0;
      const size = 10;
      const mockPaginatedResponse = {
        content: [mockTrainingSession],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0
      };
      
      service.getUserTrainingSessionsWithPagination(userId, page, size).subscribe(response => {
        expect(response).toEqual(mockPaginatedResponse);
        expect(response.content.length).toBe(1);
        expect(response.totalElements).toBe(1);
        expect(response.currentPage).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle empty paginated response', () => {
      const userId = 1;
      const page = 0;
      const size = 10;
      const mockEmptyResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: 0
      };

      service.getUserTrainingSessionsWithPagination(userId, page, size).subscribe(response => {
        expect(response).toEqual(mockEmptyResponse);
        expect(response.content.length).toBe(0);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}?page=${page}&size=${size}`);
      req.flush(mockEmptyResponse);
    });

    it('should handle user not found', () => {
      const userId = 999;
      const page = 0;
      const size = 10;

      service.getUserTrainingSessionsWithPagination(userId, page, size).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}?page=${page}&size=${size}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getTrainingSessionsByDateRange', () => {
    it('should get training sessions by date range successfully', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByDateRange(startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockSessions);
        expect(response.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should handle invalid date range', () => {
      const startDate = '2024-01-31';
      const endDate = '2024-01-01';

      service.getTrainingSessionsByDateRange(startDate, endDate).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`);
      req.flush({ message: 'Invalid date range' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getTrainingSessionsByType', () => {
    it('should get training sessions by type successfully', () => {
      const sessionType = 'Cardio';
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByType(sessionType).subscribe(response => {
        expect(response).toEqual(mockSessions);
        expect(response.length).toBe(1);
        expect(response[0].sessionType).toBe(sessionType);
      });

      const req = httpMock.expectOne(`${apiUrl}/type/${sessionType}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should handle type not found', () => {
      const sessionType = 'InvalidType';

      service.getTrainingSessionsByType(sessionType).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/type/${sessionType}`);
      req.flush({ message: 'Session type not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getTrainingSessionsByProgram', () => {
    it('should get training sessions by program successfully', () => {
      const trainingProgramId = 1;
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByProgram(trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockSessions);
        expect(response.length).toBe(1);
        expect(response[0].trainingProgramId).toBe(trainingProgramId);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should handle program not found', () => {
      const trainingProgramId = 999;

      service.getTrainingSessionsByProgram(trainingProgramId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${trainingProgramId}`);
      req.flush({ message: 'Training program not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchTrainingSessionsByName', () => {
    it('should search training sessions by name successfully', () => {
      const name = 'Test';
      const mockSessions = [mockTrainingSession];
      
      service.searchTrainingSessionsByName(name).subscribe(response => {
        expect(response).toEqual(mockSessions);
        expect(response.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${name}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });

    it('should handle empty search results', () => {
      const name = 'Nonexistent';

      service.searchTrainingSessionsByName(name).subscribe(response => {
        expect(response).toEqual([]);
        expect(response.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${name}`);
      req.flush([]);
    });
  });

  describe('getMostRecentTrainingSession', () => {
    it('should get most recent training session successfully', () => {
      service.getMostRecentTrainingSession().subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
        expect(response.id).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/recent`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingSession);
    });

    it('should handle no recent sessions', () => {
      service.getMostRecentTrainingSession().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/recent`);
      req.flush({ message: 'No recent training sessions' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getTrainingSessionsCount', () => {
    it('should get training sessions count successfully', () => {
      const mockCount = 5;
      
      service.getTrainingSessionsCount().subscribe(response => {
        expect(response).toEqual(mockCount);
        expect(response).toBe(5);
      });

      const req = httpMock.expectOne(`${apiUrl}/count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCount);
    });
  });

  describe('deleteTrainingSession', () => {
    it('should delete training session successfully', () => {
      const sessionId = 1;
      
      service.deleteTrainingSession(sessionId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle session not found for deletion', () => {
      const sessionId = 999;

      service.deleteTrainingSession(sessionId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      req.flush({ message: 'Training session not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/training-sessions`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.getUserTrainingSessions().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      service.createTrainingSession(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized errors', () => {
      service.getUserTrainingSessions().subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
}); 