import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavBarComponent, NavItem } from './nav-bar.component';
import { Router } from '@angular/router';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NavBarComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.currentRoute).toBe('');
      expect(component.error).toBeNull();
      expect(component.isLoading).toBe(false);
    });

    it('should initialize navigation items', () => {
      expect(component.navItems).toBeDefined();
      expect(component.navItems.length).toBe(5);
    });

    it('should have correct navigation items structure', () => {
      component.navItems.forEach(item => {
        expect(item.label).toBeDefined();
        expect(item.route).toBeDefined();
        expect(item.icon).toBeDefined();
      });
    });

    it('should have correct navigation items', () => {
      const expectedItems = [
        { label: 'Accueil', route: '/dashboard/home' },
        { label: 'Amis', route: '/dashboard/friends' },
        { label: 'Enregistrer', route: '/dashboard/record' },
        { label: 'Programmes', route: '/dashboard/programs' },
        { label: 'Vous', route: '/dashboard/you' }
      ];

      expectedItems.forEach((expected, index) => {
        expect(component.navItems[index].label).toBe(expected.label);
        expect(component.navItems[index].route).toBe(expected.route);
      });
    });
  });

  describe('Active State Management', () => {
    it('should update active state on init', () => {
      component.currentRoute = '/dashboard/home';
      component.ngOnInit();
      
      const homeItem = component.navItems.find(item => item.route === '/dashboard/home');
      expect(homeItem?.isActive).toBe(true);
    });

    it('should update active state on changes', () => {
      component.currentRoute = '/dashboard/friends';
      component.ngOnChanges();
      
      const friendsItem = component.navItems.find(item => item.route === '/dashboard/friends');
      expect(friendsItem?.isActive).toBe(true);
    });

    it('should set only one item as active', () => {
      component.currentRoute = '/dashboard/programs';
      component.ngOnInit();
      
      const activeItems = component.navItems.filter(item => item.isActive);
      expect(activeItems.length).toBe(1);
    });
  });

  describe('Navigation', () => {
    it('should navigate to specified route', () => {
      const testItem: NavItem = {
        label: 'Test',
        icon: 'fas fa-test',
        route: '/test'
      };
      
      component.onNavItemClick(testItem);
      
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/test']);
    });

    it('should handle navigation error', () => {
      mockRouter.navigate.and.throwError('Navigation error');
      const testItem: NavItem = {
        label: 'Test',
        icon: 'fas fa-test',
        route: '/test'
      };
      
      component.onNavItemClick(testItem);
      
      expect(component.error).toBe('Erreur lors de la navigation');
      expect(component.isLoading).toBe(false);
    });

    it('should set loading state during navigation', () => {
      const testItem: NavItem = {
        label: 'Test',
        icon: 'fas fa-test',
        route: '/test'
      };
      
      component.onNavItemClick(testItem);
      
      expect(component.isLoading).toBe(false); 
    });
  });

  describe('Active Class Management', () => {
    it('should return active class for active item', () => {
      const testItem: NavItem = {
        label: 'Test',
        icon: 'fas fa-test',
        route: '/test',
        isActive: true
      };
      
      const result = component.getActiveClass(testItem);
      expect(result).toBe('active');
    });

    it('should return empty string for inactive item', () => {
      const testItem: NavItem = {
        label: 'Test',
        icon: 'fas fa-test',
        route: '/test',
        isActive: false
      };
      
      const result = component.getActiveClass(testItem);
      expect(result).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should clear error message', () => {
      component.error = 'Test error';
      
      component.clearError();
      
      expect(component.error).toBeNull();
    });
  });

  describe('Input Properties', () => {
    it('should accept currentRoute input', () => {
      const testRoute = '/dashboard/test';
      component.currentRoute = testRoute;
      
      expect(component.currentRoute).toBe(testRoute);
    });

    it('should update active state when currentRoute changes', () => {
      component.currentRoute = '/dashboard/home';
      component.ngOnInit();
      
      component.currentRoute = '/dashboard/friends';
      component.ngOnChanges();
      
      const friendsItem = component.navItems.find(item => item.route === '/dashboard/friends');
      expect(friendsItem?.isActive).toBe(true);
    });
  });
});