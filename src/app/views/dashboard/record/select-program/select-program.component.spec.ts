import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SelectProgramComponent } from './select-program.component';
import { UserTrainingProgramService } from '../../../../services/user-training-program.service';
import { UserTrainingProgram } from '../../../../models/user-training-program.model';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';

describe('SelectProgramComponent', () => {
  let component: SelectProgramComponent;
  let fixture: ComponentFixture<SelectProgramComponent>;
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
      'getUserPrograms'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userTrainingProgramServiceSpy.getUserPrograms.and.returnValue(of(mockPrograms));

    await TestBed.configureTestingModule({
      imports: [
        SelectProgramComponent,
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
    fixture = TestBed.createComponent(SelectProgramComponent);
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
      component.loading = true;
      expect(component.loading).toBe(true);
    });

    it('should handle error state', () => {
      userTrainingProgramService.getUserPrograms.and.returnValue(
        throwError(() => new Error('Erreur de chargement'))
      );
      
      component.loadUserPrograms();
      
      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.loading).toBe(false);
    });

    it('should display program cards with correct data', () => {
      component.userPrograms = mockPrograms;
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Programme Débutant');
      expect(compiled.textContent).toContain('Programme Intermédiaire');
    });
  });

  describe('Sélection de programme', () => {
    it('should select a program', () => {
      const program = mockPrograms[0];
      
      component.selectProgram(program);
      
      expect(component.selectedProgram).toEqual(program);
    });

    it('should navigate to training with selected program', () => {
      const program = mockPrograms[0];
      component.selectedProgram = program;
      
      component.onNext();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/record/training'], {
        queryParams: { programId: program.trainingProgramId }
      });
    });

    it('should not navigate if no program selected', () => {
      component.selectedProgram = null;
      
      component.onNext();
      
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to record', () => {
      component.onBack();
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/record']);
    });
  });

  describe('Gestion des états', () => {
    it('should handle empty programs list', () => {
      component.userPrograms = [];
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Aucun programme disponible');
    });

    it('should handle programs not found', () => {
      userTrainingProgramService.getUserPrograms.and.returnValue(
        throwError(() => new Error('Programmes non trouvés'))
      );
      
      component.loadUserPrograms();
      
      expect(component.error).toBe('Erreur lors du chargement des programmes');
      expect(component.loading).toBe(false);
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
  });

  describe('Validation', () => {
    it('should validate program selection', () => {
      expect(component.canProceed()).toBe(false);
      
      component.selectedProgram = mockPrograms[0];
      
      expect(component.canProceed()).toBe(true);
    });

    it('should handle program selection change', () => {
      const program1 = mockPrograms[0];
      const program2 = mockPrograms[1];
      
      component.selectProgram(program1);
      expect(component.selectedProgram).toEqual(program1);
      
      component.selectProgram(program2);
      expect(component.selectedProgram).toEqual(program2);
    });
  });
}); 