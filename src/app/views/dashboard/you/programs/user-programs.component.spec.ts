import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserProgramsComponent } from './user-programs.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';

describe('UserProgramsComponent', () => {
  let component: UserProgramsComponent;
  let fixture: ComponentFixture<UserProgramsComponent>;
  let userTrainingProgramService: jasmine.SpyObj<UserTrainingProgramService>;
  let router: jasmine.SpyObj<Router>;

  const mockPrograms: UserTrainingProgram[] = [
    { 
      id: 1,
      user: {
        id: 1,
        email: 'test@test.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      trainingProgram: {
        id: 1,
        name: 'Programme Débutant',
        description: 'Description du programme débutant',
        difficultyLevel: 'Débutant',
        category: 'Musculation',
        targetAudience: 'Débutants',
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      startDate: '2024-01-01T00:00:00Z',
      progressPercentage: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 1,
      trainingProgramId: 1
    },
    { 
      id: 2,
      user: {
        id: 1,
        email: 'test@test.com',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      trainingProgram: {
        id: 2,
        name: 'Programme Intermédiaire',
        description: 'Description du programme intermédiaire',
        difficultyLevel: 'Intermédiaire',
        category: 'Cardio',
        targetAudience: 'Sportifs confirmés',
        createdByUserId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      startDate: '2024-01-01T00:00:00Z',
      progressPercentage: 0,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      userId: 1,
      trainingProgramId: 2
    }
  ];

  beforeEach(async () => {
    const userTrainingProgramServiceSpy = jasmine.createSpyObj('UserTrainingProgramService', [
      'getUserPrograms',
      'unsubscribeUserFromProgram'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userTrainingProgramServiceSpy.getUserPrograms.and.returnValue(of(mockPrograms));
    userTrainingProgramServiceSpy.unsubscribeUserFromProgram.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [
        UserProgramsComponent,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: UserTrainingProgramService, useValue: userTrainingProgramServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    userTrainingProgramService = TestBed.inject(UserTrainingProgramService) as jasmine.SpyObj<UserTrainingProgramService>;
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
      expect(component.userPrograms).toEqual(mockPrograms);
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
      component.userPrograms = mockPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant');
      expect(compiled.textContent).toContain('Programme Intermédiaire');
    });
  });

  describe('Gestion des programmes', () => {
    it('should view program details', () => {
      const program = mockPrograms[0];
      
      component.viewProgramDetails(program.id);
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/program-details', program.id]);
    });

    it('should unsubscribe from program', () => {
      const program = mockPrograms[0];
      
      component.unsubscribeFromProgram(program.id);
      
      expect(userTrainingProgramService.unsubscribeUserFromProgram).toHaveBeenCalledWith(program.userId!, program.trainingProgramId!);
    });
  });

  describe('Navigation', () => {
    it('should navigate to create program', () => {
      component.createNewProgram();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/create-program'], {
        queryParams: { from: 'you-programs' }
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
      expect(compiled.textContent).toContain('Aucun programme créé');
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
      component.userPrograms = mockPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Débutant');
      expect(compiled.textContent).toContain('Intermédiaire');
      expect(compiled.textContent).toContain('Musculation');
      expect(compiled.textContent).toContain('Cardio');
    });

    it('should display difficulty badges with correct colors', () => {
      component.userPrograms = mockPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Débutant');
      expect(compiled.textContent).toContain('Intermédiaire');
    });

    it('should display creation date', () => {
      component.userPrograms = mockPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('01/01/2024');
    });
  });

  describe('Utilitaires', () => {
    it('should get status color', () => {
      expect(component.getStatusColor('IN_PROGRESS')).toBe('#10B981');
      expect(component.getStatusColor('COMPLETED')).toBe('#3B82F6');
      expect(component.getStatusColor('PAUSED')).toBe('#F59E0B');
      expect(component.getStatusColor('NOT_STARTED')).toBe('#6B7280');
    });

    it('should get status text', () => {
      expect(component.getStatusText('IN_PROGRESS')).toBe('En cours');
      expect(component.getStatusText('COMPLETED')).toBe('Terminé');
      expect(component.getStatusText('PAUSED')).toBe('En pause');
      expect(component.getStatusText('NOT_STARTED')).toBe('Non commencé');
    });

    it('should track by program id', () => {
      const program = mockPrograms[0];
      const result = component.trackByProgramId(0, program);
      expect(result).toBe(program.id!);
    });
  });
}); 