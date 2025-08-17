# Guide d'Utilisation du Cahier de Recettes

## Vue d'ensemble

Le cahier de recettes est un document complet qui décrit tous les scénarios de test à effectuer sur le frontend Muscul IA. Il couvre l'ensemble des fonctionnalités de l'application avec des étapes détaillées et des résultats attendus.

## Structure du Document

Le cahier de recettes est organisé en 10 sections principales :

1. **Prérequis et Configuration** - Environnement de test et données de test
2. **Tests d'Authentification** - Connexion, inscription, déconnexion
3. **Tests de Navigation** - Navigation entre les pages
4. **Tests du Dashboard** - Affichage et fonctionnalités du dashboard
5. **Tests des Programmes** - Gestion des programmes d'entraînement
6. **Tests d'Enregistrement d'Entraînement** - Suivi des sessions
7. **Tests de Profil Utilisateur** - Gestion du profil
8. **Tests de Responsive Design** - Adaptation mobile/tablette
9. **Tests de Performance** - Temps de chargement et optimisation
10. **Tests d'Accessibilité** - Navigation clavier et lecteurs d'écran

## Comment Utiliser le Cahier de Recettes

### 1. Préparation de l'Environnement

Avant de commencer les tests, assurez-vous que :

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier que les services sont opérationnels
curl http://localhost:8080/actuator/health  # Backend
curl http://localhost:8001/health          # Service IA
curl http://localhost:4200                 # Frontend
```

### 2. Tests Manuels

Tous les scénarios nécessitent des tests manuels. Pour chaque scénario :

1. **Lire l'objectif** - Comprendre ce qui doit être testé
2. **Suivre les étapes** - Exécuter chaque étape dans l'ordre
3. **Vérifier les résultats** - Confirmer que chaque résultat attendu est obtenu
4. **Marquer comme terminé** - Cocher les éléments validés

### 3. Fréquence des Tests

- **Tests critiques (1-15)** : À chaque développement
- **Tests fonctionnels (16-25)** : Semaine
- **Tests de performance (26-30)** : Mensuel

### 4. Outils Recommandés

#### Navigateurs
- Chrome 120+ (recommandé)
- Firefox 120+
- Safari 17+

#### Outils de Développement
- Chrome DevTools / Firefox Developer Tools
- Lighthouse pour les tests de performance
- axe-core pour l'accessibilité

#### Résolutions d'Écran à Tester
- Desktop : 1920x1080
- Tablette : 1366x768
- Mobile : 375x667

## Exemple d'Exécution d'un Test

### Scénario 1: Connexion Utilisateur Valide

**Objectif** : Vérifier que la connexion fonctionne avec des identifiants valides

**Étapes à suivre** :

1. Ouvrir Chrome et aller sur `http://localhost:4200`
2. Si redirigé vers la page de connexion, cliquer sur "Se connecter"
3. Saisir l'email : `test@muscul_ia.com`
4. Saisir le mot de passe : `Test123!`
5. Cliquer sur le bouton "Se connecter"

**Résultats à vérifier** :

- Redirection automatique vers `/dashboard/home`
- Affichage du header avec le nom de l'utilisateur
- Affichage de la barre de navigation en bas
- Token JWT stocké dans localStorage
- Informations utilisateur stockées dans localStorage

**Comment vérifier les résultats** :

```javascript
console.log(localStorage.getItem('auth_token'));
console.log(localStorage.getItem('current_user')); 
```

## Gestion des Erreurs

### Erreurs Communes

1. **Service non disponible**
   - Vérifier que tous les services Docker sont démarrés
   - Consulter les logs : `docker-compose logs`

2. **Tests qui échouent**
   - Vérifier la connectivité réseau
   - S'assurer que les données de test sont correctes
   - Consulter la console du navigateur pour les erreurs JavaScript

3. **Problèmes de performance**
   - Vérifier les ressources système
   - Consulter les métriques de performance dans les DevTools

### Rapport de Tests

Après chaque session de test, documentez :

- Date et heure de la session
- Scénarios testés
- Résultats obtenus
- Erreurs rencontrées
- Actions correctives prises

## Maintenance du Cahier

### Mise à Jour

Le cahier de recettes doit être mis à jour :

- À chaque nouvelle fonctionnalité
- À chaque modification de l'interface
- À chaque changement d'API
- À chaque correction de bug

### Ajout de Nouveaux Tests

Pour ajouter un nouveau test :

1. Identifier la fonctionnalité à tester
2. Définir l'objectif du test
3. Décrire les étapes précises
4. Spécifier les résultats attendus
5. Ajouter le test dans la section appropriée
