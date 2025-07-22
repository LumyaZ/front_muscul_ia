import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

/**
 * Dashboard component for authenticated users.
 * Composant dashboard pour les utilisateurs authentifiés.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, HttpClientModule],
  providers: [AuthService],
  standalone: true
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("DashboardComponent ngOnInit");
    // Vérifier si l'utilisateur est authentifié
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer les informations de l'utilisateur
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Logout user
   * Déconnexion utilisateur
   */
  logout(): void {
    this.authService.logout();
  }
}
