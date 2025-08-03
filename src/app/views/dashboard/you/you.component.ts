import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserTrainingsComponent } from './trainings/user-trainings.component';
import { UserProgramsComponent } from './programs/user-programs.component';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-you',
  standalone: true,
  imports: [
    CommonModule, 
    UserTrainingsComponent, 
    UserProgramsComponent, 
    HeaderComponent, 
    NavBarComponent
  ],
  templateUrl: './you.component.html',
  styleUrls: ['./you.component.scss']
})
export class YouComponent implements OnInit, OnDestroy {
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  
  user: User | null = null;
  selectedTab: 'trainings' | 'programs' = 'trainings';
  isLoading = false;
  error: string | null = null;
  joinDate: Date = new Date();

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données de l'utilisateur connecté
   * Load connected user data
   */
  private loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    try {
      this.user = this.authService.getCurrentUser();
      
      if (!this.user) {
        this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      if (this.user.creationDate) {
        this.joinDate = new Date(this.user.creationDate);
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      this.error = 'Erreur lors du chargement des données utilisateur';
      this.isLoading = false;
    }
  }

  /**
   * Change l'onglet sélectionné
   * Change selected tab
   */
  selectTab(tab: 'trainings' | 'programs'): void {
    if (this.selectedTab !== tab) {
      this.selectedTab = tab;
      this.error = null;
    }
  }

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
  }
} 