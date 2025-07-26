import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Header component for the main application interface.
 * Composant d'en-tête pour l'interface principale de l'application.
 * 
 * This component displays the application header with user information,
 * logo, and navigation controls. It handles user authentication state
 * and provides navigation to different sections of the application.
 * The component manages user session data and provides logout functionality.
 * 
 * Ce composant affiche l'en-tête de l'application avec les informations
 * utilisateur, le logo et les contrôles de navigation. Il gère l'état
 * d'authentification utilisateur et fournit la navigation vers différentes
 * sections de l'application. Le composant gère les données de session
 * utilisateur et fournit la fonctionnalité de déconnexion.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  /**
   * Currently authenticated user information.
   * Informations de l'utilisateur actuellement authentifié.
   * 
   * This property stores the current user data retrieved from localStorage.
   * 
   * Cette propriété stocke les données de l'utilisateur actuel récupérées
   * du localStorage.
   */
  currentUser: any = null;

  /**
   * Constructor for HeaderComponent.
   * Constructeur pour HeaderComponent.
   * 
   * @param router - Angular router service for navigation
   */
  constructor(private router: Router) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   * 
   * This method initializes the component by loading the current user data.
   * 
   * Cette méthode initialise le composant en chargeant les données de l'utilisateur actuel.
   */
  ngOnInit(): void {
    this.loadCurrentUser();
  }

  /**
   * Loads the current user data from localStorage.
   * Charge les données de l'utilisateur actuel depuis localStorage.
   * 
   * This private method retrieves user information from localStorage,
   * parses the JSON data, and handles any parsing errors gracefully.
   * 
   * Cette méthode privée récupère les informations utilisateur depuis
   * localStorage, parse les données JSON et gère les erreurs de parsing
   * de manière élégante.
   */
  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('current_user');       
    console.log(userStr);
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr); 
        console.log(this.currentUser);
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        this.currentUser = null;
      }
    }
  }

  /**
   * Handles profile click navigation.
   * Gère la navigation lors du clic sur le profil.
   * 
   * This method navigates to the profile page if the user is authenticated,
   * otherwise redirects to the login page.
   * 
   * Cette méthode navigue vers la page de profil si l'utilisateur est
   * authentifié, sinon redirige vers la page de connexion.
   */
  onProfileClick(): void {
    if (this.currentUser) {
      // Navigation vers la page de profil
      this.router.navigate(['/profile']);
    } else {
      // Si pas connecté, rediriger vers la connexion
      this.router.navigate(['/login']);
    }
  }

  /**
   * Handles login button click navigation.
   * Gère la navigation lors du clic sur le bouton de connexion.
   * 
   * This method navigates to the login page when the login button is clicked.
   * 
   * Cette méthode navigue vers la page de connexion quand le bouton
   * de connexion est cliqué.
   */
  onLogin(): void {
    // Navigation vers la page de connexion
    this.router.navigate(['/login']);
  }

  /**
   * Handles logout functionality.
   * Gère la fonctionnalité de déconnexion.
   * 
   * This method clears user session data from localStorage and redirects
   * to the login page. It removes both the authentication token and
   * current user data.
   * 
   * Cette méthode efface les données de session utilisateur de localStorage
   * et redirige vers la page de connexion. Elle supprime à la fois le token
   * d'authentification et les données utilisateur actuelles.
   */
  onLogout(): void {
    // Supprimer les données de session
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  /**
   * Handles logo click navigation.
   * Gère la navigation lors du clic sur le logo.
   * 
   * This method navigates to the dashboard home page if the user is
   * authenticated, otherwise navigates to the main landing page.
   * 
   * Cette méthode navigue vers la page d'accueil du dashboard si l'utilisateur
   * est authentifié, sinon navigue vers la page d'accueil principale.
   */
  onLogoClick(): void {
    // Navigation vers le dashboard ou la page d'accueil
    if (this.currentUser) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/']);
    }
  }
} 