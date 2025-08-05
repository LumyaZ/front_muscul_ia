import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramDetailsComponent } from './program-details.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { TrainingProgram } from '../../../models/training-program.model';
import { ProgramExercise } from '../../../models/program-exercise.model';

interface ProgramDetails extends TrainingProgram {
  exercises: ProgramExercise[];
}
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('ProgramDetailsComponent', () => {
  let component: ProgramDetailsComponent;
  let fixture: ComponentFixture<ProgramDetailsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

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

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', [
      'getProgramById',
      'addProgramToUser'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });

    trainingProgramServiceSpy.getProgramById.and.returnValue(of(mockProgram));
    trainingProgramServiceSpy.addProgramToUser.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [
        ProgramDetailsComponent,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
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
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant Musculation');
      expect(compiled.textContent).toContain('Un programme complet pour débuter la musculation');
      expect(compiled.textContent).toContain('Débutant');
      expect(compiled.textContent).toContain('Musculation');
      expect(compiled.textContent).toContain('Débutants');
    });
  });

  describe('Actions utilisateur', () => {
    it('should add program to user', () => {
      component.program = mockProgram;
      
      component.addProgramToUser();
      
      expect(trainingProgramService.addProgramToUser).toHaveBeenCalledWith(mockProgram.id);
    });

    it('should handle add program success', () => {
      component.program = mockProgram;
      component.canAddProgram = true;
      
      component.addProgramToUser();
      
      expect(component.canAddProgram).toBe(false);
    });

    it('should handle add program error', () => {
      trainingProgramService.addProgramToUser.and.returnValue(
        throwError(() => new Error('Erreur d\'ajout'))
      );
      
      component.program = mockProgram;
      
      component.addProgramToUser();
      
      expect(component.error).toBe('Erreur lors de l\'ajout du programme');
    });
  });

  describe('Utilitaires', () => {
    it('should get difficulty color', () => {
      expect(component.getDifficultyColor('Débutant')).toBe('#10B981');
      expect(component.getDifficultyColor('Intermédiaire')).toBe('#F59E0B');
      expect(component.getDifficultyColor('Avancé')).toBe('#EF4444');
      expect(component.getDifficultyColor('Autre')).toBe('#6B7280');
    });

    it('should get total exercises', () => {
      // Mock exercises data if needed
      expect(component.getTotalExercises()).toBe(0);
    });

    it('should get total sets', () => {
      // Mock exercises data if needed
      expect(component.getTotalSets()).toBe(0);
    });

    it('should get estimated total time', () => {
      // Mock exercises data if needed
      expect(component.getEstimatedTotalTime()).toBe('0min');
    });

    it('should format duration correctly', () => {
      expect(component.formatDuration(30)).toBe('30min');
      expect(component.formatDuration(60)).toBe('1h');
      expect(component.formatDuration(90)).toBe('1h 30min');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to programs', () => {
      component.goBack();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });
  });

  describe('Gestion des états', () => {
    it('should handle program not found', () => {
      trainingProgramService.getProgramById.and.returnValue(
        throwError(() => new Error('Programme non trouvé'))
      );
      
      component.loadProgramDetails();
      
      expect(component.error).toBe('Erreur lors du chargement du programme');
      expect(component.loading).toBe(false);
    });

    it('should handle user not authenticated', () => {
      component.currentUser = null;
      
      expect(component.canAddProgram).toBe(false);
    });

    it('should allow adding program when user is authenticated', () => {
      component.currentUser = { id: 1, email: 'test@test.com' };
      component.program = mockProgram;
      
      expect(component.canAddProgram).toBe(true);
    });
  });

  describe('Affichage des informations', () => {
    it('should display program statistics', () => {
      component.program = mockProgram;
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant Musculation');
      expect(compiled.textContent).toContain('Un programme complet pour débuter la musculation');
    });

    it('should display training tips', () => {
      component.program = mockProgram;
      
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Conseils d\'entraînement');
      expect(compiled.textContent).toContain('Échauffez-vous bien');
      expect(compiled.textContent).toContain('Restez hydraté');
    });
  });
}); 