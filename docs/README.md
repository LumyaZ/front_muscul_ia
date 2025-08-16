# Documentation Frontend - Muscul IA

## Vue d'ensemble

Ce dossier contient la documentation technique du frontend Angular de l'application Muscul IA.

## 📁 Structure de la documentation

### Guides de développement
- **ARCHITECTURE.md** - Architecture et structure du projet
- **COMPONENTS.md** - Guide des composants Angular
- **SERVICES.md** - Guide des services et API
- **TESTING.md** - Guide des tests et qualité

### Outils de documentation
- **generate-docs.js** - Générateur automatique de documentation
- **validate-docs.js** - Validateur de qualité de documentation

## Génération de la documentation

### Génération automatique
```bash
# Générer la documentation complète
npm run docs:generate

# Valider la qualité de la documentation
npm run docs:validate
```

### Rapports disponibles
- **Documentation HTML :** `docs/index.html`
- **Rapport de validation :** `docs/validation/report.html`
- **Couverture de documentation :** `docs/validation/coverage.html`

## Standards de documentation

### JSDoc requis
- **Interfaces** - Description complète avec exemples
- **Services** - Méthodes et paramètres documentés
- **Composants** - Inputs, Outputs et lifecycle
- **Modèles** - Propriétés et types

### Qualité minimale
- **Couverture :** ≥ 90% des éléments publics
- **Bilingue :** ≥ 80% des éléments en français/anglais
- **Description :** ≥ 50 caractères par élément
- **Exemples :** Pour toutes les interfaces complexes

## Configuration

### Scripts npm
```json
{
  "scripts": {
    "docs:generate": "node scripts/generate-docs.js",
    "docs:validate": "node scripts/validate-docs.js",
    "docs:serve": "npx http-server docs -p 8081"
  }
}
```

### Variables d'environnement
```bash
# Configuration de la documentation
DOCS_OUTPUT_DIR=docs
DOCS_SOURCE_DIRS=src/app
DOCS_TEMPLATE=default
```

## Métriques de qualité

### Couverture de documentation
- **Interfaces :** 100% documentées
- **Services :** 100% des méthodes documentées
- **Composants :** 100% des inputs/outputs documentés
- **Modèles :** 100% des propriétés documentées

### Qualité du contenu
- **Clarté :** Descriptions claires et concises
- **Exemples :** Exemples d'utilisation fournis
- **Cohérence :** Style uniforme dans tout le projet
- **Actualité :** Documentation à jour avec le code 