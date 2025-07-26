import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { HeaderComponent } from '../../components/header/header.component';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';

/**
 * Main dashboard component for authenticated users.
 * Composant dashboard principal pour les utilisateurs authentifiés.
 * 
 * This component serves as the main container for the authenticated user
 * interface. It includes the header and navigation bar components and
 * handles authentication checks. If a user is not authenticated, they
 * are redirected to the login page.
 * 
 * Ce composant sert de conteneur principal pour l'interface utilisateur
 * authentifiée. Il inclut les composants d'en-tête et de barre de navigation
 * et gère les vérifications d'authentification. Si un utilisateur n'est pas
 * authentifié, il est redirigé vers la page de connexion.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, HttpClientModule, HeaderComponent, NavBarComponent],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  
  /**
   * Authentication service for user management.
   * Service d'authentification pour la gestion des utilisateurs.
   */
  private authService = inject(AuthService);
  
  /**
   * Angular router for navigation.
   * Routeur Angular pour la navigation.
   */
  private router = inject(Router);

  /**
   * Currently authenticated user information.
   * Informations de l'utilisateur actuellement authentifié.
   */
  currentUser: User | null = null;

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   * 
   * This method checks if the user is authenticated and loads the current
   * user information. If not authenticated, redirects to login page.
   * 
   * Cette méthode vérifie si l'utilisateur est authentifié et charge les
   * informations de l'utilisateur actuel. Si non authentifié, redirige vers
   * la page de connexion.
   */
  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Logout the current user and redirect to login page.
   * Déconnecter l'utilisateur actuel et rediriger vers la page de connexion.
   * 
   * This method calls the authentication service to logout the user
   * and clear any stored authentication data.
   * 
   * Cette méthode appelle le service d'authentification pour déconnecter
   * l'utilisateur et effacer toutes les données d'authentification stockées.
   */
  logout(): void {
    this.authService.logout();
  }
}
