import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthService } from '../../../services/auth.service';
import { TrainingSessionService, TrainingSessionDto } from '../../../services/training-session.service';
import { User } from '../../../models/user.model';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTrainingSessionService: jasmine.SpyObj<TrainingSessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2023-01-01T00:00:00Z'
  };

  const mockTrainings: TrainingSessionDto[] = [
    {
      id: 1,
      userId: 1,
      name: 'Entraînement 1',
      sessionDate: '2024-01-01T10:00:00Z',
      durationMinutes: 60,
      sessionType: 'Cardio',
      description: 'Entraînement cardio',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 2,
      userId: 1,
      name: 'Entraînement 2',
      sessionDate: '2024-01-02T10:00:00Z',
      durationMinutes: 45,
      sessionType: 'Musculation',
      description: 'Entraînement musculation',
      createdAt: '2024-01-02T10:00:00Z',
      updatedAt: '2024-01-02T10:00:00Z'
    }
  ];

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const trainingSpy = jasmine.createSpyObj('TrainingSessionService', ['getUserTrainingSessions']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: TrainingSessionService, useValue: trainingSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockTrainingSessionService = TestBed.inject(TrainingSessionService) as jasmine.SpyObj<TrainingSessionService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component successfully', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTrainingSessionService.getUserTrainingSessions.and.returnValue(of(mockTrainings));

    component.ngOnInit();

    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(mockTrainingSessionService.getUserTrainingSessions).toHaveBeenCalled();
    expect(component.currentUser).toEqual(mockUser);
    expect(component.recentTrainings).toEqual(mockTrainings.slice(0, 3));
    expect(component.isLoading).toBe(false);
    expect(component.error).toBeNull();
  });

  it('should handle authentication error and redirect to login', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(component.error).toBe('Utilisateur non connecté. Redirection vers la page de connexion.');
  });

  it('should handle training sessions loading error', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTrainingSessionService.getUserTrainingSessions.and.returnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();

    expect(component.error).toBe('Erreur lors du chargement des entraînements récents');
    expect(component.isLoading).toBe(false);
  });

  it('should clear error', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTrainingSessionService.getUserTrainingSessions.and.returnValue(of(mockTrainings));
    component.ngOnInit();
        
    component.error = 'Test error';

    component.clearError();

    expect(component.error).toBeNull();
  });

  it('should format date correctly', () => {
    const date = '2024-01-15T10:30:00Z';
    const formatted = component.formatDate(date);
    expect(formatted).toBe('15/01/2024');
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(90)).toBe('1h 30min');
    expect(component.formatDuration(45)).toBe('45min');
    expect(component.formatDuration(60)).toBe('1h');
  });

  it('should calculate total duration correctly', () => {
    component.recentTrainings = mockTrainings;
    expect(component.getTotalDuration()).toBe('1h 45min');
  });

  it('should calculate average duration correctly', () => {
    component.recentTrainings = mockTrainings;
    expect(component.getAverageDuration()).toBe('53min');
  });

  it('should return 0min for average when no trainings', () => {
    component.recentTrainings = [];
    expect(component.getAverageDuration()).toBe('0min');
  });

  it('should navigate to trainings page', () => {
    component.viewAllTrainings();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/you/trainings']);
  });

  it('should navigate to record page', () => {
    component.startNewTraining();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record']);
  });

  it('should navigate to programs page', () => {
    component.viewPrograms();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
  });

  it('should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
}); 