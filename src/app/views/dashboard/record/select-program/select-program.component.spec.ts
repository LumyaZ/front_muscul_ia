import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SelectProgramComponent } from './select-program.component';
import { UserTrainingProgramService, UserTrainingProgram } from '../../../../services/user-training-program.service';
import { AuthService } from '../../../../services/auth.service';

describe('SelectProgramComponent', () => {
  let component: SelectProgramComponent;
  let fixture: ComponentFixture<SelectProgramComponent>;
  let mockUserTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUserTrainingPrograms = [
    {
      id: 1,
      user: { id: 1, email: 'test@test.com' },
      trainingProgram: {
        id: 1,
        name: 'Programme Débutant',
        description: 'Programme pour débutants',
        difficultyLevel: 'BEGINNER',
        duration: 4,
        category: 'STRENGTH'
      },
      startedAt: null,
      status: 'NOT_STARTED',
      currentWeek: 0,
      currentSession: 0,
      progress: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      user: { id: 1, email: 'test@test.com' },
      trainingProgram: {
        id: 2,
        name: 'Programme Intermédiaire',
        description: 'Programme pour intermédiaires',
        difficultyLevel: 'INTERMEDIATE',
        duration: 6,
        category: 'STRENGTH'
      },
      startedAt: '2024-01-01T00:00:00Z',
      status: 'IN_PROGRESS',
      currentWeek: 3,
      currentSession: 2,
      progress: 50,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ] as any;

  beforeEach(async () => {
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', ['getUserPrograms']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ SelectProgramComponent ],
      providers: [
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    mockUserTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProgramComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user programs on init', () => {
    mockAuthService.getCurrentUser.and.returnValue({ id: 1, email: 'test@test.com' });
    mockUserTrainingProgramService.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
    
    component.ngOnInit();
    
    expect(mockUserTrainingProgramService.getUserPrograms).toHaveBeenCalledWith(1);
    expect(component.userPrograms).toEqual(mockUserTrainingPrograms);
    expect(component.loading).toBeFalse();
  });

  it('should handle error when user not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    
    component.ngOnInit();
    
    expect(component.error).toBe('Utilisateur non connecté');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading programs', () => {
    mockAuthService.getCurrentUser.and.returnValue({ id: 1, email: 'test@test.com' });
    mockUserTrainingProgramService.getUserPrograms.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(component.error).toBeTruthy();
    expect(component.loading).toBeFalse();
  });

  it('should navigate back when onBack is called', () => {
    component.onBack();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record']);
  });

  it('should select a program', () => {
    const program = mockUserTrainingPrograms[0];
    
    component.selectProgram(program);
    
    expect(component.selectedProgram).toEqual(program);
  });

  it('should check if program is selected', () => {
    const program = mockUserTrainingPrograms[0];
    component.selectedProgram = program;
    
    expect(component.isProgramSelected(program)).toBeTrue();
    expect(component.isProgramSelected(mockUserTrainingPrograms[1])).toBeFalse();
  });

  it('should check if can proceed', () => {
    expect(component.canProceed()).toBeFalse();
    
    component.selectedProgram = mockUserTrainingPrograms[0];
    
    expect(component.canProceed()).toBeTrue();
  });

  it('should navigate to program recap when next is called with selected program', () => {
    const program = mockUserTrainingPrograms[0];
    component.selectedProgram = program;
    
    component.onNext();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/record/program-recap', program.trainingProgram.id]);
  });

  it('should not navigate when no program is selected', () => {
    component.selectedProgram = null;
    
    component.onNext();
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should group programs by category correctly', () => {
    component.userPrograms = mockUserTrainingPrograms;
    
    const groupedPrograms = component.getProgramsByCategory();
    
    expect(groupedPrograms['STRENGTH']).toContain(mockUserTrainingPrograms[0]);
    expect(groupedPrograms['STRENGTH']).toContain(mockUserTrainingPrograms[1]);
  });

  it('should get status label correctly', () => {
    expect(component.getStatusLabel('NOT_STARTED')).toBe('Non commencé');
    expect(component.getStatusLabel('IN_PROGRESS')).toBe('En cours');
    expect(component.getStatusLabel('COMPLETED')).toBe('Terminé');
    expect(component.getStatusLabel('PAUSED')).toBe('En pause');
    expect(component.getStatusLabel('UNKNOWN')).toBe('UNKNOWN');
  });

  it('should calculate progress percentage correctly', () => {
    const program = mockUserTrainingPrograms[1]; // currentWeek: 3, duration: 6
    
    expect(component.getProgressPercentage(program)).toBe(75); // (3/6) * 100 = 50, rounded
  });

  it('should handle zero progress', () => {
    const program = mockUserTrainingPrograms[0]; // NOT_STARTED
    
    expect(component.getProgressPercentage(program)).toBe(0);
  });

  it('should handle completed program', () => {
    const completedProgram = { ...mockUserTrainingPrograms[0], status: 'COMPLETED' } as any;
    
    expect(component.getProgressPercentage(completedProgram)).toBe(100);
  });

  it('should show loading state initially', () => {
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
    expect(component.selectedProgram).toBeNull();
    expect(component.userPrograms).toEqual([]);
  });

  it('should handle empty programs list', () => {
    component.userPrograms = [];
    
    const groupedPrograms = component.getProgramsByCategory();
    
    expect(Object.keys(groupedPrograms).length).toBe(0);
  });
}); 