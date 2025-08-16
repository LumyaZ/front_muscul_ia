import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ProgramsComponent } from './programs.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { of, throwError } from 'rxjs';
import { TrainingProgram } from '../../../models/training-program.model';

/**
 * Unit tests for ProgramsComponent.
 * Tests unitaires pour ProgramsComponent.
 */
describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;
  let mockTrainingProgramService: jasmine.SpyObj<TrainingProgramService>;

  const mockPrograms: TrainingProgram[] = [
    {
      id: 1,
      name: 'Program 1',
      description: 'Description 1',
      category: 'Strength',
      difficultyLevel: 'Beginner',
      targetAudience: 'Débutants',
      createdByUserId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    {
      id: 2,
      name: 'Program 2',
      description: 'Description 2',
      category: 'Cardio',
      difficultyLevel: 'Intermediate',
      targetAudience: 'Sportifs confirmés',
      createdByUserId: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TrainingProgramService', ['getPublicPrograms', 'addProgramToUser']);

    await TestBed.configureTestingModule({
      imports: [
        ProgramsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: TrainingProgramService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsComponent);
    component = fixture.componentInstance;
    mockTrainingProgramService = TestBed.inject(TrainingProgramService) as jasmine.SpyObj<TrainingProgramService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.programs).toEqual([]);
    expect(component.categoryGroups).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
    expect(component.searchTerm).toBe('');
    expect(component.selectedDifficulty).toBe('');
    expect(component.selectedAudience).toBe('');
    expect(component.showOnlyPublic).toBe(true);
  });

  it('should load programs successfully', fakeAsync(() => {
    mockTrainingProgramService.getPublicPrograms.and.returnValue(of(mockPrograms));

    component.loadPrograms();
    tick();

    expect(mockTrainingProgramService.getPublicPrograms).toHaveBeenCalled();
    expect(component.programs).toEqual(mockPrograms);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  }));

  it('should handle error when loading programs fails', fakeAsync(() => {
    mockTrainingProgramService.getPublicPrograms.and.returnValue(throwError(() => new Error('Network error')));

    component.loadPrograms();
    tick();

    expect(component.error).toBe('Erreur lors du chargement des programmes');
    expect(component.loading).toBe(false);
  }));

  it('should group programs by category', () => {
    component.programs = mockPrograms;
    
    component.groupProgramsByCategory();

    expect(component.categoryGroups.length).toBe(2);
    expect(component.categoryGroups[0].category).toBe('Strength');
    expect(component.categoryGroups[1].category).toBe('Cardio');
  });

  it('should filter programs by search term', () => {
    component.programs = mockPrograms;
    component.searchTerm = 'Program 1';
    
    component.groupProgramsByCategory();

    expect(component.categoryGroups.length).toBe(1);
    expect(component.categoryGroups[0].programs.length).toBe(1);
    expect(component.categoryGroups[0].programs[0].name).toBe('Program 1');
  });

  it('should filter programs by difficulty level', () => {
    component.programs = mockPrograms;
    component.selectedDifficulty = 'Beginner';
    
    component.groupProgramsByCategory();

    expect(component.categoryGroups.length).toBe(1);
    expect(component.categoryGroups[0].programs.length).toBe(1);
    expect(component.categoryGroups[0].programs[0].difficultyLevel).toBe('Beginner');
  });

  it('should filter programs by audience', () => {
    component.programs = mockPrograms;
    component.selectedAudience = 'Débutants';
    
    component.groupProgramsByCategory();

    expect(component.categoryGroups.length).toBe(1);
    expect(component.categoryGroups[0].programs.length).toBe(1);
    expect(component.categoryGroups[0].programs[0].targetAudience).toBe('Débutants');
  });

  it('should apply filters with animation', fakeAsync(() => {
    spyOn(component, 'groupProgramsByCategory');
    
    component.applyFilters();
    tick(150);

    expect(component.groupProgramsByCategory).toHaveBeenCalled();
  }));

  it('should clear all filters', () => {
    component.searchTerm = 'test';
    component.selectedDifficulty = 'Beginner';
    component.selectedAudience = 'Débutants';
    component.showOnlyPublic = false;
    spyOn(component, 'applyFilters');

    component.clearFilters();

    expect(component.searchTerm).toBe('');
    expect(component.selectedDifficulty).toBe('');
    expect(component.selectedAudience).toBe('');
    expect(component.showOnlyPublic).toBe(true);
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should return correct color for difficulty levels', () => {
    expect(component.getDifficultyColor('Débutant')).toBe('#10B981');
    expect(component.getDifficultyColor('Intermédiaire')).toBe('#F59E0B');
    expect(component.getDifficultyColor('Avancé')).toBe('#EF4444');
    expect(component.getDifficultyColor('Unknown')).toBe('#6B7280');
  });

  it('should return correct category icons', () => {
    expect(component.getCategoryIcon('Musculation')).toBe('💪');
    expect(component.getCategoryIcon('Cardio')).toBe('❤️');
    expect(component.getCategoryIcon('Flexibilité')).toBe('🧘');
    expect(component.getCategoryIcon('Mixte')).toBe('⚡');
    expect(component.getCategoryIcon('Unknown')).toBe('🏋️');
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(30)).toBe('30 min');
    expect(component.formatDuration(60)).toBe('1h');
    expect(component.formatDuration(90)).toBe('1h30');
    expect(component.formatDuration(120)).toBe('2h');
  });

  it('should get total number of programs', () => {
    component.programs = mockPrograms;
    component.groupProgramsByCategory();
    
    expect(component.getTotalPrograms()).toBe(2);
  });

  it('should handle search input changes', () => {
    spyOn(component, 'applyFilters');
    
    component.onSearchChange();
    
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should handle filter changes', () => {
    spyOn(component, 'applyFilters');
    
    component.onFilterChange();
    
    expect(component.applyFilters).toHaveBeenCalled();
  });
}); 