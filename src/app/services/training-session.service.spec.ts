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
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingSession);
    });
  });

  describe('getTrainingSession', () => {
    it('should get a training session by ID successfully', () => {
      const sessionId = 1;
      
      service.getTrainingSession(sessionId).subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingSession);
    });
  });

  describe('updateTrainingSession', () => {
    it('should update a training session successfully', () => {
      const sessionId = 1;
      
      service.updateTrainingSession(sessionId, mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
      });

      const req = httpMock.expectOne(`${apiUrl}/${sessionId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingSession);
    });
  });

  describe('getUserTrainingSessions', () => {
    it('should get user training sessions successfully', () => {
      const mockSessions = [mockTrainingSession];
      
      service.getUserTrainingSessions().subscribe(response => {
        expect(response).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
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
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getTrainingSessionsByDateRange', () => {
    it('should get training sessions by date range successfully', () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByDateRange(startDate, endDate).subscribe(response => {
        expect(response).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(`${apiUrl}/date-range?startDate=${startDate}&endDate=${endDate}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('getTrainingSessionsByType', () => {
    it('should get training sessions by type successfully', () => {
      const sessionType = 'Cardio';
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByType(sessionType).subscribe(response => {
        expect(response).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(`${apiUrl}/type/${sessionType}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('getTrainingSessionsByProgram', () => {
    it('should get training sessions by program successfully', () => {
      const trainingProgramId = 1;
      const mockSessions = [mockTrainingSession];
      
      service.getTrainingSessionsByProgram(trainingProgramId).subscribe(response => {
        expect(response).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(`${apiUrl}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('searchTrainingSessionsByName', () => {
    it('should search training sessions by name successfully', () => {
      const name = 'Test';
      const mockSessions = [mockTrainingSession];
      
      service.searchTrainingSessionsByName(name).subscribe(response => {
        expect(response).toEqual(mockSessions);
      });

      const req = httpMock.expectOne(`${apiUrl}/search?name=${name}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('getMostRecentTrainingSession', () => {
    it('should get most recent training session successfully', () => {
      service.getMostRecentTrainingSession().subscribe(response => {
        expect(response).toEqual(mockTrainingSession);
      });

      const req = httpMock.expectOne(`${apiUrl}/recent`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingSession);
    });
  });

  describe('getTrainingSessionsCount', () => {
    it('should get training sessions count successfully', () => {
      const mockCount = 5;
      
      service.getTrainingSessionsCount().subscribe(response => {
        expect(response).toEqual(mockCount);
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
  });
}); 