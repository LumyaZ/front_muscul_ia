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
    userId: 1,
    trainingProgramId: 1,
    trainingProgramName: 'Program 1',
    trainingProgramDescription: 'Test program',
    trainingProgramCategory: 'Strength',
    trainingProgramDifficultyLevel: 'Beginner',
    trainingProgramDurationWeeks: 8,
    trainingProgramSessionsPerWeek: 3,
    trainingProgramIsPublic: true,
    currentWeek: 1,
    currentDay: 1,
    isCompleted: false,
    startDate: '2024-01-01',
    progressPercentage: 25,
    notes: 'Test notes',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  };

  const mockNewSubscription: UserTrainingProgram = {
    id: 1,
    userId: 1,
    trainingProgramId: 1,
    trainingProgramName: 'Program 1',
    trainingProgramDescription: 'Test program',
    trainingProgramCategory: 'Strength',
    trainingProgramDifficultyLevel: 'Beginner',
    trainingProgramDurationWeeks: 8,
    trainingProgramSessionsPerWeek: 3,
    trainingProgramIsPublic: true,
    currentWeek: 1,
    currentDay: 1,
    isCompleted: false,
    startDate: '2024-01-01',
    progressPercentage: 0,
    notes: 'New subscription',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
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
    it('should get user programs successfully', () => {
      const userId = 1;
      const mockPrograms: UserTrainingProgram[] = [mockUserTrainingProgram];

      service.getUserPrograms(userId).subscribe(programs => {
        expect(programs).toEqual(mockPrograms);
        expect(programs.length).toBe(1);
        expect(programs[0].id).toBe(1);
        expect(programs[0].isCompleted).toBe(false);
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
        expect(response).toEqual(mockNewSubscription);
        expect(response.isCompleted).toBe(false);
        expect(response.progressPercentage).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockNewSubscription);
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
        expect(response?.isCompleted).toBe(false);
        expect(response?.progressPercentage).toBe(25);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserTrainingProgram);
    });

    it('should return null when user is not subscribed to program', () => {
      const userId = 1;
      const trainingProgramId = 999;

      service.getUserProgram(userId, trainingProgramId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/user/${userId}/program/${trainingProgramId}`);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });
  });
}); 