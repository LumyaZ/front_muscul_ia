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
  durationWeeks: number;
  sessionsPerWeek: number;
  estimatedDurationMinutes: number;
  equipmentRequired: string;
  isPublic: boolean;
}

/**
 * Component for creating a new training program.
 * Composant pour créer un nouveau programme d'entraînement.
 * 
 * This component provides a comprehensive form interface for users to create
 * new training programs with all necessary parameters including name,
 * description, category, difficulty, target audience, and scheduling details.
 * 
 * Ce composant fournit une interface de formulaire complète pour que les utilisateurs
 * puissent créer de nouveaux programmes d'entraînement avec tous les paramètres
 * nécessaires incluant le nom, la description, la catégorie, la difficulté,
 * le public cible et les détails de planification.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
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
  
  /**
   * Form group for creating a new training program.
   * Groupe de formulaire pour créer un nouveau programme d'entraînement.
   */
  createProgramForm: FormGroup;
  
  /**
   * Current authenticated user.
   * Utilisateur actuellement authentifié.
   */
  currentUser: User | null = null;
  
  /**
   * Loading state indicator.
   * Indicateur d'état de chargement.
   */
  loading = false;
  
  /**
   * Error message to display if operation fails.
   * Message d'erreur à afficher si l'opération échoue.
   */
  error = '';
  
  /**
   * Success message to display after successful creation.
   * Message de succès à afficher après création réussie.
   */
  success = '';

  /**
   * Indicates if the user came from you/programs page.
   * Indique si l'utilisateur vient de la page you/programs.
   */
  fromYouPrograms = false;

  /**
   * User ID from query parameters.
   * ID de l'utilisateur depuis les paramètres de requête.
   */
  userIdFromParams: string | null = null;

  /**
   * Available categories for training programs.
   * Catégories disponibles pour les programmes d'entraînement.
   */
  categories = ['Musculation', 'Cardio', 'Flexibilité', 'Mixte'];

  /**
   * Available difficulty levels.
   * Niveaux de difficulté disponibles.
   */
  difficultyLevels = ['Débutant', 'Intermédiaire', 'Avancé'];

  /**
   * Available target audiences.
   * Publics cibles disponibles.
   */
  targetAudiences = [
    'Débutants',
    'Sportifs confirmés',
    'Athlètes expérimentés',
    'Sportifs de compétition',
    'Tous niveaux'
  ];

  /**
   * Constructor initializes the form with default values and validators.
   * Le constructeur initialise le formulaire avec des valeurs par défaut et des validateurs.
   */
  constructor() {
    this.createProgramForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['Musculation', Validators.required],
      difficultyLevel: ['Débutant', Validators.required],
      targetAudience: ['Tous niveaux', Validators.required],
      durationWeeks: [4, [Validators.required, Validators.min(1), Validators.max(52)]],
      sessionsPerWeek: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      estimatedDurationMinutes: [60, [Validators.required, Validators.min(15), Validators.max(180)]],
      equipmentRequired: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      isPublic: [true]
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
   * Handle form submission to create a new training program.
   * Gère la soumission du formulaire pour créer un nouveau programme d'entraînement.
   */
  onSubmit(): void {
    if (this.createProgramForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (!this.currentUser || !this.currentUser.id) {
      this.error = 'Vous devez être connecté pour créer un programme.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const formData = this.createProgramForm.value;
    const programData = {
      ...formData,
      createdByUserId: this.currentUser.id
    };

    this.trainingProgramService.createTrainingProgram(programData, this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.success = 'Programme créé avec succès !';
          
          this.createProgramForm.reset({
            category: 'Musculation',
            difficultyLevel: 'Débutant',
            targetAudience: 'Tous niveaux',
            durationWeeks: 4,
            sessionsPerWeek: 3,
            estimatedDurationMinutes: 60,
            isPublic: true
          });
          
          setTimeout(() => {
            if (this.fromYouPrograms) {
              this.router.navigate(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
            } else {
              this.router.navigate(['/dashboard/programs']);
            }
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Erreur lors de la création du programme';
          console.error('Erreur création programme:', error);
        }
      });
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
        case 'equipmentRequired': return 'L\'équipement requis est obligatoire';
        default: return 'Ce champ est requis';
      }
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Le nom doit contenir au moins ${requiredLength} caractères`;
        case 'description': return `La description doit contenir au moins ${requiredLength} caractères`;
        case 'equipmentRequired': return `L'équipement doit contenir au moins ${requiredLength} caractères`;
        default: return `Minimum ${requiredLength} caractères`;
      }
    }

    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      switch (controlName) {
        case 'name': return `Le nom ne peut pas dépasser ${requiredLength} caractères`;
        case 'description': return `La description ne peut pas dépasser ${requiredLength} caractères`;
        case 'equipmentRequired': return `L'équipement ne peut pas dépasser ${requiredLength} caractères`;
        default: return `Maximum ${requiredLength} caractères`;
      }
    }

    if (errors['min']) {
      const minValue = errors['min'].min;
      switch (controlName) {
        case 'durationWeeks': return `La durée doit être d'au moins ${minValue} semaine(s)`;
        case 'sessionsPerWeek': return `Le nombre de sessions doit être d'au moins ${minValue}`;
        case 'estimatedDurationMinutes': return `La durée estimée doit être d'au moins ${minValue} minutes`;
        default: return `La valeur minimale est ${minValue}`;
      }
    }

    if (errors['max']) {
      const maxValue = errors['max'].max;
      switch (controlName) {
        case 'durationWeeks': return `La durée ne peut pas dépasser ${maxValue} semaines`;
        case 'sessionsPerWeek': return `Le nombre de sessions ne peut pas dépasser ${maxValue}`;
        case 'estimatedDurationMinutes': return `La durée estimée ne peut pas dépasser ${maxValue} minutes`;
        default: return `La valeur maximale est ${maxValue}`;
      }
    }

    return 'Valeur invalide';
  }

  /**
   * Format duration in minutes to a readable string.
   * Formate la durée en minutes en une chaîne lisible.
   * 
   * @param minutes - Duration in minutes
   * @returns Formatted duration string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }
} 