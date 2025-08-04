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
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateRequest);
      req.flush(mockTrainingInfo);
    });
  });

  describe('getTrainingInfo', () => {
    it('should get training info successfully', () => {
      service.getTrainingInfo().subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingInfo);
    });
  });

  describe('getTrainingInfoByUserId', () => {
    it('should get training info by user ID successfully', () => {
      const userId = 1;
      
      service.getTrainingInfoByUserId(userId).subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
      });

      const req = httpMock.expectOne(`${apiUrl}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrainingInfo);
    });
  });

  describe('updateTrainingInfo', () => {
    it('should update training info successfully', () => {
      service.updateTrainingInfo(mockUpdateRequest).subscribe(response => {
        expect(response).toEqual(mockTrainingInfo);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUpdateRequest);
      req.flush(mockTrainingInfo);
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
  });
}); 