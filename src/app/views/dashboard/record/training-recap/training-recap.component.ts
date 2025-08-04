import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../../components/header/header.component';
import { NavBarComponent } from '../../../../components/nav-bar/nav-bar.component';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { AuthService } from '../../../../services/auth.service';

interface TrainingRecap {
  sessionId?: number;
  duration: number;
  completed: boolean;
  title?: string;
  rating?: number;
  notes?: string;
  exercises: any[];
}

@Component({
  selector: 'app-training-recap',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './training-recap.component.html',
  styleUrls: ['./training-recap.component.scss']
})
export class TrainingRecapComponent implements OnInit, OnDestroy {
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trainingSessionService = inject(TrainingSessionService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  recap: TrainingRecap | null = null;
  loading = false;
  error: string | null = null;
  
  // Form data
  title: string = '';
  rating: number = 5;
  notes: string = '';

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et charge les données
   * Initialize component and load data
   */
  private initializeComponent(): void {
    try {
      this.loadRecapData();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du composant training-recap:', error);
      this.error = 'Erreur lors de l\'initialisation';
    }
  }

  /**
   * Charge les données du récapitulatif
   * Load recap data
   */
  loadRecapData(): void {
    this.loading = true;
    this.error = null;
    
    try {
      this.route.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (params) => {
            this.recap = {
              sessionId: params['sessionId'] ? Number(params['sessionId']) : undefined,
              duration: Number(params['duration']) || 0,
              completed: params['completed'] === 'true',
              exercises: []
            };
            
            this.loading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des données:', error);
            this.error = 'Erreur lors du chargement des données';
            this.loading = false;
          }
        });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.error = 'Erreur lors du chargement des données';
      this.loading = false;
    }
  }

  /**
   * Formate le temps en HH:MM:SS
   * Format time as HH:MM:SS
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Change la note de l'entraînement
   * Change training rating
   */
  onRatingChange(rating: number): void {
    if (this.loading) return;
    this.rating = rating;
  }

  /**
   * Sauvegarde le récapitulatif
   * Save recap
   */
  saveRecap(): void {
    if (this.loading) return;
    
    try {
      if (this.recap) {
        this.recap.title = this.title;
        this.recap.rating = this.rating;
        this.recap.notes = this.notes;
        
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.error = 'Erreur lors de la sauvegarde';
    }
  }

  /**
   * Retourne à la page précédente
   * Go back to previous page
   */
  onBack(): void {
    if (this.loading) return;
    
    try {
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erreur lors du retour:', error);
      this.error = 'Erreur lors du retour';
    }
  }

  /**
   * Obtient les étoiles de notation
   * Get rating stars
   */
  getRatingStars(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.rating);
  }

  /**
   * Obtient le message de complétion
   * Get completion message
   */
  getCompletionMessage(): string {
    if (this.recap?.completed) {
      return 'Félicitations ! Vous avez terminé votre entraînement.';
    } else {
      return 'Vous avez arrêté votre entraînement. Votre progression a été sauvegardée.';
    }
  }

  /**
   * Obtient l'icône de complétion
   * Get completion icon
   */
  getCompletionIcon(): string {
    return this.recap?.completed ? 'fas fa-trophy' : 'fas fa-pause-circle';
  }

  /**
   * Obtient la couleur de complétion
   * Get completion color
   */
  getCompletionColor(): string {
    return this.recap?.completed ? '#4CAF50' : '#FF9800';
  }

  /**
   * Efface le message d'erreur
   * Clear error message
   */
  clearError(): void {
    this.error = null;
    this.loadRecapData();
  }
} 