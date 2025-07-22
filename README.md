# Muscul IA - Frontend Angular

## 📋 Description
Frontend Angular pour l'application Muscul IA - interface utilisateur moderne pour la gestion des programmes d'entraînement de musculation avec système d'authentification complet.

## 🏗️ Architecture

### Structure du projet
```
src/app/
├── models/          # Modèles TypeScript
├── services/        # Services Angular
├── views/           # Composants de vues
│   ├── auth/        # Pages d'authentification
│   │   ├── login/   # Page de connexion
│   │   └── signup/  # Page d'inscription
│   └── dashboard/   # Tableau de bord
├── app.routes.ts    # Configuration des routes
├── app.ts           # Composant principal
└── app.html         # Template principal
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
  // Méthodes principales
  login(request: LoginRequest): Observable<User>
  signup(request: RegisterRequest): Observable<User>
  logout(): void
  isAuthenticated(): boolean
  getCurrentUser(): User | null
  getToken(): string | null
}
```

## 📱 Interface utilisateur

### Pages disponibles

#### Page de connexion (`/login`)
- Formulaire réactif avec validation
- Champs : email, mot de passe
- Validation en temps réel
- Gestion des erreurs
- Navigation vers inscription

#### Page d'inscription (`/signup`)
- Formulaire réactif avec validation
- Champs : email, mot de passe, confirmation
- Validation de correspondance des mots de passe
- Gestion des erreurs
- Navigation vers connexion

#### Dashboard (`/dashboard`)
- Affichage des informations utilisateur
- Interface moderne avec cartes
- Bouton de déconnexion
- Design responsive
- Navigation vers futures fonctionnalités

### Design et UX
- **Design moderne** : Interface épurée avec dégradés
- **Responsive** : Adaptation mobile/desktop
- **Accessibilité** : Labels, aria-required, navigation clavier
- **Feedback utilisateur** : Messages d'erreur, validation visuelle
- **Performance** : Lazy loading, optimisations Angular

## 🧪 Tests

### Lancement des tests
```bash
# Tests unitaires
ng test

# Tests en mode watch
ng test --watch

# Tests avec couverture
ng test --code-coverage

# Tests e2e
ng e2e
```

### Tests disponibles
- **LoginComponent** : Tests de création, validation des formulaires
- **SignupComponent** : Tests de création, validation des mots de passe
- **DashboardComponent** : Tests d'authentification, déconnexion
- **AuthService** : Tests des méthodes d'authentification

### Couverture de code
- Tests unitaires pour tous les composants
- Tests des services avec mocks
- Validation des formulaires
- Gestion des erreurs

## 🔧 Configuration

### Variables d'environnement
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.muscul-ia.com'
};
```

### Configuration Angular
```json
// angular.json
{
  "projects": {
    "muscul_ia": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/muscul_ia",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          }
        }
      }
    }
  }
}
```

## 📊 Performance

### Optimisations
- **Standalone Components** : Réduction de la taille du bundle
- **Lazy Loading** : Chargement à la demande des modules
- **Tree Shaking** : Élimination du code inutilisé
- **Compression** : Gzip/Brotli pour la production
- **Cache** : Stratégies de cache pour les assets

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

## 🔄 Évolutions futures

### Fonctionnalités prévues
- [ ] Gestion des programmes d'entraînement
- [ ] Interface de création d'exercices
- [ ] Suivi des performances
- [ ] Profil utilisateur détaillé
- [ ] Notifications push
- [ ] Mode hors ligne (PWA)

### Améliorations techniques
- [ ] Service Workers pour le cache
- [ ] State management (NgRx)
- [ ] Tests e2e avec Cypress
- [ ] Internationalisation (i18n)
- [ ] Thème sombre/clair
- [ ] Animations avancées

## 🚀 Déploiement

### Build de production
```bash
# Build optimisé
ng build --configuration production

# Build avec analyse
ng build --configuration production --stats-json
```

### Déploiement sur différents plateformes

#### Netlify
```bash
# Configuration netlify.toml
[build]
  publish = "dist/muscul_ia"
  command = "ng build --configuration production"
```

#### Vercel
```bash
# Configuration vercel.json
{
  "buildCommand": "ng build --configuration production",
  "outputDirectory": "dist/muscul_ia",
  "framework": "angular"
}
```

#### Serveur statique
```bash
# Installation d'un serveur local
npm install -g serve

# Lancement
serve -s dist/muscul_ia -l 3000
```

## 📝 Logs et debugging

### Outils de développement
- **Angular DevTools** : Extension navigateur
- **Console navigateur** : Logs et erreurs
- **Network tab** : Requêtes HTTP
- **Performance tab** : Métriques de performance

### Logs importants
- Erreurs d'authentification
- Problèmes de connexion API
- Erreurs de validation des formulaires
- Problèmes de navigation

## 🔒 Sécurité

### Bonnes pratiques
- **Validation côté client** : Double validation avec le serveur
- **Sanitisation** : Protection contre XSS
- **HTTPS** : En production
- **CSP** : Content Security Policy
- **CORS** : Configuration appropriée

### Gestion des tokens
- Stockage sécurisé dans localStorage
- Expiration automatique
- Renouvellement automatique
- Nettoyage lors de la déconnexion

## 📞 Support

Pour toute question ou problème :
- Vérifier la console du navigateur
- Consulter les logs de développement
- Vérifier la configuration de l'API
- Tester la connectivité réseau

### Ressources utiles
- [Documentation Angular](https://angular.io/docs)
- [Angular CLI](https://cli.angular.io/)
- [Angular DevTools](https://angular.io/devtools)

---

**Version :** 1.0.0  
**Dernière mise à jour :** Janvier 2024  
**Framework :** Angular 17  
**Node.js :** 18+
