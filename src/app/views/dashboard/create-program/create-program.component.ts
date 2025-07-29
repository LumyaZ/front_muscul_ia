import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { TrainingProgramService } from '../../../services/training-program.service';
import { AuthService } from '../../../services/auth.service';

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
export class CreateProgramComponent implements OnInit {
  
  /**
   * Form group for creating a new training program.
   * Groupe de formulaire pour créer un nouveau programme d'entraînement.
   */
  createProgramForm: FormGroup;
  
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private trainingProgramService: TrainingProgramService,
    private authService: AuthService
  ) {
    this.createProgramForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      targetAudience: ['', Validators.required],
      durationWeeks: [4, [Validators.required, Validators.min(1), Validators.max(52)]],
      sessionsPerWeek: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
      estimatedDurationMinutes: [60, [Validators.required, Validators.min(15), Validators.max(300)]],
      equipmentRequired: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      isPublic: [false]
    });
  }

  ngOnInit(): void {
    // Initialize form with default values
    this.createProgramForm.patchValue({
      category: this.categories[0],
      difficultyLevel: this.difficultyLevels[0],
      targetAudience: this.targetAudiences[0]
    });
  }

  onSubmit(): void {
    if (this.createProgramForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData: CreateProgramForm = this.createProgramForm.value;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        this.error = 'Erreur: Utilisateur non connecté';
        this.loading = false;
        return;
      }
      
      this.trainingProgramService.createTrainingProgram(formData, currentUser.id).subscribe({
        next: (result) => {
          this.success = 'Programme créé avec succès !';
          this.loading = false;
          setTimeout(() => {
            // Navigate to the newly created program details
            this.router.navigate(['/dashboard/programs', result.id]);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Erreur lors de la création du programme';
          this.loading = false;
          console.error('Erreur création programme:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marks all form controls as touched to trigger validation display.
   * Marque tous les contrôles du formulaire comme touchés pour déclencher l'affichage de validation.
   * 
   * This method is used to show validation errors when the form is submitted
   * but contains invalid data.
   * 
   * Cette méthode est utilisée pour afficher les erreurs de validation
   * quand le formulaire est soumis mais contient des données invalides.
   */
  markFormGroupTouched(): void {
    Object.keys(this.createProgramForm.controls).forEach(key => {
      const control = this.createProgramForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigates back to the programs list.
   * Navigue vers la liste des programmes.
   * 
   * This method returns the user to the main programs list page.
   * 
   * Cette méthode ramène l'utilisateur à la page principale de liste des programmes.
   */
  goBackToPrograms(): void {
    this.router.navigate(['/dashboard/programs']);
  }

  /**
   * Gets the error message for a form control.
   * Obtient le message d'erreur pour un contrôle de formulaire.
   * 
   * @param controlName - Name of the form control
   * @returns Error message string
   */
  getErrorMessage(controlName: string): string {
    const control = this.createProgramForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['minlength']) {
        return `Minimum ${control.errors['minlength'].requiredLength} caractères`;
      }
      if (control.errors['maxlength']) {
        return `Maximum ${control.errors['maxlength'].requiredLength} caractères`;
      }
      if (control.errors['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `La valeur maximale est ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  /**
   * Calculates estimated duration in hours and minutes.
   * Calcule la durée estimée en heures et minutes.
   * 
   * @param minutes - Duration in minutes
   * @returns Formatted duration string
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }
} 