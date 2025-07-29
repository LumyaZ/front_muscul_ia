import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserTrainingsComponent } from './user-trainings.component';

describe('UserTrainingsComponent', () => {
  let component: UserTrainingsComponent;
  let fixture: ComponentFixture<UserTrainingsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserTrainingsComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTrainingsComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default tab as current', () => {
    expect(component.activeTab).toBe('current');
  });

  it('should change active tab when setActiveTab is called', () => {
    component.setActiveTab('completed');
    expect(component.activeTab).toBe('completed');

    component.setActiveTab('current');
    expect(component.activeTab).toBe('current');
  });

  it('should call loadTrainings on init', () => {
    spyOn(component, 'loadTrainings');
    
    component.ngOnInit();
    
    expect(component.loadTrainings).toHaveBeenCalled();
  });

  it('should navigate to profile when goBackToProfile is called', () => {
    component.goBackToProfile();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/profile']);
  });

  it('should call loadTrainings when refreshTrainings is called', () => {
    spyOn(component, 'loadTrainings');
    
    component.refreshTrainings();
    
    expect(component.loadTrainings).toHaveBeenCalled();
  });
}); 