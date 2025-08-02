import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { TrainingInfoService } from '../../services/training-info.service';
import { 
  Gender, 
  ExperienceLevel, 
  SessionFrequency, 
  SessionDuration, 
  MainGoal, 
  TrainingPreference, 
  Equipment,
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

export type TrainingCategory = 'personal' | 'experience' | 'goals' | 'equipment';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

@Component({
  selector: 'app-training-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './training-edit-modal.component.html',
  styleUrls: ['./training-edit-modal.component.scss']
})
export class TrainingEditModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() category: TrainingCategory = 'personal';
  @Input() currentTrainingInfo: TrainingInfo | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() trainingUpdated = new EventEmitter<TrainingInfo>();

  private previousBodyOverflow: string = '';

  editForm!: FormGroup;
  isLoading = false;
  error: string | null = null;

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

  constructor(
    private fb: FormBuilder,
    private trainingInfoService: TrainingInfoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.lockBody();
      this.initForm();
      this.loadCurrentData();
    } else {
      this.unlockBody();
    }
  }

  ngOnDestroy(): void {
    this.unlockBody();
  }

  /**
   * Initialize form based on category with custom validators.
   * Initialiser le formulaire basé sur la catégorie avec des validateurs personnalisés.
   */
  private initForm(): void {
    switch (this.category) {
      case 'personal':
        this.editForm = this.fb.group({
          gender: ['', [Validators.required]],
          weight: ['', [
            Validators.required, 
            Validators.min(30), 
            Validators.max(300),
            this.weightValidator.bind(this)
          ]],
          height: ['', [
            Validators.required, 
            Validators.min(100), 
            Validators.max(250),
            this.heightValidator.bind(this)
          ]],
          bodyFatPercentage: ['', [
            Validators.min(3), 
            Validators.max(50),
            this.bodyFatValidator.bind(this)
          ]]
        });
        break;
      case 'experience':
        this.editForm = this.fb.group({
          experienceLevel: ['', [Validators.required]],
          sessionFrequency: ['', [Validators.required]],
          sessionDuration: ['', [Validators.required]]
        });
        break;
      case 'goals':
        this.editForm = this.fb.group({
          mainGoal: ['', [Validators.required]],
          trainingPreference: ['', [Validators.required]]
        });
        break;
      case 'equipment':
        this.editForm = this.fb.group({
          equipment: ['', [Validators.required]]
        });
        break;
    }
  }

  /**
   * Custom validator for weight field.
   * Validateur personnalisé pour le champ poids.
   */
  private weightValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const weight = parseFloat(control.value);
    if (isNaN(weight)) {
      return { invalidNumber: true };
    }

    if (weight < 30) {
      return { tooLight: true };
    }

    if (weight > 300) {
      return { tooHeavy: true };
    }

    return null;
  }

  /**
   * Custom validator for height field.
   * Validateur personnalisé pour le champ taille.
   */
  private heightValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const height = parseFloat(control.value);
    if (isNaN(height)) {
      return { invalidNumber: true };
    }

    if (height < 100) {
      return { tooShort: true };
    }

    if (height > 250) {
      return { tooTall: true };
    }

    return null;
  }

  /**
   * Custom validator for body fat percentage field.
   * Validateur personnalisé pour le champ pourcentage de graisse corporelle.
   */
  private bodyFatValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const bodyFat = parseFloat(control.value);
    if (isNaN(bodyFat)) {
      return { invalidNumber: true };
    }

    if (bodyFat < 3) {
      return { tooLow: true };
    }

    if (bodyFat > 50) {
      return { tooHigh: true };
    }

    return null;
  }

  /**
   * Check if a field is invalid and has been touched.
   * Vérifier si un champ est invalide et a été touché.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Get error message for a specific field.
   * Obtenir le message d'erreur pour un champ spécifique.
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.editForm.get(fieldName);
    if (!field?.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;

    if (errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (errors['min']) {
      return `La valeur minimale est ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `La valeur maximale est ${errors['max'].max}`;
    }

    if (errors['tooLight']) {
      return 'Le poids doit être d\'au moins 30 kg';
    }

    if (errors['tooHeavy']) {
      return 'Le poids ne peut pas dépasser 300 kg';
    }

    if (errors['tooShort']) {
      return 'La taille doit être d\'au moins 100 cm';
    }

    if (errors['tooTall']) {
      return 'La taille ne peut pas dépasser 250 cm';
    }

    if (errors['tooLow']) {
      return 'Le pourcentage doit être d\'au moins 3%';
    }

    if (errors['tooHigh']) {
      return 'Le pourcentage ne peut pas dépasser 50%';
    }

    if (errors['invalidNumber']) {
      return 'Veuillez entrer un nombre valide';
    }

    return 'Valeur invalide';
  }

  /**
   * Load current training data into form.
   * Charger les données d'entraînement actuelles dans le formulaire.
   */
  loadCurrentData(): void {
    if (this.currentTrainingInfo && this.editForm) {
      switch (this.category) {
        case 'personal':
          this.editForm.patchValue({
            gender: this.currentTrainingInfo.gender || '',
            weight: this.currentTrainingInfo.weight || '',
            height: this.currentTrainingInfo.height || '',
            bodyFatPercentage: this.currentTrainingInfo.bodyFatPercentage || ''
          });
          break;
        case 'experience':
          this.editForm.patchValue({
            experienceLevel: this.currentTrainingInfo.experienceLevel || '',
            sessionFrequency: this.currentTrainingInfo.sessionFrequency || '',
            sessionDuration: this.currentTrainingInfo.sessionDuration || ''
          });
          break;
        case 'goals':
          this.editForm.patchValue({
            mainGoal: this.currentTrainingInfo.mainGoal || '',
            trainingPreference: this.currentTrainingInfo.trainingPreference || ''
          });
          break;
        case 'equipment':
          this.editForm.patchValue({
            equipment: this.currentTrainingInfo.equipment || ''
          });
          break;
      }
      
      this.editForm.markAsTouched();
      this.cdr.detectChanges();
    } else {
      console.warn('No training info or form not initialized');
    }
  }

  /**
   * Get category title.
   * Obtenir le titre de la catégorie.
   */
  getCategoryTitle(): string {
    switch (this.category) {
      case 'personal':
        return 'Informations personnelles';
      case 'experience':
        return 'Expérience d\'entraînement';
      case 'goals':
        return 'Objectifs et préférences';
      case 'equipment':
        return 'Équipement';
      default:
        return '';
    }
  }

  /**
   * Get category icon.
   * Obtenir l'icône de la catégorie.
   */
  getCategoryIcon(): string {
    switch (this.category) {
      case 'personal':
        return 'fas fa-user-circle';
      case 'experience':
        return 'fas fa-chart-line';
      case 'goals':
        return 'fas fa-bullseye';
      case 'equipment':
        return 'fas fa-tools';
      default:
        return '';
    }
  }

  /**
   * Get display name for enum values.
   * Obtenir le nom d'affichage pour les valeurs enum.
   */
  getDisplayName(enumValue: string, displayNames: Record<string, string>): string {
    return displayNames[enumValue] || enumValue;
  }

  /**
   * Select option for button groups.
   * Sélectionner une option pour les groupes de boutons.
   */
  selectOption(field: string, value: string): void {
    this.editForm.get(field)?.setValue(value);
    this.onFieldChange();
  }

  /**
   * Submit form with error handling.
   * Soumettre le formulaire avec gestion d'erreurs.
   */
  onSubmit(): void {
    if (this.editForm.valid && this.currentTrainingInfo) {
      this.isLoading = true;
      this.error = null;

      const updateRequest: UpdateTrainingInfoRequest = {
        ...this.currentTrainingInfo,
        ...this.editForm.value
      };

      this.trainingInfoService.updateTrainingInfo(updateRequest).subscribe({
        next: (updatedTrainingInfo: TrainingInfo) => {
          this.isLoading = false;
          this.trainingUpdated.emit(updatedTrainingInfo);
          this.closeModal.emit();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.handleError(err);
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  /**
   * Handle errors in a centralized way.
   * Gérer les erreurs de manière centralisée.
   */
  private handleError(error: any): void {
    if (error.status === 400) {
      this.error = 'Veuillez vérifier les informations saisies.';
    } else if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
    } else if (error.status === 403) {
      this.error = 'Vous n\'avez pas les permissions pour effectuer cette action.';
    } else if (error.status === 404) {
      this.error = 'Informations d\'entraînement non trouvées.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.';
    }
    console.error('Error updating training info:', error);
  }

  /**
   * Mark all form controls as touched to show validation errors.
   * Marquer tous les contrôles du formulaire comme touchés pour afficher les erreurs de validation.
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.editForm.controls).forEach(key => {
      const control = this.editForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Close modal.
   * Fermer la modale.
   */
  onClose(): void {
    this.closeModal.emit();
  }

  /**
   * Handle backdrop click.
   * Gérer le clic sur l'arrière-plan.
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  /**
   * Clear error message when user starts typing.
   * Effacer le message d'erreur quand l'utilisateur commence à taper.
   */
  onFieldChange(): void {
    if (this.error) {
      this.error = null;
    }
  }

  /**
   * Lock body scroll when modal is open.
   * Verrouiller le scroll du body quand la modale est ouverte.
   */
  private lockBody(): void {
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  }

  /**
   * Unlock body scroll when modal is closed.
   * Déverrouiller le scroll du body quand la modale est fermée.
   */
  private unlockBody(): void {
    document.body.style.overflow = this.previousBodyOverflow;
    document.body.classList.remove('modal-open');
  }
} 