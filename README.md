# Muscul IA - Frontend Angular

## 📋 Description
Frontend Angular pour l'application Muscul IA - interface utilisateur moderne pour la gestion des programmes d'entraînement de musculation avec système d'authentification complet.

## 🏗️ Architecture

### Structure du projet
```
src/app/
├── components/          # Composants réutilisables
│   ├── header/         # En-tête de l'application
│   ├── nav-bar/        # Barre de navigation
│   ├── profile-edit-modal/
│   └── training-edit-modal/
├── views/              # Pages principales
│   ├── auth/           # Authentification
│   ├── dashboard/      # Tableau de bord
│   ├── home/           # Page d'accueil
│   ├── profile/        # Profil utilisateur
│   └── training-info/  # Informations d'entraînement
├── services/           # Services métier
├── models/             # Modèles de données
├── constants/          # Constantes
├── interceptors/       # Intercepteurs HTTP
├── app.routes.ts       # Configuration des routes
├── app.component.ts    # Composant principal
└── app.config.ts       # Configuration de l'app

docs/                   # Documentation
├── README.md           # Guide de documentation
├── ARCHITECTURE.md     # Architecture détaillée
└── TESTING.md          # Guide des tests

scripts/                # Scripts utilitaires
├── generate-docs.js    # Générateur de documentation
└── validate-docs.js    # Validateur de qualité
```

### Technologies utilisées
- **Angular 17** - Framework frontend
- **TypeScript** - Langage de programmation
- **SCSS** - Préprocesseur CSS
- **RxJS** - Programmation réactive
- **Angular Forms** - Gestion des formulaires
- **Angular Router** - Navigation
- **Angular HttpClient** - Requêtes HTTP
- **Standalone Components** - Architecture moderne

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ et npm
- Angular CLI 17+

### Installation des dépendances
```bash
# Installation des packages
npm install

# Ou avec yarn
yarn install
```

### Lancement en développement
```bash
# Serveur de développement
ng serve

# Avec port spécifique
ng serve --port 4200

# Avec host public
ng serve --host 0.0.0.0
```

L'application sera accessible sur : `http://localhost:4200`

### Build pour production
```bash
# Build optimisé
ng build --configuration production

# Build avec analyse
ng build --configuration production --stats-json
```

## 🔐 Authentification

### Flux d'authentification
1. **Inscription** : Formulaire avec validation email/mot de passe
2. **Connexion** : Authentification avec email/mot de passe
3. **Stockage** : Token et données utilisateur dans localStorage
4. **Navigation** : Redirection automatique vers le dashboard
5. **Protection** : Vérification d'authentification sur les pages protégées

### Service d'authentification
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(request: LoginRequest): Observable<User>
  signup(request: RegisterRequest): Observable<User>
  logout(): void
  isAuthenticated(): boolean
  getCurrentUser(): User | null
  getToken(): string | null
}
```

## Interface utilisateur

### Pages disponibles

#### Page de connexion (`/login`)
- Formulaire réactif avec validation
- Champs : email, mot de passe
- Validation en temps réel
- Messages d'erreur contextuels

#### Page d'inscription (`/signup`)
- Formulaire complet avec validation
- Champs : email, mot de passe, confirmation
- Validation de force du mot de passe
- Termes et conditions

#### Dashboard (`/dashboard`)
- Interface principale de l'application
- Navigation par onglets
- Vue d'ensemble des programmes
- Accès rapide aux fonctionnalités

## 🧪 Tests et Qualité

### Tests unitaires
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm test -- --watch

# Tests avec couverture
npm run test:coverage
```

### Tests E2E
```bash
# Lancer Cypress
ng e2e

# Cypress en mode interactif
npx cypress open
```

### Qualité du code
```bash
# Vérification ESLint
npm run lint

# Correction automatique
npm run lint:fix

# Formatage Prettier
npm run format

# Vérification du formatage
npm run format:check
```

### Documentation
```bash
# Générer la documentation
npm run docs:generate

# Valider la qualité
npm run docs:validate

# Tout en une fois
npm run docs:all
```

## Métriques de qualité

### Couverture de code
- **Minimum requis :** 80%
- **Objectif :** 90%
- **Services :** 100%
- **Composants :** 85%

### Standards de code
- **ESLint** - Règles strictes
- **Prettier** - Formatage automatique
- **TypeScript** - Typage strict
- **JSDoc** - Documentation complète

## 📖 Documentation

### Guides disponibles
- **Architecture :** `docs/ARCHITECTURE.md`
- **Tests :** `docs/TESTING.md`
- **Documentation :** `docs/README.md`

### Génération automatique
- **Documentation HTML :** `docs/index.html`
- **Rapport de validation :** `docs/validation/report.html`
- **Couverture de documentation :** `docs/validation/coverage.html`

## 🐳 Docker

### Construction de l'image
```bash
docker build -t muscul-ia-frontend .
```

### Lancement avec Docker
```bash
docker run -p 80:80 muscul-ia-frontend
```

## Scripts disponibles

### Développement
```bash
npm start          # Serveur de développement
npm run build      # Build de production
npm run watch      # Build en mode watch
```

### Tests
```bash
npm test           # Tests unitaires
npm run test:coverage  # Tests avec couverture
ng e2e             # Tests E2E
```

### Qualité
```bash
npm run lint       # Vérification ESLint
npm run lint:fix   # Correction ESLint
npm run format     # Formatage Prettier
npm run quality    # Vérification complète
```

### Documentation
```bash
npm run docs:generate  # Générer documentation
npm run docs:validate  # Valider documentation
npm run docs:all       # Tout en une fois
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code
- Suivre les règles ESLint
- Maintenir une couverture de tests ≥ 80%
- Documenter les nouvelles fonctionnalités
- Ajouter des tests pour les nouvelles fonctionnalités
