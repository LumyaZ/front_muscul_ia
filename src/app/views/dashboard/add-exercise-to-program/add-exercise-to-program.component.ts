import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

/**
 * Interface pour les données du formulaire d'ajout d'exercice
 * Interface for exercise addition form data
 */
interface AddExerciseToProgramForm {
  exerciseId: number;
  orderInProgram: number;
  setsCount: number;
  repsCount?: number;
  durationSeconds?: number;
  restDurationSeconds: number;
  weightKg?: number;
  distanceMeters?: number;
  notes?: string;
  isOptional: boolean;
}

/**
 * Composant pour ajouter un exercice à un programme d'entraînement
 * Component for adding an exercise to a training program
 */
@Component({
  selector: 'app-add-exercise-to-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './add-exercise-to-program.component.html',
  styleUrls: ['./add-exercise-to-program.component.scss']
})
export class AddExerciseToProgramComponent implements OnInit, OnDestroy {
  
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private exerciseService = inject(ExerciseService);
  private programExerciseService = inject(ProgramExerciseService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  
  addExerciseForm: FormGroup;
  programId: number = 0;
  programName: string = '';
  availableExercises: any[] = [];
  loading = false;
  error = '';
  success = '';
  currentUser: User | null = null;
  fromYouPrograms: boolean = false;

  constructor() {
    this.addExerciseForm = this.fb.group({
      exerciseId: ['', Validators.required],
      orderInProgram: ['', [Validators.required, Validators.min(1)]],
      setsCount: ['', [Validators.required, Validators.min(1)]],
      repsCount: ['', [Validators.min(1)]],
      durationSeconds: ['', [Validators.min(1)]],
      restDurationSeconds: ['', [Validators.required, Validators.min(0)]],
      weightKg: ['', [Validators.min(0)]],
      distanceMeters: ['', [Validators.min(0)]],
      notes: [''],
      isOptional: [false]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkProvenance();
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      if (this.programId) {
        this.loadAvailableExercises();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données de l'utilisateur connecté
   * Load current authenticated user data
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Vérifie la provenance de l'utilisateur
   * Check user provenance
   */
  private checkProvenance(): void {
    this.route.queryParams.subscribe(params => {
      this.fromYouPrograms = params['from'] === 'you-programs';
    });
  }

  /**
   * Charge les exercices disponibles
   * Load available exercises
   */
  loadAvailableExercises(): void {
    this.loading = true;
    this.exerciseService.getAllExercises()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exercises) => {
          this.availableExercises = exercises;
          this.loading = false;
        },
        error: (err) => {
          this.handleError(err, 'Erreur lors du chargement des exercices');
          this.loading = false;
        }
      });
  }

  /**
   * Gère les erreurs de manière centralisée
   * Handle errors in a centralized way
   */
  private handleError(error: any, defaultMessage: string): void {
    console.error('Erreur:', error);
    
    if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      this.error = 'Programme non trouvé.';
    } else {
      this.error = defaultMessage;
    }
  }

  /**
   * Gère la soumission du formulaire
   * Handle form submission
   */
  onSubmit(): void {
    if (this.addExerciseForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData: AddExerciseToProgramForm = this.addExerciseForm.value;
      
      this.programExerciseService.addExerciseToProgram(this.programId, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.success = 'Exercice ajouté au programme avec succès !';
            this.loading = false;
            setTimeout(() => {
              this.goBackToProgram();
            }, 2000);
          },
          error: (err) => {
            this.handleError(err, 'Erreur lors de l\'ajout de l\'exercice au programme');
            this.loading = false;
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Marque tous les contrôles du formulaire comme touchés
   * Mark all form controls as touched
   */
  markFormGroupTouched(): void {
    Object.keys(this.addExerciseForm.controls).forEach(key => {
      const control = this.addExerciseForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigue vers les détails du programme
   * Navigate to program details
   */
  goBackToProgram(): void {
    if (this.fromYouPrograms) {
      this.router.navigate(['/dashboard/programs', this.programId], {
        queryParams: {
          from: 'you-programs',
          userId: this.currentUser?.id
        }
      });
    } else {
      this.router.navigate(['/dashboard/programs', this.programId]);
    }
  }

  /**
   * Navigue vers la liste des programmes
   * Navigate to programs list
   */
  goBackToPrograms(): void {
    if (this.fromYouPrograms) {
      this.router.navigate(['/dashboard/you'], { queryParams: { from: 'you-programs' } });
    } else {
      this.router.navigate(['/dashboard/programs']);
    }
  }

  /**
   * Obtient le nom d'affichage d'un exercice
   * Get exercise display name
   */
  getExerciseDisplayName(exerciseId: number): string {
    const exercise = this.availableExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Exercice inconnu';
  }

  /**
   * Obtient le message d'erreur pour un contrôle
   * Get error message for a form control
   */
  getErrorMessage(controlName: string): string {
    const control = this.addExerciseForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
      if (control.errors['min']) {
        return `La valeur minimale est ${control.errors['min'].min}`;
      }
    }
    return '';
  }
} 