import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';
import { ExerciseService } from '../../../services/exercise.service';
import { ProgramExerciseService } from '../../../services/program-exercise.service';

/**
 * Interface for the form data to add an exercise to a program.
 * Interface pour les données du formulaire d'ajout d'exercice à un programme.
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
 * Component for adding an exercise to a training program.
 * Composant pour ajouter un exercice à un programme d'entraînement.
 * 
 * This component provides a form interface for users to add new exercises
 * to existing training programs with specific parameters like sets, reps,
 * duration, and rest periods.
 * 
 * Ce composant fournit une interface de formulaire pour que les utilisateurs
 * puissent ajouter de nouveaux exercices à des programmes d'entraînement
 * existants avec des paramètres spécifiques comme les séries, répétitions,
 * durée et périodes de repos.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-add-exercise-to-program',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, NavBarComponent],
  templateUrl: './add-exercise-to-program.component.html',
  styleUrls: ['./add-exercise-to-program.component.scss']
})
export class AddExerciseToProgramComponent implements OnInit {
  
  /**
   * Form group for adding exercise to program.
   * Groupe de formulaire pour ajouter un exercice au programme.
   */
  addExerciseForm: FormGroup;
  
  /**
   * ID of the training program.
   * ID du programme d'entraînement.
   */
  programId: number = 0;
  
  /**
   * Name of the training program.
   * Nom du programme d'entraînement.
   */
  programName: string = '';
  
  /**
   * List of available exercises to choose from.
   * Liste des exercices disponibles à choisir.
   */
  availableExercises: any[] = [];
  
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
   * Success message to display after successful addition.
   * Message de succès à afficher après ajout réussi.
   */
  success = '';

  /**
   * Constructor for AddExerciseToProgramComponent.
   * Constructeur pour AddExerciseToProgramComponent.
   * 
   * @param fb - Form builder service
   * @param route - Angular activated route service
   * @param router - Angular router service
   * @param exerciseService - Service for exercise operations
   * @param programExerciseService - Service for program exercise operations
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
    private programExerciseService: ProgramExerciseService
  ) {
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

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   * 
   * This method initializes the component by loading the program ID from route
   * parameters and loading available exercises.
   * 
   * Cette méthode initialise le composant en chargeant l'ID du programme
   * depuis les paramètres de route et en chargeant les exercices disponibles.
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.programId = +params['id'];
      if (this.programId) {
        this.loadAvailableExercises();
        this.loadProgramDetails();
      }
    });
  }

  /**
   * Loads available exercises from the service.
   * Charge les exercices disponibles depuis le service.
   * 
   * This method fetches all available exercises that can be added
   * to the training program.
   * 
   * Cette méthode récupère tous les exercices disponibles qui peuvent
   * être ajoutés au programme d'entraînement.
   */
  loadAvailableExercises(): void {
    this.loading = true;
    this.exerciseService.getAllExercises().subscribe({
      next: (exercises) => {
        this.availableExercises = exercises;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des exercices';
        this.loading = false;
        console.error('Erreur chargement exercices:', err);
      }
    });
  }

  /**
   * Loads program details to display program name.
   * Charge les détails du programme pour afficher le nom du programme.
   * 
   * This method fetches the program details to show the user which
   * program they are adding an exercise to.
   * 
   * Cette méthode récupère les détails du programme pour montrer
   * à l'utilisateur à quel programme il ajoute un exercice.
   */
  loadProgramDetails(): void {
    // TODO: Implement when TrainingProgramService is available
    // this.trainingProgramService.getProgramById(this.programId).subscribe({
    //   next: (program) => {
    //     this.programName = program.name;
    //   },
    //   error: (err) => {
    //     console.error('Erreur chargement programme:', err);
    //   }
    // });
  }

  /**
   * Handles form submission to add exercise to program.
   * Gère la soumission du formulaire pour ajouter un exercice au programme.
   * 
   * This method validates the form and submits the exercise data
   * to be added to the training program.
   * 
   * Cette méthode valide le formulaire et soumet les données d'exercice
   * pour être ajoutées au programme d'entraînement.
   */
  onSubmit(): void {
    if (this.addExerciseForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const formData: AddExerciseToProgramForm = this.addExerciseForm.value;
      
      this.programExerciseService.addExerciseToProgram(this.programId, formData).subscribe({
        next: (result) => {
          this.success = 'Exercice ajouté au programme avec succès !';
          this.loading = false;
          setTimeout(() => {
            this.goBackToProgram();
          }, 2000);
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'ajout de l\'exercice au programme';
          this.loading = false;
          console.error('Erreur ajout exercice:', err);
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
    Object.keys(this.addExerciseForm.controls).forEach(key => {
      const control = this.addExerciseForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigates back to the program details page.
   * Navigue vers la page de détails du programme.
   * 
   * This method returns the user to the program details page
   * where they can see the updated list of exercises.
   * 
   * Cette méthode ramène l'utilisateur à la page de détails du programme
   * où il peut voir la liste mise à jour des exercices.
   */
  goBackToProgram(): void {
    this.router.navigate(['/dashboard/programs', this.programId]);
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
   * Gets the display name for an exercise.
   * Obtient le nom d'affichage pour un exercice.
   * 
   * @param exerciseId - ID of the exercise
   * @returns Display name of the exercise
   */
  getExerciseDisplayName(exerciseId: number): string {
    const exercise = this.availableExercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Exercice inconnu';
  }

  /**
   * Gets the error message for a form control.
   * Obtient le message d'erreur pour un contrôle de formulaire.
   * 
   * @param controlName - Name of the form control
   * @returns Error message string
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