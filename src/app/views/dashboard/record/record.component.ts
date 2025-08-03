import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NavBarComponent],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et vérifie l'authentification
   * Initialize component and check authentication
   */
  private initializeComponent(): void {
    this.isLoading = true;
    this.error = null;

    try {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        return;
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du composant record:', error);
      this.error = 'Erreur lors du chargement des données';
      this.isLoading = false;
    }
  }

  /**
   * Démarre un entraînement en naviguant vers la sélection de programme
   * Start training by navigating to program selection
   */
  startTraining(): void {
    if (this.isLoading) return;
    
    try {
      this.router.navigate(['/dashboard/record/select-program']);
    } catch (error) {
      console.error('Erreur lors de la navigation vers la sélection de programme:', error);
      this.error = 'Erreur lors de la navigation';
    }
  }

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
    this.initializeComponent();
  }
} 