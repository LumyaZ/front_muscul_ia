import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsComponent } from './programs.component';

describe('ProgramsComponent', () => {
  let component: ProgramsComponent;
  let fixture: ComponentFixture<ProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramsComponent]
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
    expect(compiled.textContent).toContain('Mes Programmes');
  });

  it('should display programs section', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Programmes disponibles');
  });

  it('should display create button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Créer un programme');
  });

  it('should display program cards', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Programme Débutant');
    expect(compiled.textContent).toContain('Programme Intermédiaire');
    expect(compiled.textContent).toContain('Programme Cardio');
  });
}); 