import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { CreateProgramExerciseRequest } from '../../../models/program-exercise.model';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-add-exercise-to-program',
  templateUrl: './add-exercise-to-program.component.html',
  styleUrls: ['./add-exercise-to-program.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, NavBarComponent],
  standalone: true,
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
      setsCount: ['', [Validators.required, Validators.min(1), Validators.max(20)]],
      repsCount: ['', [Validators.min(1), Validators.max(100)]],
      restDurationSeconds: ['', [Validators.min(0), Validators.max(600)]],
      weightKg: ['', [Validators.min(0), Validators.max(500)]],
      distanceMeters: ['', [Validators.min(0), Validators.max(10000)]],
      notes: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.checkProvenance();
    this.loadProgramId();
    this.loadAvailableExercises();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge l'utilisateur actuel
   * Load current user
   */
  private loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Vérifie la provenance de la navigation
   * Check navigation provenance
   */
  private checkProvenance(): void {
    this.route.queryParams.subscribe(params => {
      this.fromYouPrograms = params['from'] === 'you-programs';
    });
  }

  /**
   * Charge l'ID du programme depuis les paramètres de route
   * Load program ID from route parameters
   */
  private loadProgramId(): void {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      if (!this.programId) {
        this.router.navigate(['/dashboard/programs']);
      }
    });
  }

  /**
   * Charge les exercices disponibles
   * Load available exercises
   */
  loadAvailableExercises(): void {
    this.exerciseService.getAllExercises()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (exercises: any[]) => {
          this.availableExercises = exercises;
        },
        error: (err: any) => {
          this.handleError(err, 'Erreur lors du chargement des exercices');
        }
      });
  }

  /**
   * Gère les erreurs de manière centralisée
   * Handle errors in a centralized way
   */
  private handleError(error: any, defaultMessage: string): void {
    console.error('Error:', error);
    if (error.status === 404) {
      this.error = 'Programme ou exercice non trouvé.';
    } else if (error.status === 403) {
      this.error = 'Vous n\'avez pas les permissions pour modifier ce programme.';
    } else if (error.status === 400) {
      this.error = 'Données invalides. Veuillez vérifier les informations saisies.';
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

      const formData: CreateProgramExerciseRequest = {
        trainingProgramId: this.programId,
        exerciseId: this.addExerciseForm.get('exerciseId')?.value,
        setsCount: this.addExerciseForm.get('setsCount')?.value,
        repsCount: this.addExerciseForm.get('repsCount')?.value,
        restDurationSeconds: this.addExerciseForm.get('restDurationSeconds')?.value,
        weightKg: this.addExerciseForm.get('weightKg')?.value,
        distanceMeters: this.addExerciseForm.get('distanceMeters')?.value,
        notes: this.addExerciseForm.get('notes')?.value,
      };
      
      this.programExerciseService.createProgramExercise(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.success = 'Exercice ajouté au programme avec succès !';
            this.loading = false;
            setTimeout(() => {
              this.goBackToProgram();
            }, 2000);
          },
          error: (err: any) => {
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