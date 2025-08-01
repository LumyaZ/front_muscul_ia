import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile, UpdateUserProfileRequest } from '../../models/user-profile.model';

@Component({
  selector: 'app-profile-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-edit-modal.component.html',
  styleUrls: ['./profile-edit-modal.component.scss']
})
export class ProfileEditModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() currentProfile: UserProfile | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<UserProfile>();

  private previousBodyOverflow: string = '';

  editForm!: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
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
   * Initialize form with validators.
   * Initialiser le formulaire avec les validateurs.
   */
  private initForm(): void {
    
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required, this.dateOfBirthValidator.bind(this)]],
      phoneNumber: ['', [this.phoneNumberValidator.bind(this)]]
    });
    
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
   * Custom validator for date of birth.
   * Validateur personnalisé pour la date de naissance.
   */
  private dateOfBirthValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    const minAge = 13;
    const maxAge = 120;

    if (isNaN(selectedDate.getTime())) {
      return { invalidDate: true };
    }

    if (selectedDate > today) {
      return { tooOld: true };
    }

    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - minAge);
    if (selectedDate > minDate) {
      return { tooYoung: true };
    }

    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - maxAge);
    if (selectedDate < maxDate) {
      return { tooOld: true };
    }

    return null;
  }

  /**
   * Custom validator for phone number.
   * Validateur personnalisé pour le numéro de téléphone.
   */
  private phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; 
    }

    const phonePattern = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    
    if (!phonePattern.test(control.value)) {
      return { pattern: true };
    }

    return null;
  }

  /**
   * Load current profile data into form.
   * Charger les données du profil actuel dans le formulaire.
   */
  loadCurrentData(): void {
    
    if (this.currentProfile && this.editForm) {
      const formattedDate = this.currentProfile.dateOfBirth 
        ? new Date(this.currentProfile.dateOfBirth).toISOString().split('T')[0]
        : '';

      this.editForm.patchValue({
        firstName: this.currentProfile.firstName || '',
        lastName: this.currentProfile.lastName || '',
        dateOfBirth: formattedDate,
        phoneNumber: this.currentProfile.phoneNumber || ''
      });
      
      this.editForm.markAsTouched();
      
      this.cdr.detectChanges();
    } else {
      console.warn('No profile data or form not initialized');
    }
  }

  /**
   * Submit form.
   * Soumettre le formulaire.
   */
  onSubmit(): void {
    if (this.editForm.valid) {
      this.isLoading = true;
      this.error = null;

      const updateRequest: UpdateUserProfileRequest = {
        firstName: this.editForm.get('firstName')?.value,
        lastName: this.editForm.get('lastName')?.value,
        dateOfBirth: this.editForm.get('dateOfBirth')?.value,
        phoneNumber: this.editForm.get('phoneNumber')?.value || undefined
      };


      this.userProfileService.updateMyProfile(updateRequest).subscribe({
        next: (updatedProfile: UserProfile) => {
          this.isLoading = false;
          this.profileUpdated.emit(updatedProfile);
          this.closeModal.emit();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = 'Erreur lors de la mise à jour du profil';
          console.error('Error updating profile:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Mark all form controls as touched to show validation errors.
   * Marquer tous les contrôles du formulaire comme touchés pour afficher les erreurs de validation.
   */
  private markFormGroupTouched(): void {
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