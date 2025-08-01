import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavBarComponent, NavItem } from './nav-bar.component';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

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
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  /**
   * Test component creation
   * Test de création du composant
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test component initialization
   * Test d'initialisation du composant
   */
  it('should initialize component correctly', () => {
    expect(component.currentRoute).toBe('');
    expect(component.error).toBeNull();
    expect(component.isLoading).toBeFalse();
    expect(component.navItems.length).toBe(5);
  });

  /**
   * Test navigation items structure
   * Test de la structure des éléments de navigation
   */
  it('should have correct navigation items structure', () => {
    const expectedItems = [
      { label: 'Accueil', icon: 'fas fa-home', route: '/dashboard/home' },
      { label: 'Entraînements', icon: 'fas fa-dumbbell', route: '/dashboard/trainings' },
      { label: 'Enregistrer', icon: 'fas fa-plus-circle', route: '/dashboard/record' },
      { label: 'Programmes', icon: 'fas fa-list-alt', route: '/dashboard/programs' },
      { label: 'Vous', icon: 'fas fa-user', route: '/dashboard/you' }
    ];

    component.navItems.forEach((item, index) => {
      expect(item.label).toBe(expectedItems[index].label);
      expect(item.icon).toBe(expectedItems[index].icon);
      expect(item.route).toBe(expectedItems[index].route);
    });
  });

  /**
   * Test active state update on init
   * Test de mise à jour de l'état actif lors de l'initialisation
   */
  it('should update active state on init', () => {
    component.currentRoute = '/dashboard/home';
    
    component.ngOnInit();
    
    const homeItem = component.navItems.find(item => item.route === '/dashboard/home');
    expect(homeItem?.isActive).toBeTrue();
  });

  /**
   * Test active state update on changes
   * Test de mise à jour de l'état actif lors des changements
   */
  it('should update active state on changes', () => {
    component.currentRoute = '/dashboard/trainings';
    
    component.ngOnChanges();
    
    const trainingsItem = component.navItems.find(item => item.route === '/dashboard/trainings');
    expect(trainingsItem?.isActive).toBeTrue();
  });

  /**
   * Test successful navigation
   * Test de navigation réussie
   */
  it('should handle successful navigation', () => {
    spyOn(console, 'log');
    const testItem: NavItem = component.navItems[0];
    
    component.onNavItemClick(testItem);
    
    expect(console.log).toHaveBeenCalledWith(`Navigation vers: ${testItem.route}`);
    expect(mockRouter.navigate).toHaveBeenCalledWith([testItem.route]);
    expect(component.isLoading).toBeFalse();
    expect(component.error).toBeNull();
  });

  /**
   * Test navigation error handling
   * Test de gestion d'erreur lors de la navigation
   */
  it('should handle navigation error', () => {
    spyOn(console, 'log');
    spyOn(console, 'error');
    mockRouter.navigate.and.throwError('Navigation error');
    const testItem: NavItem = component.navItems[0];
    
    component.onNavItemClick(testItem);
    
    expect(console.error).toHaveBeenCalledWith('Erreur lors de la navigation:', jasmine.any(Error));
    expect(component.error).toBe('Erreur lors de la navigation');
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test active class for active item
   * Test de classe active pour l'élément actif
   */
  it('should return active class for active item', () => {
    const testItem: NavItem = component.navItems[0];
    testItem.isActive = true;
    
    const result = component.getActiveClass(testItem);
    
    expect(result).toBe('active');
  });

  /**
   * Test empty string for inactive item
   * Test de chaîne vide pour l'élément inactif
   */
  it('should return empty string for inactive item', () => {
    const testItem: NavItem = component.navItems[0];
    testItem.isActive = false;
    
    const result = component.getActiveClass(testItem);
    
    expect(result).toBe('');
  });

  /**
   * Test error clearing functionality
   * Test de fonctionnalité d'effacement d'erreur
   */
  it('should clear error correctly', () => {
    component.error = 'Test error';
    component.clearError();
    expect(component.error).toBeNull();
  });

  /**
   * Test loading state during navigation
   * Test d'état de chargement lors de la navigation
   */
  it('should set loading state during navigation', () => {
    const testItem: NavItem = component.navItems[0];
    
    component.onNavItemClick(testItem);
    
    expect(component.isLoading).toBeFalse();
  });

  /**
   * Test disabled state when loading
   * Test d'état désactivé lors du chargement
   */
  it('should disable buttons when loading', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const navButtons = fixture.nativeElement.querySelectorAll('.nav-button');
    navButtons.forEach((button: any) => {
      expect(button.disabled).toBeTrue();
    });
  });

  /**
   * Test error message display
   * Test d'affichage du message d'erreur
   */
  it('should display error message when error exists', () => {
    component.error = 'Test error message';
    fixture.detectChanges();
    
    const errorMessage = fixture.nativeElement.querySelector('.error-message');
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.textContent).toContain('Test error message');
  });
}); 