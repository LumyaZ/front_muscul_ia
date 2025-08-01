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

  it('should navigate to profile when goBackToProfile is called', () => {
    component.goBackToProfile();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/profile']);
  });
}); 