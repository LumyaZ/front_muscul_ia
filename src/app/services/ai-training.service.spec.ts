import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AITrainingService } from './ai-training.service';
import { environment } from '../../environments/environment';
import { TrainingProgram } from '../models/training-program.model';

describe('AITrainingService', () => {
  let service: AITrainingService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/ai-training`;

  const mockTrainingProgram: TrainingProgram = {
    id: 1,
    name: 'Programme IA Personnalisé',
    description: 'Programme généré par IA basé sur vos préférences',
    difficultyLevel: 'INTERMEDIATE',
    category: 'STRENGTH',
    targetAudience: 'INTERMEDIATE',
    createdByUserId: 1,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  const mockAIConnectionResponse = {
    connected: true,
    message: 'AI service is connected and ready'
  };

  const mockAIStatusResponse = {
    service: 'AI Training Service',
    status: 'healthy',
    ai_connected: true,
    timestamp: 1704067200000,
    error: undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AITrainingService]
    });

    service = TestBed.inject(AITrainingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateProgramWithAI', () => {
    it('should generate AI program successfully', () => {
      const userId = 1;

      service.generateProgramWithAI(userId).subscribe(response => {
        expect(response).toEqual(mockTrainingProgram);
        expect(response.id).toBe(1);
        expect(response.name).toBe('Programme IA Personnalisé');
      });

      const req = httpMock.expectOne(`${apiUrl}/generate?userId=${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockTrainingProgram);
    });

    it('should handle AI generation error', () => {
      const userId = 1;

      service.generateProgramWithAI(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/generate?userId=${userId}`);
      req.flush({ message: 'AI service unavailable' }, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle invalid user ID', () => {
      const userId = -1;

      service.generateProgramWithAI(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/generate?userId=${userId}`);
      req.flush({ message: 'Invalid user ID' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('testAIConnection', () => {
    it('should test AI connection successfully', () => {
      service.testAIConnection().subscribe(response => {
        expect(response).toEqual(mockAIConnectionResponse);
        expect(response.connected).toBe(true);
        expect(response.message).toBe('AI service is connected and ready');
      });

      const req = httpMock.expectOne(`${apiUrl}/test-connection`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeNull();
      req.flush(mockAIConnectionResponse);
    });

    it('should handle connection test failure', () => {
      service.testAIConnection().subscribe({
        error: (error) => {
          expect(error.status).toBe(503);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/test-connection`);
      req.flush({ message: 'AI service unavailable' }, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle AI service not connected', () => {
      const mockNotConnectedResponse = {
        connected: false,
        message: 'AI service is not available'
      };

      service.testAIConnection().subscribe(response => {
        expect(response).toEqual(mockNotConnectedResponse);
        expect(response.connected).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/test-connection`);
      req.flush(mockNotConnectedResponse);
    });
  });

  describe('getAIStatus', () => {
    it('should get AI status successfully', () => {
      service.getAIStatus().subscribe(response => {
        expect(response).toEqual(mockAIStatusResponse);
        expect(response.service).toBe('AI Training Service');
        expect(response.status).toBe('healthy');
        expect(response.ai_connected).toBe(true);
        expect(response.timestamp).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/status`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAIStatusResponse);
    });

    it('should handle AI status with error', () => {
      const mockStatusWithError = {
        service: 'AI Training Service',
        status: 'error',
        ai_connected: false,
        timestamp: 1704067200000,
        error: 'AI model not loaded'
      };

      service.getAIStatus().subscribe(response => {
        expect(response).toEqual(mockStatusWithError);
        expect(response.status).toBe('error');
        expect(response.ai_connected).toBe(false);
        expect(response.error).toBe('AI model not loaded');
      });

      const req = httpMock.expectOne(`${apiUrl}/status`);
      req.flush(mockStatusWithError);
    });

    it('should handle status service unavailable', () => {
      service.getAIStatus().subscribe({
        error: (error) => {
          expect(error.status).toBe(503);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/status`);
      req.flush({ message: 'Service unavailable' }, { status: 503, statusText: 'Service Unavailable' });
    });

    it('should handle network error', () => {
      service.getAIStatus().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/status`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/ai-training`);
    });
  });

  describe('Error Handling', () => {
    it('should handle timeout errors', () => {
      service.getAIStatus().subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/status`);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle server errors', () => {
      service.generateProgramWithAI(1).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/generate?userId=1`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
