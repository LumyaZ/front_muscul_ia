# Architecture Frontend - Muscul IA

## Vue d'ensemble

L'application frontend Muscul IA est construite avec Angular 17 et suit une architecture modulaire basée sur les composants.

## Structure du projet

```
src/
├── app/
│   ├── components/          # Composants réutilisables
│   │   ├── header/         # En-tête de l'application
│   │   ├── nav-bar/        # Barre de navigation
│   │   ├── profile-edit-modal/
│   │   └── training-edit-modal/
│   ├── views/              # Pages principales
│   │   ├── auth/           # Authentification
│   │   ├── dashboard/      # Tableau de bord
│   │   ├── home/           # Page d'accueil
│   │   ├── profile/        # Profil utilisateur
│   │   └── training-info/  # Informations d'entraînement
│   ├── services/           # Services métier
│   │   ├── auth.service.ts
│   │   ├── exercise.service.ts
│   │   └── training.service.ts
│   ├── models/             # Modèles de données
│   │   ├── user.model.ts
│   │   ├── exercise.model.ts
│   │   └── training.model.ts
│   ├── constants/          # Constantes
│   │   └── storage.constants.ts
│   ├── interceptors/       # Intercepteurs HTTP
│   │   └── auth.interceptor.ts
│   ├── app.component.ts    # Composant racine
│   ├── app.routes.ts       # Configuration des routes
│   └── app.config.ts       # Configuration de l'app
├── environments/           # Configuration par environnement
├── styles/                # Styles globaux
└── assets/                # Ressources statiques
```

## Technologies utilisées

### Framework principal
- **Angular 17** - Framework de développement
- **TypeScript 5.x** - Langage de programmation
- **RxJS** - Programmation réactive

### UI/UX
- **SCSS** - Préprocesseur CSS
- **Angular Material** - Composants UI (optionnel)
- **Glassmorphism** - Design system personnalisé

### Outils de développement
- **ESLint** - Analyse statique du code
- **Prettier** - Formatage automatique
- **Jasmine/Karma** - Tests unitaires
- **Cypress** - Tests end-to-end

## Patterns architecturaux

### 1. Architecture par composants
```typescript
@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-card.component.html',
  styleUrls: ['./exercise-card.component.scss']
})
export class ExerciseCardComponent {
  @Input() exercise!: Exercise;
  @Output() exerciseSelected = new EventEmitter<Exercise>();
}
```

### 2. Services injectables
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  constructor(private http: HttpClient) {}
  
  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>('/api/exercises');
  }
}
```

### 3. Modèles de données
```typescript
export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
  equipment: Equipment;
  difficulty: ExperienceLevel;
}
```

## Flux de données

### 1. Flux unidirectionnel
```
Component → Service → HTTP → Backend
    ↑                                    ↓
Component ← Service ← HTTP ← Backend
```

### 2. Gestion d'état
- **Services** - État global de l'application
- **Composants** - État local des composants
- **RxJS** - Gestion des flux de données

### 3. Communication entre composants
- **@Input/@Output** - Communication parent/enfant
- **Services** - Communication entre composants non liés
- **EventEmitter** - Événements personnalisés

## Sécurité

### 1. Authentification
- **JWT** - Tokens d'authentification
- **Interceptor HTTP** - Ajout automatique des headers
- **Guards** - Protection des routes

### 2. Validation des données
- **Validators Angular** - Validation côté client
- **TypeScript** - Typage strict
- **Sanitization** - Protection XSS

## Responsive Design

### 1. Breakpoints
```scss
$mobile: 320px;
$tablet: 768px;
$desktop: 1024px;
$large: 1440px;
```

### 2. Composants adaptatifs
- **Flexbox/Grid** - Layouts flexibles
- **Media Queries** - Adaptation par écran
- **Touch-friendly** - Interface tactile

## Tests

### 1. Tests unitaires
```typescript
describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });
});
```

### 2. Tests d'intégration
- **Services** - Tests des appels HTTP
- **Composants** - Tests des interactions
- **Guards** - Tests de protection des routes

## Performance

### 1. Optimisations
- **OnPush** - Détection de changements optimisée
- **Lazy Loading** - Chargement à la demande
- **Tree Shaking** - Élimination du code inutilisé

### 2. Monitoring
- **Angular DevTools** - Profiling des composants
- **Lighthouse** - Métriques de performance
- **Bundle Analyzer** - Analyse de la taille des bundles

## Configuration

### 1. Environnements
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  version: '1.0.0'
};
```

### 2. Build
```bash
# Développement
ng serve

# Production
ng build --configuration production

# Tests
ng test
```

## Métriques

### 1. Performance
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1

### 2. Qualité du code
- **Couverture de tests** ≥ 80%
- **Complexité cyclomatique** ≤ 10
- **Maintenabilité** A (ESLint) 