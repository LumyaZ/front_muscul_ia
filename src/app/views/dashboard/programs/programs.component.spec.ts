import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProgramsComponent } from './programs.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { TrainingProgram } from '../../../models/training-program.model';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;
  let trainingProgramService: jasmine.SpyObj<TrainingProgramService>;
  let router: jasmine.SpyObj<Router>;

  const mockPrograms: TrainingProgram[] = [
    { 
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
    { 
      id: 2, 
      name: 'Programme Intermédiaire', 
      description: 'Description du programme intermédiaire',
      difficultyLevel: 'Intermédiaire',
      category: 'Cardio',
      targetAudience: 'Sportifs confirmés',
      createdByUserId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const trainingProgramServiceSpy = jasmine.createSpyObj('TrainingProgramService', [
      'getPublicPrograms',
      'addProgramToUser'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    trainingProgramServiceSpy.getPublicPrograms.and.returnValue(of(mockPrograms));
    trainingProgramServiceSpy.addProgramToUser.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [
        ProgramsComponent,
        HttpClientTestingModule,
        HeaderComponent,
        NavBarComponent
      ],
      providers: [
        { provide: TrainingProgramService, useValue: trainingProgramServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    trainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialisation du composant', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load programs on init', () => {
      const mockPrograms: TrainingProgram[] = [
        { 
          id: 1, 
          name: 'Programme Débutant', 
          description: 'Description du programme débutant',
          difficultyLevel: 'Débutant',
          category: 'Musculation',
          targetAudience: 'Débutants',
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
          category: 'Musculation',
          targetAudience: 'Débutants',
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
  });

  describe('Gestion des filtres et groupements', () => {
    it('should group programs by category', () => {
      const mockPrograms: TrainingProgram[] = [
        { 
          id: 1, 
          name: 'Programme Musculation', 
          description: 'Description',
          difficultyLevel: 'Débutant',
          category: 'Musculation',
          targetAudience: 'Débutants',
          createdByUserId: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        { 
          id: 2, 
          name: 'Programme Cardio', 
          description: 'Description',
          difficultyLevel: 'Intermédiaire',
          category: 'Cardio',
          targetAudience: 'Sportifs confirmés',
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
      component.programs = mockPrograms;
      component.searchTerm = 'Débutant';
      
      component.groupProgramsByCategory();
      
      expect(component.categoryGroups[0].programs.length).toBe(1);
      expect(component.categoryGroups[0].programs[0].name).toBe('Programme Débutant');
    });

    it('should filter programs by difficulty', () => {
      component.programs = mockPrograms;
      component.selectedDifficulty = 'Débutant';
      
      component.groupProgramsByCategory();
      
      expect(component.categoryGroups[0].programs.length).toBe(1);
      expect(component.categoryGroups[0].programs[0].difficultyLevel).toBe('Débutant');
    });

    it('should filter programs by audience', () => {
      component.programs = mockPrograms;
      component.selectedAudience = 'Débutants';
      
      component.groupProgramsByCategory();
      
      expect(component.categoryGroups[0].programs.length).toBe(1);
      expect(component.categoryGroups[0].programs[0].targetAudience).toBe('Débutants');
    });

    it('should clear filters', () => {
      component.searchTerm = 'test';
      component.selectedDifficulty = 'Débutant';
      component.selectedAudience = 'Débutants';
      
      component.clearFilters();
      
      expect(component.searchTerm).toBe('');
      expect(component.selectedDifficulty).toBe('');
      expect(component.selectedAudience).toBe('');
    });
  });

  describe('Navigation et actions', () => {
    it('should navigate to program details', () => {
      const programId = 1;
      
      component.viewProgram(programId);
      
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/programs', programId]);
    });

    it('should add program to user', () => {
      const programId = 1;
      
      spyOn(localStorage, 'getItem').and.returnValue('mock-token');
      
      component.addProgramToUser(programId);
      
      expect(trainingProgramService.addProgramToUser).toHaveBeenCalledWith(programId);
    });

    it('should handle scroll left', () => {
      component.categoryGroups = [
        {
          category: 'Musculation',
          icon: '💪',
          programs: mockPrograms
        }
      ];
      
      component.scrollLeft(0);
      
      expect(component.categoryGroups.length).toBe(1);
    });

    it('should handle scroll right', () => {
      component.categoryGroups = [
        {
          category: 'Musculation',
          icon: '💪',
          programs: mockPrograms
        }
      ];
      
      component.scrollRight(0);
      
      expect(component.categoryGroups.length).toBe(1);
    });
  });

  describe('Utilitaires', () => {
    it('should get difficulty color', () => {
      expect(component.getDifficultyColor('Débutant')).toBe('#10B981');
      expect(component.getDifficultyColor('Intermédiaire')).toBe('#F59E0B');
      expect(component.getDifficultyColor('Avancé')).toBe('#EF4444');
      expect(component.getDifficultyColor('Autre')).toBe('#6B7280');
    });

    it('should get category icon', () => {
      expect(component.getCategoryIcon('Musculation')).toBe('💪');
      expect(component.getCategoryIcon('Cardio')).toBe('❤️');
      expect(component.getCategoryIcon('Flexibilité')).toBe('🧘');
      expect(component.getCategoryIcon('Mixte')).toBe('⚡');
      expect(component.getCategoryIcon('Autre')).toBe('🏋️');
    });

    it('should get category color', () => {
      expect(component.getCategoryColor('Musculation')).toContain('linear-gradient');
      expect(component.getCategoryColor('Cardio')).toContain('linear-gradient');
      expect(component.getCategoryColor('Flexibilité')).toContain('linear-gradient');
      expect(component.getCategoryColor('Mixte')).toContain('linear-gradient');
    });

    it('should get card color', () => {
      expect(component.getCardColor('Musculation')).toBe('rgba(102, 126, 234, 0.15)');
      expect(component.getCardColor('Cardio')).toBe('rgba(240, 147, 251, 0.15)');
      expect(component.getCardColor('Flexibilité')).toBe('rgba(79, 172, 254, 0.15)');
      expect(component.getCardColor('Mixte')).toBe('rgba(67, 233, 123, 0.15)');
    });

    it('should format duration', () => {
      expect(component.formatDuration(30)).toBe('30 min');
      expect(component.formatDuration(60)).toBe('1h');
      expect(component.formatDuration(90)).toBe('1h30');
    });

    it('should get total programs count', () => {
      component.programs = mockPrograms;
      expect(component.getTotalPrograms()).toBe(2);
    });
  });

  describe('Gestion des événements', () => {
    it('should handle search change', () => {
      spyOn(component, 'applyFilters');
      
      component.onSearchChange();
      
      expect(component.applyFilters).toHaveBeenCalled();
    });

    it('should handle filter change', () => {
      spyOn(component, 'applyFilters');
      
      component.onFilterChange();
      
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });
}); 