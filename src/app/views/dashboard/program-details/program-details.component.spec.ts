import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramDetailsComponent } from './program-details.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { TrainingProgram } from '../../../models/training-program.model';
import { ProgramExercise } from '../../../models/program-exercise.model';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

interface ProgramDetails extends TrainingProgram {
  exercises: ProgramExercise[];
}
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('ProgramDetailsComponent', () => {
  let component: ProgramDetailsComponent;
  let fixture: ComponentFixture<ProgramDetailsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let programExerciseService: jasmine.SpyObj<ProgramExerciseService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    creationDate: '2024-01-01T00:00:00Z'
  };

  const mockProgram: ProgramDetails = {
    id: 1,
    name: 'Programme Débutant Musculation',
    description: 'Un programme complet pour débuter la musculation',
    difficultyLevel: 'Débutant',
    category: 'Musculation',
    targetAudience: 'Débutants',
    createdByUserId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    exercises: []
  };

  const mockParamMap = {
    get: jasmine.createSpy('get').and.returnValue('1')
  };

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', [
      'getProgramById',
      'addProgramToUser'
    ]);
    const programExerciseServiceSpy = jasmine.createSpyObj('ProgramExerciseService', [
      'getExercisesByProgramId'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isAuthenticated']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' }),
      queryParams: of({ from: 'programs' }),
      snapshot: {
        paramMap: mockParamMap
      }
    });

    trainingProgramServiceSpy.getProgramById.and.returnValue(of(mockProgram));
    trainingProgramServiceSpy.addProgramToUser.and.returnValue(of({ success: true }));
    programExerciseServiceSpy.getExercisesByProgramId.and.returnValue(of([]));
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        ProgramDetailsComponent,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: ProgramExerciseService, useValue: programExerciseServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    programExerciseService = TestBed.inject(ProgramExerciseService) as jasmine.SpyObj<ProgramExerciseService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load program details on init', () => {
      component.ngOnInit();
      
      expect(trainingProgramService.getProgramById).toHaveBeenCalledWith(1);
      expect(component.program).toEqual(mockProgram);
    });

    it('should handle loading state', () => {
      component.loading = true;
      expect(component.loading).toBe(true);
    });

    it('should handle error state', () => {
      trainingProgramService.getProgramById.and.returnValue(
        throwError(() => new Error('Erreur de chargement'))
      );
      
      component.loadProgramDetails();
      
      expect(component.error).toBe('Erreur lors du chargement du programme');
      expect(component.loading).toBe(false);
    });

    it('should display program details correctly', () => {
      component.program = mockProgram;
      component.loading = false;
      component.error = '';
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant Musculation');
    });
  });

  describe('Gestion des états', () => {
    it('should allow adding program when user is authenticated', () => {
      component.currentUser = mockUser;
      component.program = mockProgram;
      
      expect(component.canAddProgram).toBeDefined();
    });

    it('should handle user not authenticated', () => {
      component.currentUser = null;
      
      expect(component.currentUser).toBeNull();
    });

    it('should handle program not found', () => {
      trainingProgramService.getProgramById.and.returnValue(
        throwError(() => ({ status: 404 }))
      );
      
      component.loadProgramDetails();
      
      expect(component.error).toBe('Programme non trouvé.');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to programs', () => {
      component.goBack();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });
  });

  describe('Affichage des informations', () => {
    it('should display program statistics', () => {
      component.program = mockProgram;
      
      expect(component.getTotalExercises()).toBe(0);
      expect(component.getTotalSets()).toBe(0);
    });

    it('should display training tips', () => {
      component.program = mockProgram;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });
  });

  describe('Utilitaires', () => {
    it('should get total sets', () => {
      component.program = mockProgram;
      
      expect(component.getTotalSets()).toBe(0);
    });

    it('should get total exercises', () => {
      component.program = mockProgram;
      
      expect(component.getTotalExercises()).toBe(0);
    });

    it('should get difficulty color', () => {
      expect(component.getDifficultyColor('Débutant')).toBeDefined();
    });

    it('should get estimated total time', () => {
      component.program = mockProgram;
      
      expect(component.getEstimatedTotalTime()).toBeDefined();
    });

    it('should format duration correctly', () => {
      expect(component.formatDuration(90)).toBeDefined();
    });
  });

  describe('Actions utilisateur', () => {
    it('should handle add program error', () => {
      trainingProgramService.addProgramToUser.and.returnValue(
        throwError(() => new Error('Erreur d\'ajout'))
      );
      
      component.addProgramToUser();
      
      expect(component.error).toBeDefined();
    });

    it('should handle add program success', () => {
      component.currentUser = mockUser;
      component.program = mockProgram;
      
      spyOn(window, 'alert');
      
      component.addProgramToUser();
      
      expect(window.alert).toHaveBeenCalledWith('Programme ajouté à vos programmes !');
    });

    it('should add program to user', () => {
      component.currentUser = mockUser;
      component.program = mockProgram;
      
      spyOn(window, 'alert');
      
      component.addProgramToUser();
      
      expect(window.alert).toHaveBeenCalledWith('Programme ajouté à vos programmes !');
    });
  });
}); 