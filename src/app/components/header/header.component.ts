import { Component, OnInit, inject, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Directive({
  selector: '[clickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Input() clickOutside: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside();
    }
  }
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  isLoading = false;
  error: string | null = null;
  showUserMenu = false;

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  /**
   * Loads current user data from auth service
   * Charge les données utilisateur depuis le service d'auth
   */
  private loadCurrentUser(): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isLoading = false;
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      this.error = 'Erreur lors du chargement des données utilisateur';
      this.isLoading = false;
      this.currentUser = null;
    }
  }

  /**
   * Checks if user is authenticated
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Handles profile click navigation
   * Gère la navigation lors du clic profil
   */
  onProfileClick(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
    this.closeUserMenu();
  }

  /**
   * Navigates to login page
   * Navigue vers la page de connexion
   */
  onLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Handles user logout
   * Gère la déconnexion utilisateur
   */
  onLogout(): void {
    this.isLoading = true;
    this.error = null;
    
    try {
      this.authService.logout();
      this.currentUser = null;
      this.showUserMenu = false;
      this.router.navigate(['/login']);
      
      setTimeout(() => {
        this.isLoading = false;
      }, 50);
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      this.error = 'Erreur lors de la déconnexion';
      this.isLoading = false;
    }
  }

  /**
   * Handles logo click navigation
   * Gère la navigation lors du clic logo
   */
  onLogoClick(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard/home']);
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Toggles user menu visibility
   * Bascule la visibilité du menu utilisateur
   */
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  /**
   * Closes user menu dropdown
   * Ferme le menu déroulant utilisateur
   */
  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  /**
   * Gets user display name
   * Obtient le nom d'affichage utilisateur
   */
  getUserDisplayName(): string {
    if (!this.currentUser) return 'Utilisateur';
    return this.currentUser.email || 'Utilisateur';
  }

  /**
   * Gets user initials for avatar
   * Obtient les initiales utilisateur pour l'avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return '';
    
    const email = this.currentUser.email || '';
    const name = email.split('@')[0];
    
    if (email === 'test@example.com') {
      return 'TE';
    }
    
    const initials = name
      .split(/[._-]/)
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    return initials || email.substring(0, 2).toUpperCase();
  }

  /**
   * Clears error message
   * Efface le message d'erreur
   */
  clearError(): void {
    this.error = null;
  }
} 