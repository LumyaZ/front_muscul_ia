import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainingInfoService } from './training-info.service';
import { environment } from '../../environments/environment';
import { 
  TrainingInfo, 
  CreateTrainingInfoRequest, 
  UpdateTrainingInfoRequest,
  ExperienceLevel,
  SessionFrequency,
  SessionDuration,
  MainGoal,
  TrainingPreference,
  Equipment
} from '../models/training-info.model';

describe('TrainingInfoService', () => {
  let service: TrainingInfoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/training-info`;

  const mockTrainingInfo: TrainingInfo = {
    id: 1,
    userId: 1,
    experienceLevel: ExperienceLevel.BEGINNER,
    sessionFrequency: SessionFrequency.THREE_TO_FOUR,
    sessionDuration: SessionDuration.MEDIUM,
    mainGoal: MainGoal.STRENGTH,
    trainingPreference: TrainingPreference.STRENGTH_TRAINING,
    equipment: Equipment.BASIC,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  };

  const mockCreateRequest: CreateTrainingInfoRequest = {
    gender: 'MALE' as any,
    weight: 70,
    height: 175,
    experienceLevel: ExperienceLevel.BEGINNER,
    sessionFrequency: SessionFrequency.THREE_TO_FOUR,
    sessionDuration: SessionDuration.MEDIUM,
    mainGoal: MainGoal.STRENGTH,
    trainingPreference: TrainingPreference.STRENGTH_TRAINING,
    equipment: Equipment.BASIC
  };

  const mockUpdateRequest: UpdateTrainingInfoRequest = {
    experienceLevel: ExperienceLevel.INTERMEDIATE,
    mainGoal: MainGoal.MUSCLE_GAIN
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrainingInfoService]
    });
    service = TestBed.inject(TrainingInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTrainingInfo', () => {
    it('should create training info successfully', () => {
      service.createTrainingInfo(mockCreateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
        expect(response.id).toBe(1);
        expect(response.userId).toBe(1);
        expect(response.experienceLevel).toBe(ExperienceLevel.BEGINNER);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingInfo);
    });

    it('should handle invalid request data', () => {
      const invalidRequest = { ...mockCreateRequest, weight: -10 };

      service.createTrainingInfo(invalidRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid request data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle server error', () => {
      service.createTrainingInfo(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTrainingInfo', () => {
    it('should get training info successfully', () => {
      service.getTrainingInfo().subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
        expect(response.id).toBe(1);
        expect(response.userId).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingInfo);
    });

    it('should handle training info not found', () => {
      service.getTrainingInfo().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Training info not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle server error', () => {
      service.getTrainingInfo().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getTrainingInfoByUserId', () => {
    it('should get training info by user ID successfully', () => {
      const userId = 1;
      
      service.getTrainingInfoByUserId(userId).subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
        expect(response.userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingInfo);
    });

    it('should handle user not found', () => {
      const userId = 999;

      service.getTrainingInfoByUserId(userId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('updateTrainingInfo', () => {
    it('should update training info successfully', () => {
      service.updateTrainingInfo(mockUpdateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
        expect(response.experienceLevel).toBe(ExperienceLevel.BEGINNER);
        expect(response.mainGoal).toBe(MainGoal.STRENGTH);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUpdateRequest);
      req.flush(mockTrainingInfo);
    });

    it('should handle training info not found for update', () => {
      service.updateTrainingInfo(mockUpdateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Training info not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should handle invalid update data', () => {
      const invalidUpdate = { experienceLevel: 'INVALID' as any };

      service.updateTrainingInfo(invalidUpdate).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid update data' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteTrainingInfo', () => {
    it('should delete training info successfully', () => {
      service.deleteTrainingInfo().subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle training info not found for deletion', () => {
      service.deleteTrainingInfo().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Training info not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('existsTrainingInfo', () => {
    it('should return true when training info exists', () => {
      service.existsTrainingInfo().subscribe(response => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/exists`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should return false when training info does not exist', () => {
      service.existsTrainingInfo().subscribe(response => {
        expect(response).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/exists`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('should handle server error', () => {
      service.existsTrainingInfo().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/exists`);
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('Service Integration', () => {
    it('should inject required dependencies', () => {
      expect(service).toBeDefined();
      expect(httpMock).toBeDefined();
    });

    it('should use correct API base URL', () => {
      expect(apiUrl).toBe(`${environment.apiUrl}/training-info`);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', () => {
      service.getTrainingInfo().subscribe({
        error: (error) => {
          expect(error.status).toBe(0);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle timeout errors', () => {
      service.createTrainingInfo(mockCreateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(408);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Request timeout' }, { status: 408, statusText: 'Request Timeout' });
    });

    it('should handle unauthorized errors', () => {
      service.updateTrainingInfo(mockUpdateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
}); 