import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserTrainingProgramService, UserTrainingProgram } from './user-training-program.service';
import { environment } from '../../environments/environment';

describe('UserTrainingProgramService', () => {
  let service: UserTrainingProgramService;
  let httpMock: HttpTestingController;

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

  it('should get user programs', () => {
    const userId = 1;
    const mockPrograms: UserTrainingProgram[] = [
      {
        id: 1,
        user: { id: 1, email: 'test@test.com' },
        trainingProgram: { id: 1, name: 'Program 1' },
        startedAt: '2024-01-01',
        status: 'IN_PROGRESS',
        currentWeek: 1,
        currentSession: 1,
        isFavorite: true,
        createdAt: '2024-01-01'
      }
    ];

    service.getUserPrograms(userId).subscribe(programs => {
      expect(programs).toEqual(mockPrograms);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/user/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPrograms);
  });

  it('should subscribe user to program', () => {
    const userId = 1;
    const trainingProgramId = 1;
    const mockResponse: UserTrainingProgram = {
      id: 1,
      user: { id: 1, email: 'test@test.com' },
      trainingProgram: { id: 1, name: 'Program 1' },
      startedAt: '2024-01-01',
      status: 'NOT_STARTED',
      currentWeek: 1,
      currentSession: 1,
      isFavorite: false,
      createdAt: '2024-01-01'
    };

    service.subscribeUserToProgram(userId, trainingProgramId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/subscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should unsubscribe user from program', () => {
    const userId = 1;
    const trainingProgramId = 1;

    service.unsubscribeUserFromProgram(userId, trainingProgramId).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/unsubscribe?userId=${userId}&trainingProgramId=${trainingProgramId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get user program', () => {
    const userId = 1;
    const trainingProgramId = 1;
    const mockResponse: UserTrainingProgram = {
      id: 1,
      user: { id: 1, email: 'test@test.com' },
      trainingProgram: { id: 1, name: 'Program 1' },
      startedAt: '2024-01-01',
      status: 'IN_PROGRESS',
      currentWeek: 1,
      currentSession: 1,
      isFavorite: true,
      createdAt: '2024-01-01'
    };

    service.getUserProgram(userId, trainingProgramId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/user-training-programs/user/${userId}/program/${trainingProgramId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
}); 