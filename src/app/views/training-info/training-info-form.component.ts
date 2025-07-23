import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-training-info-form',
  templateUrl: './training-info-form.component.html',
  styleUrls: ['./training-info-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class TrainingInfoFormComponent implements OnInit {
  trainingInfoForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  isEditMode = false;
  existingTrainingInfo: TrainingInfo | null = null;
  currentUser: any = null;
  authToken: string | null = null;
  currentStep = 1;

  // Display names for dropdowns
  genderOptions = Object.values(Gender);
  experienceLevelOptions = Object.values(ExperienceLevel);
  sessionFrequencyOptions = Object.values(SessionFrequency);
  sessionDurationOptions = Object.values(SessionDuration);
  mainGoalOptions = Object.values(MainGoal);
  trainingPreferenceOptions = Object.values(TrainingPreference);
  equipmentOptions = Object.values(Equipment);

  // Display name mappings
  genderDisplayNames = GenderDisplayNames;
  experienceLevelDisplayNames = ExperienceLevelDisplayNames;
  sessionFrequencyDisplayNames = SessionFrequencyDisplayNames;
  sessionDurationDisplayNames = SessionDurationDisplayNames;
  mainGoalDisplayNames = MainGoalDisplayNames;
  trainingPreferenceDisplayNames = TrainingPreferenceDisplayNames;
  equipmentDisplayNames = EquipmentDisplayNames;

  constructor(
    private fb: FormBuilder,
    private trainingInfoService: TrainingInfoService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté et le token
    this.loadCurrentUser();
    
    this.initForm();
    this.checkExistingTrainingInfo();
  }

  private loadCurrentUser(): void {
    // Récupérer le token et l'utilisateur depuis localStorage
    this.authToken = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      console.log('Utilisateur connecté:', this.currentUser);
      console.log('Token:', this.authToken);
    } else {
      console.warn('Aucun utilisateur connecté trouvé');
      // Rediriger vers login si pas d'utilisateur connecté
      this.router.navigate(['/login']);
    }
  }

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

  private checkExistingTrainingInfo(): void {
    this.trainingInfoService.existsTrainingInfo().subscribe({
      next: (exists) => {
        if (exists) {
          this.isEditMode = true;
          this.loadExistingTrainingInfo();
        }
      },
      error: (err) => {
        console.error('Error checking training info existence:', err);
      }
    });
  }

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
        console.error('Error loading existing training info:', err);
        this.error = 'Erreur lors du chargement des informations existantes.';
      }
    });
  }

  onSubmit(): void {
    if (this.trainingInfoForm.valid) {
      this.isLoading = true;
      this.error = null;

      const formValue = this.trainingInfoForm.value;

      if (this.isEditMode) {
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
            console.log('Informations d\'entraînement mises à jour avec succès', response);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour des informations d\'entraînement', err);
            this.error = err.error?.message || 'Une erreur est survenue lors de la mise à jour.';
            this.isLoading = false;
          }
        });
      } else {
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
            console.log('Informations d\'entraînement créées avec succès', response);
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            console.error('Erreur lors de la création des informations d\'entraînement', err);
            this.error = err.error?.message || 'Une erreur est survenue lors de la création.';
            this.isLoading = false;
          }
        });
      }
    }
  }

  getDisplayName(enumValue: string, displayNames: Record<string, string>): string {
    return displayNames[enumValue] || enumValue;
  }

  /**
   * Sélectionne une option pour un champ donné
   * @param field - Nom du champ
   * @param value - Valeur sélectionnée
   */
  selectOption(field: string, value: string): void {
    this.trainingInfoForm.get(field)?.setValue(value);
    this.trainingInfoForm.get(field)?.markAsTouched();
  }

  /**
   * Passe à l'étape suivante
   */
  nextStep(): void {
    if (this.currentStep < 4 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  /**
   * Retourne à l'étape précédente
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Vérifie si l'étape actuelle est valide
   * @param step - Numéro de l'étape
   * @returns boolean - True si l'étape est valide
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
} 