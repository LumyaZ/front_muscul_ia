import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TrainingRecapComponent } from './training-recap.component';
import { TrainingSessionService } from '../../../../services/training-session.service';

describe('TrainingRecapComponent', () => {
  let component: TrainingRecapComponent;
  let fixture: ComponentFixture<TrainingRecapComponent>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTrainingSessionService: jasmine.SpyObj<TrainingSessionService>;

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: of({
        sessionId: '123',
        duration: '1800',
        completed: 'true'
      })
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const trainingSessionServiceSpy = jasmine.createSpyObj('TrainingSessionService', ['createTrainingSession']);

    await TestBed.configureTestingModule({
      imports: [TrainingRecapComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TrainingSessionService, useValue: trainingSessionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingRecapComponent);
    component = fixture.componentInstance;
    mockActivatedRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockTrainingSessionService = TestBed.inject(TrainingSessionService) as jasmine.SpyObj<TrainingSessionService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recap data on init', () => {
    component.ngOnInit();

    expect(component.recap).toBeDefined();
    expect(component.recap?.sessionId).toBe(123);
    expect(component.recap?.duration).toBe(1800);
    expect(component.recap?.completed).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(3661)).toBe('01:01:01');
    expect(component.formatTime(0)).toBe('00:00:00');
    expect(component.formatTime(3600)).toBe('01:00:00');
    expect(component.formatTime(65)).toBe('00:01:05');
  });

  it('should change rating', () => {
    expect(component.rating).toBe(5);

    component.onRatingChange(3);
    expect(component.rating).toBe(3);

    component.onRatingChange(1);
    expect(component.rating).toBe(1);
  });

  it('should get rating stars correctly', () => {
    component.rating = 3;
    const stars = component.getRatingStars();

    expect(stars).toEqual([true, true, true, false, false]);
  });

  it('should get completion message for completed training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: true,
      exercises: []
    };

    expect(component.getCompletionMessage()).toBe('Félicitations ! Vous avez terminé votre entraînement.');
  });

  it('should get completion message for interrupted training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: false,
      exercises: []
    };

    expect(component.getCompletionMessage()).toBe('Vous avez arrêté votre entraînement. Votre progression a été sauvegardée.');
  });

  it('should get completion icon for completed training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: true,
      exercises: []
    };

    expect(component.getCompletionIcon()).toBe('fas fa-trophy');
  });

  it('should get completion icon for interrupted training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: false,
      exercises: []
    };

    expect(component.getCompletionIcon()).toBe('fas fa-pause-circle');
  });

  it('should get completion color for completed training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: true,
      exercises: []
    };

    expect(component.getCompletionColor()).toBe('#4CAF50');
  });

  it('should get completion color for interrupted training', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: false,
      exercises: []
    };

    expect(component.getCompletionColor()).toBe('#FF9800');
  });

  it('should save recap and navigate to dashboard', () => {
    component.recap = {
      sessionId: 123,
      duration: 1800,
      completed: true,
      exercises: []
    };
    component.title = 'Mon entraînement';
    component.rating = 4;
    component.notes = 'Très bon entraînement';

    component.saveRecap();

    expect(component.recap?.title).toBe('Mon entraînement');
    expect(component.recap?.rating).toBe(4);
    expect(component.recap?.notes).toBe('Très bon entraînement');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate back to dashboard', () => {
    component.onBack();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle missing query params gracefully', () => {
    // Simulate missing query params
    (mockActivatedRoute.queryParams as any) = of({});

    component.ngOnInit();

    expect(component.recap?.sessionId).toBeUndefined();
    expect(component.recap?.duration).toBe(0);
    expect(component.recap?.completed).toBe(false);
  });

  it('should handle invalid duration param', () => {
    (mockActivatedRoute.queryParams as any) = of({
      sessionId: '123',
      duration: 'invalid',
      completed: 'true'
    });

    component.ngOnInit();

    expect(component.recap?.duration).toBe(0);
  });

  it('should handle completed as false string', () => {
    (mockActivatedRoute.queryParams as any) = of({
      sessionId: '123',
      duration: '1800',
      completed: 'false'
    });

    component.ngOnInit();

    expect(component.recap?.completed).toBe(false);
  });

  it('should handle missing session data', () => {
    component.recap = null;

    expect(component.getCompletionMessage()).toBe('Félicitations ! Vous avez terminé votre entraînement.');
    expect(component.getCompletionIcon()).toBe('fas fa-trophy');
    expect(component.getCompletionColor()).toBe('#4CAF50');
  });

  it('should initialize with default values', () => {
    expect(component.title).toBe('');
    expect(component.rating).toBe(5);
    expect(component.notes).toBe('');
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  });
}); 