import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsComponent } from './programs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrainingProgram } from '../../../services/training-program.service';

describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramsComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain("Programmes d'entraînement");
  });

  it('should display programs section', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Découvrez et choisissez parmi nos programmes d\'entraînement');
  });

  it('should display refresh button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Actualiser');
  });

  // Pour tester l'affichage des programmes, il faut mocker les données
  it('should display program cards', () => {
    // Mock des programmes avec la structure complète
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
        name: 'Programme Intermédiaire', 
        description: 'Description du programme intermédiaire',
        difficultyLevel: 'Intermédiaire',
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
      },
      { 
        id: 3, 
        name: 'Programme Cardio', 
        description: 'Description du programme cardio',
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
    
    // Simuler le chargement des programmes
    component.programs = mockPrograms;
    component.loading = false;
    component.groupProgramsByCategory();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Programme Débutant');
    expect(compiled.textContent).toContain('Programme Intermédiaire');
    expect(compiled.textContent).toContain('Programme Cardio');
  });
}); 