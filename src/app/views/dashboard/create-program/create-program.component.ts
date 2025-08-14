import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { AuthService } from '../../../services/auth.service';

import { User } from '../../../models/user.model';

/**
 * Interface for the form data to create a new training program.
 * Interface pour les données du formulaire de création d'un nouveau programme d'entraînement.
 */
interface CreateProgramForm {
  name: string;
  description: string;
  category: string;
  difficultyLevel: string;
  targetAudience: string;
}

/**
 * Component for creating a new training program.
 * Composant pour créer un nouveau programme d'entraînement.
 */
@Component({
  selector: 'app-create-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent implements OnInit, OnDestroy {
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private trainingProgramService = inject(TrainingProgramService);
  private authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  createProgramForm: FormGroup;
  
  currentUser: User | null = null;
  
  loading = false;

  
  error = '';
  
  success = '';

  fromYouPrograms = false;

  userIdFromParams: string | null = null;

  categories = ['Musculation', 'Cardio', 'Flexibilité', 'Mixte'];

  difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé'];

  targetAudiences = [
    'Débutants',
    'Sportifs confirmés',
    'Athlètes expérimentés',
    'Sportifs de compétition',
    'Tous niveaux'
  ];

  constructor() {
    this.createProgramForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['Musculation', Validators.required],
      difficultyLevel: ['Débutant', Validators.required],
      targetAudience: ['Tous niveaux', Validators.required]
    });
  }

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   */
  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkProvenance();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * Hook de cycle de vie appelé quand le composant est détruit.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check the provenance of the user (from which page they came).
   * Vérifie la provenance de l'utilisateur (de quelle page il vient).
   */
  private checkProvenance(): void {
    this.route.queryParams.subscribe(params => {
      this.fromYouPrograms = params['from'] === 'you-programs';
      this.userIdFromParams = params['userId'] || null;
    });
  }

  /**
   * Load current authenticated user data.
   * Charge les données de l'utilisateur authentifié actuel.
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.error = 'Utilisateur non connecté. Redirection vers la page de connexion.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }



  /**
   * Soumet le formulaire de création de programme
   * Submit program creation form
   */
  onSubmit(): void {
    if (this.createProgramForm.valid) {
      if (!this.currentUser?.id) {
        this.error = 'Vous devez être connecté pour créer un programme.';
        return;
      }

      this.loading = true;
      this.error = '';
      this.success = '';

      const formData = this.createProgramForm.value;
      const programData = {
        name: formData.name,
        description: formData.description,
        difficultyLevel: formData.difficultyLevel,
        category: formData.category,
        targetAudience: formData.targetAudience
      };

      this.trainingProgramService.createProgram(programData, this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            this.success = 'Programme créé avec succès !';
            
            this.createProgramForm.reset({
              category: 'Musculation',
              difficultyLevel: 'Débutant',
              targetAudience: 'Tous niveaux'
            });
            
            setTimeout(() => {
              if (this.fromYouPrograms) {
                this.router.navigate(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
              } else {
                this.router.navigate(['/dashboard/programs']);
              }
            }, 2000);
          },
          error: (error: any) => {
            this.loading = false;
            this.error = 'Erreur lors de la création du programme';
            console.error('Erreur création programme:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Mark all form controls as touched to trigger validation display.
   * Marque tous les contrôles du formulaire comme touchés pour déclencher l'affichage de validation.
   */
  markFormGroupTouched(): void {
    Object.keys(this.createProgramForm.controls).forEach(key => {
      const control = this.createProgramForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigate back to the appropriate page based on provenance.
   * Navigue vers la page appropriée selon la provenance.
   */
  goBackToPrograms(): void {
    if (this.fromYouPrograms) {
      this.router.navigate(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
    } else {
      this.router.navigate(['/dashboard/programs']);
    }
  }

  /**
   * Handle token expiration by redirecting to login.
   * Gère l'expiration du token en redirigeant vers la connexion.
   */
  private handleTokenExpiration(): void {
    this.authService.logout();
    this.error = 'Session expirée. Redirection vers la page de connexion.';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  /**
   * Get error message for a specific form control.
   * Obtient le message d'erreur pour un contrôle de formulaire spécifique.
   * 
   * @param controlName - The name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string): string {
    const control = this.createProgramForm.get(controlName);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      switch (controlName) {
        case 'name': return 'Le nom du programme est requis';
        case 'description': return 'La description est requise';
        case 'category': return 'La catégorie est requise';
        case 'difficultyLevel': return 'Le niveau de difficulté est requis';
        case 'targetAudience': return 'Le public cible est requis';
        default: return 'Ce champ est requis';
      }
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Le nom doit contenir au moins ${requiredLength} caractères`;
        case 'description': return `La description doit contenir au moins ${requiredLength} caractères`;
        default: return `Minimum ${requiredLength} caractères`;
      }
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Le nom ne peut pas dépasser ${requiredLength} caractères`;
        case 'description': return `La description ne peut pas dépasser ${requiredLength} caractères`;
        default: return `Maximum ${requiredLength} caractères`;
      }
    }

    if (errors['min']) {
      const minValue = errors['min'].min;
      switch (controlName) {
        default: return `La valeur minimale est ${minValue}`;
      }
    }

    if (errors['max']) {
      const maxValue = errors['max'].max;
      switch (controlName) {
        default: return `La valeur maximale est ${maxValue}`;
      }
    }

    return 'Valeur invalide';
  }


} 