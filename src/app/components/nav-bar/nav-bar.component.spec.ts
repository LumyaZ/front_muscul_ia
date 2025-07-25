import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavBarComponent } from './nav-bar.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [NavBarComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 navigation items', () => {
    expect(component.navItems.length).toBe(5);
  });

  it('should have correct navigation items structure', () => {
    const expectedItems = [
      { label: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
      { label: 'Entraînements', icon: 'fas fa-dumbbell', route: '/workouts' },
      { label: 'Progression', icon: 'fas fa-chart-line', route: '/progress' },
      { label: 'Nutrition', icon: 'fas fa-apple-alt', route: '/nutrition' },
      { label: 'Communauté', icon: 'fas fa-users', route: '/community' }
    ];

    component.navItems.forEach((item, index) => {
      expect(item.label).toBe(expectedItems[index].label);
      expect(item.icon).toBe(expectedItems[index].icon);
      expect(item.route).toBe(expectedItems[index].route);
    });
  });

  it('should update active state on init', () => {
    component.currentRoute = '/dashboard';
    
    component.ngOnInit();
    
    const dashboardItem = component.navItems.find(item => item.route === '/dashboard');
    expect(dashboardItem?.isActive).toBeTrue();
  });

  it('should update active state on changes', () => {
    component.currentRoute = '/workouts';
    
    component.ngOnChanges();
    
    const workoutsItem = component.navItems.find(item => item.route === '/workouts');
    expect(workoutsItem?.isActive).toBeTrue();
  });

  it('should handle nav item click', () => {
    spyOn(console, 'log');
    const testItem = component.navItems[0];
    
    component.onNavItemClick(testItem);
    
    expect(console.log).toHaveBeenCalledWith(`Navigation vers: ${testItem.route}`);
  });

  it('should return active class for active item', () => {
    const testItem = component.navItems[0];
    testItem.isActive = true;
    
    const result = component.getActiveClass(testItem);
    
    expect(result).toBe('active');
  });

  it('should return empty string for inactive item', () => {
    const testItem = component.navItems[0];
    testItem.isActive = false;
    
    const result = component.getActiveClass(testItem);
    
    expect(result).toBe('');
  });
}); 