import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsComponent } from './programs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrainingProgramService, TrainingProgram } from '../../../services/training-program.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', [
      'getPublicPrograms', 
      'addProgramToUser'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'isAuthenticated',
      'getToken'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    trainingProgramServiceSpy.getPublicPrograms.and.returnValue(of([]));
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getToken.and.returnValue('mock-token');

    await TestBed.configureTestingModule({
      imports: [ProgramsComponent, HttpClientTestingModule],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsComponent);
    component = fixture.componentInstance;
    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain("Programmes d'entraînement");
  });

  it('should display create program button', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Créer un programme');
  });

  it('should not display refresh button (removed)', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).not.toContain('Actualiser');
  });

  it('should load programs on init', () => {
    const mockPrograms: TrainingProgram[] = [
      { 
        id: 1, 
        name: 'Programme Débutant', 
        description: 'Description du programme débutant',
        difficultyLevel: 'Débutant',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 45,
        category: 'Musculation',
        targetAudience: 'Débutants',
        equipmentRequired: 'Poids du corps',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    trainingProgramService.getPublicPrograms.and.returnValue(of(mockPrograms));
    
    component.ngOnInit();
    
    expect(trainingProgramService.getPublicPrograms).toHaveBeenCalled();
    expect(component.programs).toEqual(mockPrograms);
  });

  it('should handle loading state', () => {
    component.loading = true;
    expect(component.loading).toBe(true);
    
    component.loading = false;
    component.error = 'test error';
    component.programs = [];
    
    const originalGetPublicPrograms = trainingProgramService.getPublicPrograms;
    
    trainingProgramService.getPublicPrograms.and.returnValue(of([]));
    
    component.loadPrograms();
    
    expect(component.error).toBe(''); 
    expect(component.programs).toEqual([]); 
  });

  it('should handle error state', () => {
    trainingProgramService.getPublicPrograms.and.returnValue(
      throwError(() => new Error('Erreur de chargement'))
    );
    
    component.loadPrograms();
    
    expect(component.error).toBe('Erreur lors du chargement des programmes');
    expect(component.loading).toBe(false);
  });

  it('should display program cards with correct data', () => {
    const mockPrograms: TrainingProgram[] = [
      { 
        id: 1, 
        name: 'Programme Débutant', 
        description: 'Description du programme débutant',
        difficultyLevel: 'Débutant',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 45,
        category: 'Musculation',
        targetAudience: 'Débutants',
        equipmentRequired: 'Poids du corps',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];
    
    trainingProgramService.getPublicPrograms.and.returnValue(of(mockPrograms));
    
    component.ngOnInit();
    
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Programme Débutant');
    expect(compiled.textContent).toContain('Ajouter');
    expect(compiled.textContent).toContain('Voir le programme');
  });

  it('should group programs by category', () => {
    const mockPrograms: TrainingProgram[] = [
      { 
        id: 1, 
        name: 'Programme Musculation', 
        description: 'Description',
        difficultyLevel: 'Débutant',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 45,
        category: 'Musculation',
        targetAudience: 'Débutants',
        equipmentRequired: 'Poids du corps',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      { 
        id: 2, 
        name: 'Programme Cardio', 
        description: 'Description',
        difficultyLevel: 'Débutant',
        durationWeeks: 3,
        sessionsPerWeek: 2,
        estimatedDurationMinutes: 30,
        category: 'Cardio',
        targetAudience: 'Tous niveaux',
        equipmentRequired: 'Tapis de course',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    component.programs = mockPrograms;
    component.groupProgramsByCategory();

    expect(component.categoryGroups.length).toBe(2);
    expect(component.categoryGroups[0].category).toBe('Musculation');
    expect(component.categoryGroups[1].category).toBe('Cardio');
  });

  it('should filter programs by search term', () => {
    const mockPrograms: TrainingProgram[] = [
      { 
        id: 1, 
        name: 'Programme Débutant', 
        description: 'Description du programme débutant',
        difficultyLevel: 'Débutant',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 45,
        category: 'Musculation',
        targetAudience: 'Débutants',
        equipmentRequired: 'Poids du corps',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      { 
        id: 2, 
        name: 'Programme Avancé', 
        description: 'Description du programme avancé',
        difficultyLevel: 'Avancé',
        durationWeeks: 6,
        sessionsPerWeek: 4,
        estimatedDurationMinutes: 60,
        category: 'Musculation',
        targetAudience: 'Sportifs confirmés',
        equipmentRequired: 'Haltères',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    component.programs = mockPrograms;
    component.searchTerm = 'Débutant';
    component.groupProgramsByCategory();

    expect(component.categoryGroups[0].programs.length).toBe(1);
    expect(component.categoryGroups[0].programs[0].name).toBe('Programme Débutant');
  });

  it('should clear filters', () => {
    component.searchTerm = 'test';
    component.selectedDifficulty = 'Débutant';
    component.selectedAudience = 'Débutants';
    component.showOnlyPublic = false;

    component.clearFilters();

    expect(component.searchTerm).toBe('');
    expect(component.selectedDifficulty).toBe('');
    expect(component.selectedAudience).toBe('');
    expect(component.showOnlyPublic).toBe(true);
  });

  it('should navigate to program details', () => {
    component.viewProgram(1);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs', 1]);
  });

  it('should navigate to create program', () => {
    component.createNewProgram();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs/create']);
  });

  it('should add program to user successfully', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mock-token');
    trainingProgramService.addProgramToUser.and.returnValue(of({ success: true }));

    component.addProgramToUser(1);

    expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    expect(trainingProgramService.addProgramToUser).toHaveBeenCalledWith(1);
  });

  it('should handle add program to user when user not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.addProgramToUser(1);

    expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    expect(trainingProgramService.addProgramToUser).not.toHaveBeenCalled();
  });

  it('should get total programs count', () => {
    const mockPrograms: TrainingProgram[] = [
      { 
        id: 1, 
        name: 'Programme 1', 
        description: 'Description',
        difficultyLevel: 'Débutant',
        durationWeeks: 4,
        sessionsPerWeek: 3,
        estimatedDurationMinutes: 45,
        category: 'Musculation',
        targetAudience: 'Débutants',
        equipmentRequired: 'Poids du corps',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      { 
        id: 2, 
        name: 'Programme 2', 
        description: 'Description',
        difficultyLevel: 'Intermédiaire',
        durationWeeks: 6,
        sessionsPerWeek: 4,
        estimatedDurationMinutes: 60,
        category: 'Cardio',
        targetAudience: 'Sportifs confirmés',
        equipmentRequired: 'Haltères',
        isPublic: true,
        isActive: true,
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    component.programs = mockPrograms;
    component.groupProgramsByCategory();

    expect(component.getTotalPrograms()).toBe(2);
  });
}); 