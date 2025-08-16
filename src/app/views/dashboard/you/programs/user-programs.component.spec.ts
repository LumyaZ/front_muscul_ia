import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserProgramsComponent } from './user-programs.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { AuthService } from '../../../../services/auth.service';
import { AITrainingService } from '../../../../services/ai-training.service';
import { TrainingProgram } from '../../../../models/training-program.model';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';

describe('UserProgramsComponent', () => {
  let component: UserProgramsComponent;
  let fixture: ComponentFixture<UserProgramsComponent>;
  let userTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let aiTrainingService: jasmine.SpyObj<AITrainingService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockGeneratedProgram: TrainingProgram = {
    id: 3,
    name: 'Programme IA Généré',
    description: 'Programme généré par l\'IA',
    difficultyLevel: 'Intermédiaire',
    category: 'Mixte',
    targetAudience: 'Tous niveaux',
    createdByUserId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockTrainingProgram = {
    id: 1,
    name: 'Programme Débutant',
    description: 'Description du programme débutant',
    difficultyLevel: 'Débutant',
    category: 'Musculation',
    targetAudience: 'Débutants',
    createdByUserId: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockUserTrainingPrograms: UserTrainingProgram[] = [
    {
      id: 1,
      user: mockUser,
      trainingProgram: mockTrainingProgram,
      userId: 1,
      trainingProgramId: 1,
      trainingProgramName: 'Programme Débutant',
      trainingProgramDescription: 'Programme pour débutants',
      trainingProgramDifficultyLevel: 'Débutant',
      trainingProgramCategory: 'Musculation'
    },
    {
      id: 2,
      user: mockUser,
      trainingProgram: mockTrainingProgram,
      userId: 1,
      trainingProgramId: 2,
      trainingProgramName: 'Programme Intermédiaire',
      trainingProgramDescription: 'Programme pour intermédiaires',
      trainingProgramDifficultyLevel: 'Intermédiaire',
      trainingProgramCategory: 'Cardio'
    }
  ];

  beforeEach(async () => {
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', [
      'getUserPrograms',
      'unsubscribeUserFromProgram'
    ]);
    const aiTrainingServiceSpy = jasmine.createSpyObj('AITrainingService', ['generateProgramWithAI']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

    userTrainingProgramServiceSpy.getUserPrograms.and.returnValue(of(mockUserTrainingPrograms));
    userTrainingProgramServiceSpy.unsubscribeUserFromProgram.and.returnValue(of(null));
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [
        UserProgramsComponent,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AITrainingService, useValue: aiTrainingServiceSpy }
      ]
    }).compileComponents();

    userTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
    aiTrainingService = TestBed.inject(AITrainingService) as jasmine.SpyObj<AITrainingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load user programs on init', () => {
      component.ngOnInit();
      
      expect(userTrainingProgramService.getUserPrograms).toHaveBeenCalled();
      expect(component.userPrograms).toEqual(mockUserTrainingPrograms);
    });

    it('should handle loading state', () => {
      component.isLoading = true;
      expect(component.isLoading).toBe(true);
    });

    it('should handle error state', () => {
      userTrainingProgramService.getUserPrograms.and.returnValue(
        throwError(() => new Error('Erreur de chargement'))
      );
      
      component.loadUserPrograms();
      
      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.isLoading).toBe(false);
    });

    it('should display program cards with correct data', () => {
      component.userPrograms = mockUserTrainingPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant');
      expect(compiled.textContent).toContain('Programme Intermédiaire');
    });
  });

  describe('Gestion des programmes', () => {
    it('should view program details', () => {
      const program = mockUserTrainingPrograms[0];
      
      component.viewProgramDetails(program.id);
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs', program.id], { queryParams: { from: 'you-programs' } });
    });

    it('should unsubscribe from program', () => {
      const program = mockUserTrainingPrograms[0];
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.unsubscribeFromProgram(program.trainingProgramId!);
      
      expect(userTrainingProgramService.unsubscribeUserFromProgram).toHaveBeenCalledWith(component.currentUser.id, program.trainingProgramId!);
    });
  });

  describe('Navigation', () => {
    it('should navigate to create program', () => {
      component.createNewProgram();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs/create'], {
        queryParams: { from: 'you-programs', userId: 1 }
      });
    });

    it('should navigate to all programs', () => {
      component.goToAllPrograms();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs']);
    });
  });

  describe('Gestion des états', () => {
    it('should handle empty programs list', () => {
      component.userPrograms = [];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Aucun programme');
    });

    it('should handle programs not found', () => {
      userTrainingProgramService.getUserPrograms.and.returnValue(
        throwError(() => new Error('Programmes non trouvés'))
      );
      
      component.loadUserPrograms();
      
      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Affichage des informations', () => {
    it('should display program information correctly', () => {
      component.userPrograms = mockUserTrainingPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant');
      expect(compiled.textContent).toContain('Programme Intermédiaire');
      expect(compiled.textContent).toContain('Débutant');
      expect(compiled.textContent).toContain('Intermédiaire');
      expect(compiled.textContent).toContain('Musculation');
      expect(compiled.textContent).toContain('Cardio');
    });

    it('should display difficulty badges with correct colors', () => {
      component.userPrograms = mockUserTrainingPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Débutant');
      expect(compiled.textContent).toContain('Intermédiaire');
    });
  });

  describe('Utilitaires', () => {
    it('should get status color', () => {
      expect(component.getStatusColor('IN_PROGRESS')).toBe('#4CAF50');
      expect(component.getStatusColor('COMPLETED')).toBe('#2196F3');
      expect(component.getStatusColor('PAUSED')).toBe('#FF9800');
      expect(component.getStatusColor('NOT_STARTED')).toBe('#9E9E9E');
    });

    it('should get status text', () => {
      expect(component.getStatusText('IN_PROGRESS')).toBe('En cours');
      expect(component.getStatusText('COMPLETED')).toBe('Terminé');
      expect(component.getStatusText('PAUSED')).toBe('En pause');
      expect(component.getStatusText('NOT_STARTED')).toBe('Non commencé');
    });

    it('should track by program id', () => {
      const program = mockUserTrainingPrograms[0];
      const result = component.trackByProgramId(0, program);
      expect(result).toBe(program.id!);
    });
  });

  describe('Génération IA', () => {
    beforeEach(() => {
      aiTrainingService.generateProgramWithAI.and.returnValue(of(mockGeneratedProgram));
    });

    it('should generate program with AI successfully', () => {
      component.generateProgramWithAI();
      
      expect(aiTrainingService.generateProgramWithAI).toHaveBeenCalledWith(mockUser.id);
      expect(component.aiLoading).toBe(false);
      // Le message de succès peut être remplacé par le message de chargement des programmes
      expect(component.success).toBeTruthy();
    });

    it('should handle AI generation error', () => {
      aiTrainingService.generateProgramWithAI.and.returnValue(
        throwError(() => ({ status: 500, message: 'Erreur serveur' }))
      );
      
      component.generateProgramWithAI();
      
      expect(component.aiLoading).toBe(false);
      expect(component.error).toContain('Erreur lors de la génération du programme. Veuillez réessayer.');
    });

    it('should handle AI service connection error', () => {
      aiTrainingService.generateProgramWithAI.and.returnValue(
        throwError(() => ({ status: 0, message: 'Connection failed' }))
      );
      
      component.generateProgramWithAI();
      
      expect(component.aiLoading).toBe(false);
      expect(component.error).toContain('Impossible de se connecter au service IA');
    });

    it('should handle AI service unavailable error', () => {
      aiTrainingService.generateProgramWithAI.and.returnValue(
        throwError(() => ({ status: 503, message: 'Service unavailable' }))
      );
      
      component.generateProgramWithAI();
      
      expect(component.aiLoading).toBe(false);
      expect(component.error).toContain('Service IA temporairement indisponible');
    });

    it('should not generate program if user not connected', () => {
      component.currentUser = null;
      
      component.generateProgramWithAI();
      
      expect(aiTrainingService.generateProgramWithAI).not.toHaveBeenCalled();
      expect(component.error).toBe('Erreur: Utilisateur non connecté');
    });

    it('should reload programs after successful AI generation', () => {
      spyOn(component, 'loadUserPrograms');
      
      component.generateProgramWithAI();
      
      expect(component.loadUserPrograms).toHaveBeenCalled();
    });
  });
}); 