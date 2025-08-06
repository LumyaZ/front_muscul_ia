import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainingInfoService } from '../../services/training-info.service';
import { 
  Gender, 
  ExperienceLevel, 
  SessionFrequency, 
  SessionDuration, 
  MainGoal, 
  TrainingPreference, 
  Equipment,
  CreateTrainingInfoRequest,
  UpdateTrainingInfoRequest,
  TrainingInfo,
  GenderDisplayNames,
  ExperienceLevelDisplayNames,
  SessionFrequencyDisplayNames,
  SessionDurationDisplayNames,
  MainGoalDisplayNames,
  TrainingPreferenceDisplayNames,
  EquipmentDisplayNames
} from '../../models/training-info.model';

/**
 * Component for training information form.
 * Composant pour le formulaire d'informations d'entraînement.
 */
@Component({
  selector: 'app-training-info-form',
  templateUrl: './training-info-form.component.html',
  styleUrls: ['./training-info-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class TrainingInfoFormComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private trainingInfoService = inject(TrainingInfoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  trainingInfoForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  isEditMode = false;
  existingTrainingInfo: TrainingInfo | null = null;
  currentUser: any = null;
  authToken: string | null = null;
  currentStep = 1;

  genderOptions = Object.values(Gender);
  experienceLevelOptions = Object.values(ExperienceLevel);
  sessionFrequencyOptions = Object.values(SessionFrequency);
  sessionDurationOptions = Object.values(SessionDuration);
  mainGoalOptions = Object.values(MainGoal);
  trainingPreferenceOptions = Object.values(TrainingPreference);
  equipmentOptions = Object.values(Equipment);

  genderDisplayNames = GenderDisplayNames;
  experienceLevelDisplayNames = ExperienceLevelDisplayNames;
  sessionFrequencyDisplayNames = SessionFrequencyDisplayNames;
  sessionDurationDisplayNames = SessionDurationDisplayNames;
  mainGoalDisplayNames = MainGoalDisplayNames;
  trainingPreferenceDisplayNames = TrainingPreferenceDisplayNames;
  equipmentDisplayNames = EquipmentDisplayNames;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.initForm();
    this.checkExistingTrainingInfo();
  }

  /**
   * Loads the current user from localStorage
   * Charge l'utilisateur actuel depuis localStorage
   */
  private loadCurrentUser(): void {
    this.authToken = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Initializes the form with validators
   * Initialise le formulaire avec les validateurs
   */
  private initForm(): void {
    this.trainingInfoForm = this.fb.group({
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      bodyFatPercentage: ['', [Validators.min(3), Validators.max(50)]],
      experienceLevel: ['', Validators.required],
      sessionFrequency: ['', Validators.required],
      sessionDuration: ['', Validators.required],
      mainGoal: ['', Validators.required],
      trainingPreference: ['', Validators.required],
      equipment: ['', Validators.required]
    });
  }

  /**
   * Checks if training info already exists for the user
   * Vérifie si les informations d'entraînement existent déjà pour l'utilisateur
   */
  private checkExistingTrainingInfo(): void {
    this.trainingInfoService.existsTrainingInfo().subscribe({
      next: (exists) => {
        if (exists) {
          this.isEditMode = true;
          this.loadExistingTrainingInfo();
        }
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  /**
   * Loads existing training info for editing
   * Charge les informations d'entraînement existantes pour l'édition
   */
  private loadExistingTrainingInfo(): void {
    this.trainingInfoService.getTrainingInfo().subscribe({
      next: (trainingInfo) => {
        this.existingTrainingInfo = trainingInfo;
        this.trainingInfoForm.patchValue({
          gender: trainingInfo.gender,
          weight: trainingInfo.weight,
          height: trainingInfo.height,
          bodyFatPercentage: trainingInfo.bodyFatPercentage,
          experienceLevel: trainingInfo.experienceLevel,
          sessionFrequency: trainingInfo.sessionFrequency,
          sessionDuration: trainingInfo.sessionDuration,
          mainGoal: trainingInfo.mainGoal,
          trainingPreference: trainingInfo.trainingPreference,
          equipment: trainingInfo.equipment
        });
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  /**
   * Handles form submission
   * Gère la soumission du formulaire
   */
  onSubmit(): void {
    if (this.trainingInfoForm.valid) {
      this.isLoading = true;
      this.error = null;

      const formValue = this.trainingInfoForm.value;

      if (this.isEditMode) {
        this.updateTrainingInfo(formValue);
      } else {
        this.createTrainingInfo(formValue);
      }
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  /**
   * Updates existing training info
   * Met à jour les informations d'entraînement existantes
   */
  private updateTrainingInfo(formValue: any): void {
    const updateRequest: UpdateTrainingInfoRequest = {
      gender: formValue.gender,
      weight: formValue.weight,
      height: formValue.height,
      bodyFatPercentage: formValue.bodyFatPercentage || undefined,
      experienceLevel: formValue.experienceLevel,
      sessionFrequency: formValue.sessionFrequency,
      sessionDuration: formValue.sessionDuration,
      mainGoal: formValue.mainGoal,
      trainingPreference: formValue.trainingPreference,
      equipment: formValue.equipment
    };

    this.trainingInfoService.updateTrainingInfo(updateRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }

  /**
   * Creates new training info
   * Crée de nouvelles informations d'entraînement
   */
  private createTrainingInfo(formValue: any): void {
    const createRequest: CreateTrainingInfoRequest = {
      gender: formValue.gender,
      weight: formValue.weight,
      height: formValue.height,
      bodyFatPercentage: formValue.bodyFatPercentage || undefined,
      experienceLevel: formValue.experienceLevel,
      sessionFrequency: formValue.sessionFrequency,
      sessionDuration: formValue.sessionDuration,
      mainGoal: formValue.mainGoal,
      trainingPreference: formValue.trainingPreference,
      equipment: formValue.equipment
    };

    this.trainingInfoService.createTrainingInfo(createRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.handleError(err);
      }
    });
  }

  /**
   * Centralized error handling
   * Gestion centralisée des erreurs
   */
  private handleError(error: any): void {
    if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      this.error = 'Informations d\'entraînement non trouvées.';
    } else if (error.status === 422) {
      this.error = 'Données invalides. Veuillez vérifier vos informations.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
    }
  }

  /**
   * Gets display name for enum values
   * Obtient le nom d'affichage pour les valeurs d'énumération
   */
  getDisplayName(enumValue: string, displayNames: Record<string, string>): string {
    return displayNames[enumValue] || enumValue;
  }

  /**
   * Selects an option for a given field
   * Sélectionne une option pour un champ donné
   * @param field - Field name / Nom du champ
   * @param value - Selected value / Valeur sélectionnée
   */
  selectOption(field: string, value: string): void {
    this.trainingInfoForm.get(field)?.setValue(value);
    this.trainingInfoForm.get(field)?.markAsTouched();
    this.onFieldChange();
  }

  /**
   * Moves to the next step
   * Passe à l'étape suivante
   */
  nextStep(): void {
    if (this.currentStep < 4 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  /**
   * Goes back to the previous step
   * Retourne à l'étape précédente
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Checks if the current step is valid
   * Vérifie si l'étape actuelle est valide
   * @param step - Step number / Numéro de l'étape
   * @returns boolean - True if step is valid / True si l'étape est valide
   */
  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!(this.trainingInfoForm.get('gender')?.valid && 
               this.trainingInfoForm.get('weight')?.valid && 
               this.trainingInfoForm.get('height')?.valid);
      case 2:
        return !!(this.trainingInfoForm.get('experienceLevel')?.valid && 
               this.trainingInfoForm.get('sessionFrequency')?.valid && 
               this.trainingInfoForm.get('sessionDuration')?.valid);
      case 3:
        return !!(this.trainingInfoForm.get('mainGoal')?.valid && 
               this.trainingInfoForm.get('trainingPreference')?.valid);
      case 4:
        return !!this.trainingInfoForm.get('equipment')?.valid;
      default:
        return false;
    }
  }

  /**
   * Checks if a form field is invalid and has been touched
   * Vérifie si un champ du formulaire est invalide et a été touché
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.trainingInfoForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Marks all fields as touched to display errors
   * Marque tous les champs comme touchés pour afficher les erreurs
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.trainingInfoForm.controls).forEach(key => {
      const control = this.trainingInfoForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Clears error message when user starts typing
   * Efface le message d'erreur quand l'utilisateur commence à taper
   */
  onFieldChange(): void {
    if (this.error) {
      this.error = null;
    }
  }

  /**
   * Gets the maximum date for date of birth (today)
   * Retourne la date maximale pour la date de naissance (aujourd'hui)
   */
  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
} 