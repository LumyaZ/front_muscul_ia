# Cahier de Recettes - Frontend Muscul IA

## Table des matières
1. [Prérequis et Configuration](#prérequis-et-configuration)
2. [Tests d'Authentification](#tests-dauthentification)
3. [Tests de Navigation](#tests-de-navigation)
4. [Tests du Dashboard](#tests-du-dashboard)
5. [Tests des Programmes](#tests-des-programmes)
6. [Tests d'Enregistrement d'Entraînement](#tests-denregistrement-dentraînement)
7. [Tests de Profil Utilisateur](#tests-de-profil-utilisateur)
8. [Tests de Responsive Design](#tests-de-responsive-design)
9. [Tests de Performance](#tests-de-performance)
10. [Tests d'Accessibilité](#tests-daccessibilité)

---

## Prérequis et Configuration

### Environnement de Test
- **Navigateur**: Chrome 120+, Firefox 120+, Safari 17+
- **Résolution d'écran**: 1920x1080, 1366x768, 375x667 (mobile)
- **Connexion Internet**: Requise pour les appels API
- **Services Backend**: Backend Spring Boot (port 8080), Service IA (port 8001)

### Données de Test
```json
{
  "utilisateur_test": {
    "email": "test@muscul-ia.com",
    "password": "Test123!",
    "nom": "Utilisateur Test",
    "age": 25,
    "poids": 70,
    "taille": 175,
    "niveau": "INTERMEDIATE"
  },
  "programme_test": {
    "nom": "Programme Débutant",
    "categorie": "Musculation",
    "difficulte": "DEBUTANT",
    "public_cible": "Débutants"
  }
}
```

---

## Tests d'Authentification

### Scénario 1: Connexion Utilisateur Valide

**Objectif**: Vérifier que la connexion fonctionne avec des identifiants valides

**Étapes**:
1. Accéder à l'URL `http://localhost:4200`
2. Cliquer sur "Se connecter" si redirigé vers la page de connexion
3. Saisir l'email: `test@muscul_ia.com`
4. Saisir le mot de passe: `Test123!`
5. Cliquer sur le bouton "Se connecter"

**Résultats attendus**:
- Redirection automatique vers `/dashboard/home`
- Affichage du header avec le nom de l'utilisateur
- Affichage de la barre de navigation en bas
- Token JWT stocké dans localStorage
- Informations utilisateur stockées dans localStorage

### Scénario 2: Connexion avec Identifiants Invalides

**Objectif**: Vérifier la gestion des erreurs de connexion

**Étapes**:
1. Accéder à la page de connexion
2. Saisir un email invalide: `invalid@test.com`
3. Saisir un mot de passe invalide: `wrongpassword`
4. Cliquer sur "Se connecter"

**Résultats attendus**:
- Affichage d'un message d'erreur en rouge
- Pas de redirection
- Formulaire reste visible
- Aucun token stocké

### Scénario 3: Validation des Champs de Connexion

**Objectif**: Vérifier la validation côté client

**Étapes**:
1. Accéder à la page de connexion
2. Cliquer sur "Se connecter" sans saisir de données
3. Saisir un email invalide: `invalid-email`
4. Saisir un mot de passe trop court: `123`

**Résultats attendus**:
- Messages d'erreur pour chaque champ invalide
- Bouton "Se connecter" désactivé
- Indicateurs visuels d'erreur sur les champs

### Scénario 4: Inscription Nouvel Utilisateur

**Objectif**: Vérifier le processus d'inscription

**Étapes**:
1. Accéder à la page de connexion
2. Cliquer sur "Créer un compte"
3. Remplir le formulaire d'inscription:
   - Email: `nouveau@test.com`
   - Mot de passe: `Nouveau123!`
   - Confirmation: `Nouveau123!`
4. Cliquer sur "S'inscrire"

**Résultats attendus**:
- Redirection vers `/dashboard/home`
- Création du compte utilisateur
- Connexion automatique

### Scénario 5: Déconnexion

**Objectif**: Vérifier le processus de déconnexion

**Étapes**:
1. Être connecté à l'application
2. Cliquer sur l'icône de profil dans le header
3. Cliquer sur "Déconnexion"

**Résultats attendus**:
- Redirection vers `/login`
- Suppression du token JWT
- Suppression des données utilisateur
- Impossibilité d'accéder aux pages protégées

---

## Tests de Navigation

### Scénario 6: Navigation entre les Pages

**Objectif**: Vérifier la navigation entre les différentes sections

**Étapes**:
1. Être connecté à l'application
2. Tester chaque lien de la barre de navigation:
   - Accueil
   - Programmes
   - Enregistrer
   - Profil

**Résultats attendus**:
- Changement d'URL correct
- Chargement du contenu approprié
- Indicateur visuel de la page active
- Pas de perte de session

### Scénario 7: Navigation avec Bouton Retour

**Objectif**: Vérifier le comportement du bouton retour navigateur

**Étapes**:
1. Naviguer vers plusieurs pages
2. Utiliser le bouton retour du navigateur
3. Utiliser le bouton avant du navigateur

**Résultats attendus**:
- Navigation correcte dans l'historique
- État de l'application préservé
- Pas de redirection non désirée

---

## Tests du Dashboard

### Scénario 8: Affichage du Dashboard Principal

**Objectif**: Vérifier l'affichage correct du dashboard

**Étapes**:
1. Se connecter à l'application
2. Vérifier l'affichage de la page d'accueil

**Résultats attendus**:
- Affichage des actions rapides (Nouvel Entraînement, Mes Programmes)
- Affichage des statistiques utilisateur
- Affichage de l'historique des entraînements
- État de chargement approprié

### Scénario 9: Actions Rapides du Dashboard

**Objectif**: Vérifier le fonctionnement des actions rapides

**Étapes**:
1. Cliquer sur "Nouvel Entraînement"
2. Cliquer sur "Mes Programmes"

**Résultats attendus**:
- Redirection vers `/dashboard/record` pour nouvel entraînement
- Redirection vers `/dashboard/programs` pour programmes
- Navigation fluide sans erreur

### Scénario 10: Affichage des Statistiques

**Objectif**: Vérifier l'affichage des statistiques utilisateur

**Étapes**:
1. Accéder au dashboard
2. Vérifier les statistiques affichées

**Résultats attendus**:
- Nombre total d'entraînements affiché
- Heures d'entraînement calculées
- Durée moyenne calculée
- Données cohérentes avec l'historique

### Scénario 11: Historique des Entraînements

**Objectif**: Vérifier l'affichage de l'historique

**Étapes**:
1. Accéder au dashboard
2. Vérifier la section "Tous les Entraînements"

**Résultats attendus**:
- Liste des entraînements récents
- Informations détaillées (date, durée, type)
- État vide approprié si aucun entraînement
- Pagination si nécessaire

---

## Tests des Programmes

### Scénario 12: Affichage de la Liste des Programmes

**Objectif**: Vérifier l'affichage de tous les programmes disponibles

**Étapes**:
1. Naviguer vers "Programmes"
2. Vérifier l'affichage des programmes

**Résultats attendus**:
- Liste des programmes organisée par catégories
- Informations complètes (nom, description, difficulté)
- Filtres fonctionnels
- Barre de recherche opérationnelle

### Scénario 13: Filtrage des Programmes

**Objectif**: Vérifier le système de filtrage

**Étapes**:
1. Accéder à la page des programmes
2. Utiliser le filtre par difficulté
3. Utiliser le filtre par public cible
4. Utiliser la barre de recherche

**Résultats attendus**:
- Filtrage en temps réel
- Affichage du nombre de résultats
- Possibilité de réinitialiser les filtres
- Performance fluide

### Scénario 14: Ajout d'un Programme

**Objectif**: Vérifier l'ajout d'un programme à la liste personnelle

**Étapes**:
1. Naviguer vers un programme spécifique
2. Cliquer sur "Ajouter"
3. Vérifier l'ajout dans "Mes Programmes"

**Résultats attendus**:
- Confirmation d'ajout
- Programme visible dans la liste personnelle
- Pas de duplication
- Mise à jour en temps réel

### Scénario 15: Consultation des Détails d'un Programme

**Objectif**: Vérifier l'affichage détaillé d'un programme

**Étapes**:
1. Cliquer sur "Voir le programme"
2. Vérifier les détails affichés

**Résultats attendus**:
- Informations complètes du programme
- Liste des exercices
- Instructions détaillées
- Boutons d'action appropriés

---

## Tests d'Enregistrement d'Entraînement

### Scénario 16: Démarrage d'un Entraînement

**Objectif**: Vérifier le processus de démarrage d'entraînement

**Étapes**:
1. Naviguer vers "Enregistrer"
2. Cliquer sur "Démarrer un Entraînement"
3. Sélectionner un programme

**Résultats attendus**:
- Affichage de la liste des programmes disponibles
- Sélection possible d'un programme
- Démarrage de la session d'entraînement
- Chronomètre activé

### Scénario 17: Suivi d'Entraînement en Temps Réel

**Objectif**: Vérifier le suivi pendant l'entraînement

**Étapes**:
1. Démarrer un entraînement
2. Suivre les exercices proposés
3. Marquer les séries comme terminées

**Résultats attendus**:
- Affichage des exercices en cours
- Chronomètre fonctionnel
- Progression visible
- Possibilité de pause/reprise

### Scénario 18: Finalisation d'un Entraînement

**Objectif**: Vérifier la finalisation et l'enregistrement

**Étapes**:
1. Terminer tous les exercices
2. Cliquer sur "Terminer l'entraînement"
3. Ajouter des notes si nécessaire

**Résultats attendus**:
- Résumé de l'entraînement
- Enregistrement en base de données
- Mise à jour des statistiques
- Redirection vers le récapitulatif

---

## Tests de Profil Utilisateur

### Scénario 19: Consultation du Profil

**Objectif**: Vérifier l'affichage du profil utilisateur

**Étapes**:
1. Naviguer vers "Profil"
2. Vérifier les informations affichées

**Résultats attendus**:
- Informations personnelles complètes
- Statistiques d'entraînement
- Historique des programmes
- Options de modification

### Scénario 20: Modification du Profil

**Objectif**: Vérifier la modification des informations de profil

**Étapes**:
1. Accéder au profil
2. Cliquer sur "Modifier"
3. Changer quelques informations
4. Sauvegarder

**Résultats attendus**:
- Formulaire de modification accessible
- Validation des champs
- Sauvegarde réussie
- Mise à jour immédiate de l'affichage

---

## Tests de Responsive Design

### Scénario 21: Adaptation Mobile

**Objectif**: Vérifier l'adaptation sur mobile

**Étapes**:
1. Redimensionner la fenêtre à 375px de large
2. Tester toutes les pages principales
3. Vérifier la navigation mobile

**Résultats attendus**:
- Interface adaptée à la taille d'écran
- Navigation mobile fonctionnelle
- Textes lisibles
- Boutons accessibles

### Scénario 22: Adaptation Tablette

**Objectif**: Vérifier l'adaptation sur tablette

**Étapes**:
1. Redimensionner la fenêtre à 768px de large
2. Tester l'affichage des programmes
3. Vérifier les formulaires

**Résultats attendus**:
- Layout adapté pour tablette
- Grilles de programmes optimisées
- Formulaires utilisables
- Navigation intuitive

---

## Tests de Performance

### Scénario 23: Temps de Chargement

**Objectif**: Vérifier les performances de chargement

**Étapes**:
1. Ouvrir les outils de développement
2. Aller dans l'onglet "Performance"
3. Charger chaque page principale
4. Mesurer les temps de réponse

**Résultats attendus**:
- Temps de chargement < 3 secondes
- Pas de blocage de l'interface
- Chargement progressif des données
- Optimisation des images

### Scénario 24: Gestion de la Mémoire

**Objectif**: Vérifier la gestion mémoire

**Étapes**:
1. Naviguer entre plusieurs pages
2. Surveiller l'utilisation mémoire
3. Tester sur une session prolongée

**Résultats attendus**:
- Pas de fuite mémoire
- Libération des ressources
- Performance stable
- Pas de crash

---

## Tests d'Accessibilité

### Scénario 25: Navigation au Clavier

**Objectif**: Vérifier l'accessibilité clavier

**Étapes**:
1. Utiliser uniquement le clavier pour naviguer
2. Tester tous les formulaires
3. Vérifier les raccourcis clavier

**Résultats attendus**:
- Navigation possible au clavier
- Focus visible sur tous les éléments
- Ordre de tabulation logique
- Raccourcis clavier fonctionnels

### Scénario 26: Lecteurs d'Écran

**Objectif**: Vérifier la compatibilité avec les lecteurs d'écran

**Étapes**:
1. Activer un lecteur d'écran
2. Naviguer dans l'application
3. Vérifier les descriptions alternatives

**Résultats attendus**:
- Textes alternatifs pour les images
- Labels appropriés pour les formulaires
- Structure sémantique correcte
- Messages d'état annoncés

---

## Tests de Gestion d'Erreurs

### Scénario 27: Erreurs Réseau

**Objectif**: Vérifier la gestion des erreurs réseau

**Étapes**:
1. Couper la connexion réseau
2. Tester les appels API
3. Rétablir la connexion

**Résultats attendus**:
- Messages d'erreur appropriés
- Possibilité de réessayer
- Pas de crash de l'application
- Récupération automatique

### Scénario 28: Erreurs Serveur

**Objectif**: Vérifier la gestion des erreurs serveur

**Étapes**:
1. Arrêter le service backend
2. Tester les fonctionnalités
3. Redémarrer le service

**Résultats attendus**:
- Messages d'erreur informatifs
- Fallback approprié
- Possibilité de réessayer
- Récupération automatique

---

## Tests de Compatibilité Navigateur

### Scénario 29: Chrome

**Objectif**: Vérifier la compatibilité Chrome

**Étapes**:
1. Tester sur Chrome 120+
2. Vérifier toutes les fonctionnalités
3. Tester les performances

**Résultats attendus**:
- Fonctionnalités complètes
- Performance optimale
- Pas d'erreurs console
- Rendu correct

### Scénario 30: Firefox

**Objectif**: Vérifier la compatibilité Firefox

**Étapes**:
1. Tester sur Firefox 120+
2. Vérifier toutes les fonctionnalités
3. Tester les performances

**Résultats attendus**:
- Fonctionnalités complètes
- Performance acceptable
- Pas d'erreurs console
- Rendu correct

---

## Conclusion

Ce cahier de recettes couvre les fonctionnalités essentielles du frontend Muscul IA. Chaque scénario doit être testé régulièrement pour garantir la qualité de l'application.

### Fréquence des Tests
- **Tests critiques** (1-15): À chaque déploiement
- **Tests fonctionnels** (16-25): Semaine
- **Tests de performance** (26-30): Mensuel

### Outils Recommandés
- **Navigateurs**: Chrome DevTools, Firefox Developer Tools
- **Performance**: Lighthouse, WebPageTest
- **Accessibilité**: axe-core, WAVE
 