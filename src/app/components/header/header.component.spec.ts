import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user from localStorage on init', () => {
    const mockUser = { id: 1, email: 'test@example.com', profile: { firstName: 'John' } };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    
    component.ngOnInit();
    
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should handle localStorage parsing error gracefully', () => {
    spyOn(localStorage, 'getItem').and.returnValue('invalid json');
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(component.currentUser).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle logout correctly', () => {
    spyOn(localStorage, 'removeItem');
    
    component.onLogout();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login page when onLogin is called', () => {
    component.onLogin();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to dashboard on logo click when user is connected', () => {
    component.currentUser = { id: 1, email: 'test@example.com' };
    
    component.onLogoClick();
    
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to home on logo click when user is not connected', () => {
    component.currentUser = null;
    
    component.onLogoClick();
    
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle profile click when user is connected', () => {
    component.currentUser = { id: 1, email: 'test@example.com' };
    spyOn(console, 'log');
    
    component.onProfileClick();
    
    expect(console.log).toHaveBeenCalledWith('Navigation vers le profil');
  });

  it('should navigate to login when profile click and user is not connected', () => {
    component.currentUser = null;
    
    component.onProfileClick();
    
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
}); 