import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Interface representing a navigation item in the navigation bar.
 * Interface représentant un élément de navigation dans la barre de navigation.
 * 
 * This interface defines the structure of navigation items including
 * their label, icon, route, and active state.
 * 
 * Cette interface définit la structure des éléments de navigation incluant
 * leur libellé, icône, route et état actif.
 */
export interface NavItem {
  /**
   * Display label for the navigation item.
   * Libellé d'affichage pour l'élément de navigation.
   */
  label: string;
  
  /**
   * FontAwesome icon class for the navigation item.
   * Classe d'icône FontAwesome pour l'élément de navigation.
   */
  icon: string;
  
  /**
   * Angular route path for the navigation item.
   * Chemin de route Angular pour l'élément de navigation.
   */
  route: string;
  
  /**
   * Flag indicating if the navigation item is currently active.
   * Indicateur indiquant si l'élément de navigation est actuellement actif.
   */
  isActive?: boolean;
}

/**
 * Navigation bar component for the main application navigation.
 * Composant de barre de navigation pour la navigation principale de l'application.
 * 
 * This component provides the main navigation interface for authenticated users.
 * It displays navigation items with icons and handles navigation between
 * different sections of the application. The component automatically updates
 * the active state based on the current route.
 * 
 * Ce composant fournit l'interface de navigation principale pour les utilisateurs
 * authentifiés. Il affiche les éléments de navigation avec des icônes et gère
 * la navigation entre les différentes sections de l'application. Le composant
 * met automatiquement à jour l'état actif en fonction de la route actuelle.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  
  /**
   * Current route path to determine active navigation item.
   * Chemin de route actuel pour déterminer l'élément de navigation actif.
   */
  @Input() currentRoute: string = '';

  /**
   * Array of navigation items displayed in the navigation bar.
   * Tableau des éléments de navigation affichés dans la barre de navigation.
   * 
   * Each item contains a label, icon, and route for navigation.
   * 
   * Chaque élément contient un libellé, une icône et une route pour la navigation.
   */
  navItems: NavItem[] = [
    {
      label: 'Accueil',
      icon: 'fas fa-home',
      route: '/dashboard/home'
    },
    {
      label: 'Entraînements',
      icon: 'fas fa-dumbbell',
      route: '/dashboard/trainings'
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
   * Constructor for NavBarComponent.
   * Constructeur pour NavBarComponent.
   * 
   * @param router - Angular router service for navigation
   */
  constructor(private router: Router) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   * 
   * This method initializes the active state of navigation items.
   * 
   * Cette méthode initialise l'état actif des éléments de navigation.
   */
  ngOnInit(): void {
    this.updateActiveState();
  }

  /**
   * Lifecycle hook that is called when data-bound properties change.
   * Hook de cycle de vie appelé quand les propriétés liées aux données changent.
   * 
   * This method updates the active state when the current route changes.
   * 
   * Cette méthode met à jour l'état actif quand la route actuelle change.
   */
  ngOnChanges(): void {
    this.updateActiveState();
  }

  /**
   * Updates the active state of navigation items based on current route.
   * Met à jour l'état actif des éléments de navigation basé sur la route actuelle.
   * 
   * This private method iterates through all navigation items and sets
   * their isActive property based on whether their route matches the current route.
   * 
   * Cette méthode privée itère à travers tous les éléments de navigation et définit
   * leur propriété isActive selon si leur route correspond à la route actuelle.
   */
  private updateActiveState(): void {
    this.navItems.forEach(item => {
      item.isActive = this.currentRoute === item.route;
    });
  }

  /**
   * Handles navigation item click events.
   * Gère les événements de clic sur les éléments de navigation.
   * 
   * This method navigates to the specified route when a navigation
   * item is clicked and logs the navigation action.
   * 
   * Cette méthode navigue vers la route spécifiée quand un élément
   * de navigation est cliqué et enregistre l'action de navigation.
   * 
   * @param item - The navigation item that was clicked
   */
  onNavItemClick(item: NavItem): void {
    // Navigation vers les pages correspondantes
    console.log(`Navigation vers: ${item.route}`);
    
    // Navigation vers toutes les pages du dashboard
    this.router.navigate([item.route]);
  }

  /**
   * Returns the CSS class for active state styling.
   * Retourne la classe CSS pour le style d'état actif.
   * 
   * This method returns 'active' if the navigation item is currently
   * active, otherwise returns an empty string.
   * 
   * Cette méthode retourne 'active' si l'élément de navigation est
   * actuellement actif, sinon retourne une chaîne vide.
   * 
   * @param item - The navigation item to check
   * @return string - CSS class name for active state
   */
  getActiveClass(item: NavItem): string {
    return item.isActive ? 'active' : '';
  }
} 