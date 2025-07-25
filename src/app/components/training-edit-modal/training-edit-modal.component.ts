import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-training-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './training-edit-modal.component.html',
  styleUrls: ['./training-edit-modal.component.scss']
})
export class TrainingEditModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() category: TrainingCategory = 'personal';
  @Input() currentTrainingInfo: TrainingInfo | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() trainingUpdated = new EventEmitter<TrainingInfo>();

  private previousBodyOverflow: string = '';

  editForm!: FormGroup;
  isLoading = false;
  error: string | null = null;

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.lockBody();
      // Réinitialiser le formulaire et charger les données quand la modale s'ouvre
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
   * Initialize form based on category.
   * Initialiser le formulaire basé sur la catégorie.
   */
  private initForm(): void {
    console.log('Initializing form for category:', this.category);
    
    switch (this.category) {
      case 'personal':
        this.editForm = this.fb.group({
          gender: ['', Validators.required],
          weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
          height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
          bodyFatPercentage: ['', [Validators.min(3), Validators.max(50)]]
        });
        break;
      case 'experience':
        this.editForm = this.fb.group({
          experienceLevel: ['', Validators.required],
          sessionFrequency: ['', Validators.required],
          sessionDuration: ['', Validators.required]
        });
        break;
      case 'goals':
        this.editForm = this.fb.group({
          mainGoal: ['', Validators.required],
          trainingPreference: ['', Validators.required]
        });
        break;
      case 'equipment':
        this.editForm = this.fb.group({
          equipment: ['', Validators.required]
        });
        break;
    }
    
    console.log('Form initialized:', this.editForm);
  }

  /**
   * Load current training data into form.
   * Charger les données d'entraînement actuelles dans le formulaire.
   */
  loadCurrentData(): void {
    console.log('Loading data for category:', this.category);
    console.log('Current training info:', this.currentTrainingInfo);
    
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
      
      // Marquer le formulaire comme touché pour déclencher la validation
      this.editForm.markAsTouched();
      console.log('Form values after loading:', this.editForm.value);
      
      // Forcer la détection des changements
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
  }

  /**
   * Submit form.
   * Soumettre le formulaire.
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
          this.error = 'Erreur lors de la mise à jour des informations d\'entraînement';
          console.error('Erreur mise à jour training info:', err);
        }
      });
    }
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