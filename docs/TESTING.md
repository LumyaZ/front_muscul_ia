# Guide des Tests - Frontend Muscul IA

## 🧪 Vue d'ensemble

Ce guide décrit les stratégies et outils de test pour l'application frontend Angular.

## 📋 Types de tests

### 1. Tests unitaires
- **Composants** - Logique et interactions
- **Services** - Méthodes et appels HTTP
- **Pipes** - Transformations de données
- **Guards** - Protection des routes

### 2. Tests d'intégration
- **Services** - Communication avec l'API
- **Composants** - Interactions entre composants
- **Modules** - Fonctionnalités complètes

### 3. Tests end-to-end
- **Scénarios utilisateur** - Parcours complets
- **Workflows** - Processus métier
- **Responsive** - Adaptation mobile/desktop

## Outils de test

### Framework principal
- **Jasmine** - Framework de test
- **Karma** - Runner de tests
- **Angular Testing Utilities** - Utilitaires Angular

### Tests E2E
- **Cypress** - Tests end-to-end
- **Playwright** - Tests cross-browser (optionnel)

### Outils de qualité
- **ESLint** - Analyse statique
- **Prettier** - Formatage
- **SonarQube** - Qualité du code

## 🚀 Configuration

### 1. Tests unitaires
```bash
# Lancer tous les tests
ng test

# Tests en mode watch
ng test --watch

# Tests avec couverture
ng test --code-coverage

# Tests spécifiques
ng test --include="**/auth.service.spec.ts"
```

### 2. Tests E2E
```bash
# Lancer Cypress
ng e2e

# Cypress en mode interactif
npx cypress open

# Cypress en mode headless
npx cypress run
```

## Exemples de tests

### 1. Test de service
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login user successfully', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const loginData = { email: 'test@example.com', password: 'password' };

    service.login(loginData).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
```

### 2. Test de composant
```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['login']);
    
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login service on form submit', () => {
    const loginData = { email: 'test@example.com', password: 'password' };
    authService.login.and.returnValue(of({ id: 1, email: 'test@example.com' }));

    component.loginForm.patchValue(loginData);
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(loginData);
  });
});
```

### 3. Test de guard
```typescript
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

## Métriques de qualité

### 1. Couverture de code
- **Minimum requis :** 80%
- **Objectif :** 90%
- **Services :** 100%
- **Composants :** 85%

### 2. Types de couverture
- **Statements** - Instructions exécutées
- **Branches** - Conditions testées
- **Functions** - Fonctions appelées
- **Lines** - Lignes de code

### 3. Rapports de couverture
```bash
# Générer le rapport
ng test --code-coverage

# Ouvrir le rapport
open coverage/index.html
```

## Configuration avancée

### 1. Karma configuration
```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    }
  });
};
```

### 2. Cypress configuration
```javascript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
});
```

## 🎯 Bonnes pratiques

### 1. Nommage des tests
```typescript
//  Bon
describe('AuthService', () => {
  it('should return user when login is successful', () => {
    // test
  });
});

//  Éviter
describe('AuthService', () => {
  it('should work', () => {
    // test
  });
});
```

### 2. Structure AAA
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(30);
});
```

### 3. Mocks et stubs
```typescript
// Mock de service
const mockAuthService = {
  login: jasmine.createSpy('login').and.returnValue(of(mockUser)),
  logout: jasmine.createSpy('logout')
};

// Stub de données
const mockExercises = [
  { id: 1, name: 'Push-ups' },
  { id: 2, name: 'Pull-ups' }
];
```

## Tests critiques

### 1. Authentification
- Connexion réussie
- Connexion échouée
- Déconnexion
- Protection des routes

### 2. Gestion des erreurs
- Erreurs réseau
- Erreurs de validation
- Messages d'erreur appropriés

### 3. Responsive design
- Adaptation mobile
- Adaptation tablette
- Adaptation desktop

## Monitoring des tests

### 1. Intégration continue
```yaml
# .github/workflows/tests.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run e2e
```

### 2. Rapports automatiques
- **Couverture** - Générée à chaque build
- **Tests E2E** - Screenshots en cas d'échec
- **Performance** - Métriques de temps d'exécution

## 🔍 Debugging des tests

### 1. Tests unitaires
```bash
# Debug avec Chrome DevTools
ng test --browsers Chrome --watch
```

### 2. Tests E2E
```bash
# Mode debug Cypress
npx cypress open --config video=false
```

### 3. Logs détaillés
```typescript
// Activer les logs dans les tests
beforeEach(() => {
  spyOn(console, 'log');
});
``` 