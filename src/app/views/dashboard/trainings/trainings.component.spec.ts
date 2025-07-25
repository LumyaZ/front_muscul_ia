import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainingsComponent } from './trainings.component';

describe('TrainingsComponent', () => {
  let component: TrainingsComponent;
  let fixture: ComponentFixture<TrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Mes Entraînements');
  });

  it('should display trainings section', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Entraînements récents');
  });

  it('should display filter button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Filtrer');
  });
}); 