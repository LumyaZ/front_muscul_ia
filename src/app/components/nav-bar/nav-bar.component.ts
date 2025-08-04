import { Component, Input, OnInit, OnChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnChanges {
  
  private router = inject(Router);

  /**
   * Current route path to determine active navigation item.
   * Chemin de route actuel pour déterminer l'élément de navigation actif.
   */
  @Input() currentRoute: string = '';

  /**
   * Error message for navigation failures.
   * Message d'erreur pour les échecs de navigation.
   */
  error: string | null = null;

  /**
   * Loading state for navigation actions.
   * État de chargement pour les actions de navigation.
   */
  isLoading = false;

  /**
   * Array of navigation items displayed in the navigation bar.
   * Tableau des éléments de navigation affichés dans la barre de navigation.
   */
  navItems: NavItem[] = [
    {
      label: 'Accueil',
      icon: 'fas fa-home',
      route: '/dashboard/home'
    },
    {
      label: 'Amis',
      icon: 'fas fa-users',
      route: '/dashboard/friends'
    },
    {
      label: 'Enregistrer',
      icon: 'fas fa-plus-circle',
      route: '/dashboard/record'
    },
    {
      label: 'Programmes',
      icon: 'fas fa-list-alt',
      route: '/dashboard/programs'
    },
    {
      label: 'Vous',
      icon: 'fas fa-user',
      route: '/dashboard/you'
    }
  ];

  /**
   * Initializes the component and updates active state.
   * Initialise le composant et met à jour l'état actif.
   */
  ngOnInit(): void {
    this.updateActiveState();
  }

  /**
   * Updates active state when input properties change.
   * Met à jour l'état actif quand les propriétés d'entrée changent.
   */
  ngOnChanges(): void {
    this.updateActiveState();
  }

  /**
   * Updates the active state of navigation items based on current route.
   * Met à jour l'état actif des éléments de navigation basé sur la route actuelle.
   */
  private updateActiveState(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute === item.route;
    });
  }

  /**
   * Handles navigation item click events.
   * Gère les événements de clic sur les éléments de navigation.
   */
  onNavItemClick(item: NavItem): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.router.navigate([item.route]);
      this.isLoading = false;
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      this.error = 'Erreur lors de la navigation';
      this.isLoading = false;
    }
  }

  /**
   * Returns the CSS class for active state styling.
   * Retourne la classe CSS pour le style d'état actif.
   */
  getActiveClass(item: NavItem): string {
    return item.isActive ? 'active' : '';
  }

  /**
   * Clears error message.
   * Efface le message d'erreur.
   */
  clearError(): void {
    this.error = null;
  }
} 