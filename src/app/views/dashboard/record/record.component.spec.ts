import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordComponent } from './record.component';

describe('RecordComponent', () => {
  let component: RecordComponent;
  let fixture: ComponentFixture<RecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display page title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Enregistrer un Entraînement');
  });

  it('should display form fields', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Nom de l\'entraînement');
    expect(compiled.textContent).toContain('Date');
    expect(compiled.textContent).toContain('Durée');
    expect(compiled.textContent).toContain('Type d\'entraînement');
  });

  it('should display action buttons', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Annuler');
    expect(compiled.textContent).toContain('Enregistrer');
  });

  it('should display quick actions', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Actions rapides');
    expect(compiled.textContent).toContain('Démarrer un entraînement');
  });
}); 