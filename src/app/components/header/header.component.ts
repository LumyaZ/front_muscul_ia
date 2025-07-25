import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

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

  onProfileClick(): void {
    if (this.currentUser) {
      // Navigation vers la page de profil
      this.router.navigate(['/profile']);
    } else {
      // Si pas connecté, rediriger vers la connexion
      this.router.navigate(['/login']);
    }
  }

  onLogin(): void {
    // Navigation vers la page de connexion
    this.router.navigate(['/login']);
  }

  onLogout(): void {
    // Supprimer les données de session
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
  }

  onLogoClick(): void {
    // Navigation vers le dashboard ou la page d'accueil
    if (this.currentUser) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
} 