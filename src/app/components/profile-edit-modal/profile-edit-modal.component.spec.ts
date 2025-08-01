import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileEditModalComponent } from './profile-edit-modal.component';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { of, throwError } from 'rxjs';

/**
 * Unit tests for ProfileEditModalComponent.
 * Tests unitaires pour ProfileEditModalComponent.
 */
describe('ProfileEditModalComponent', () => {
  let component: ProfileEditModalComponent;
  let fixture: ComponentFixture<ProfileEditModalComponent>;
  let userProfileService: jasmine.SpyObj<UserProfileService>;

  const mockProfile: UserProfile = {
    id: 1,
    userId: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    dateOfBirth: '1990-01-01',
    age: 33,
    phoneNumber: '0612345678',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserProfileService', ['updateMyProfile']);
    
    await TestBed.configureTestingModule({
      imports: [
        ProfileEditModalComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserProfileService, useValue: spy }
      ]
    }).compileComponents();

    userProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Test de création du composant
   * Test component creation
   */
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    /**
     * Test d'initialisation du formulaire avec des valeurs vides
     * Test form initialization with empty values
     */
    it('should initialize form with empty values', () => {
      expect(component.editForm.get('firstName')?.value).toBe('');
      expect(component.editForm.get('lastName')?.value).toBe('');
      expect(component.editForm.get('dateOfBirth')?.value).toBe('');
      expect(component.editForm.get('phoneNumber')?.value).toBe('');
    });

    /**
     * Test de chargement des données du profil actuel lors de l'ouverture de la modal
     * Test loading current profile data when modal opens
     */
    it('should load current profile data when modal opens', () => {
      component.currentProfile = mockProfile;
      component.isOpen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      
      expect(component.editForm.get('firstName')?.value).toBe('Jean');
      expect(component.editForm.get('lastName')?.value).toBe('Dupont');
      expect(component.editForm.get('dateOfBirth')?.value).toBe('1990-01-01');
      expect(component.editForm.get('phoneNumber')?.value).toBe('0612345678');
    });
  });

  /**
   * Test de validation des champs requis
   * Test required fields validation
   */
  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.editForm;
      
      expect(form.valid).toBeFalsy();
      expect(form.get('firstName')?.errors?.['required']).toBeTruthy();
      expect(form.get('lastName')?.errors?.['required']).toBeTruthy();
      expect(form.get('dateOfBirth')?.errors?.['required']).toBeTruthy();
    });

    /**
     * Test de validation des contraintes de longueur des noms
     * Test name length constraints validation
     */
    it('should validate name length constraints', () => {
      const firstNameControl = component.editForm.get('firstName');
      
      firstNameControl?.setValue('A');
      firstNameControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(firstNameControl?.errors?.['minlength']).toBeTruthy();
      
      firstNameControl?.setValue('A'.repeat(51));
      firstNameControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(firstNameControl?.errors?.['maxlength']).toBeTruthy();
    });

    /**
     * Test de validation des contraintes de date de naissance
     * Test date of birth constraints validation
     */
    it('should validate date of birth constraints', () => {
      const dateControl = component.editForm.get('dateOfBirth');
      
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      dateControl?.setValue(futureDate.toISOString().split('T')[0]);
      dateControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(dateControl?.errors?.['tooOld']).toBeTruthy();
      
      const youngDate = new Date();
      youngDate.setFullYear(youngDate.getFullYear() - 10);
      dateControl?.setValue(youngDate.toISOString().split('T')[0]);
      dateControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(dateControl?.errors?.['tooYoung']).toBeTruthy();
    });

    /**
     * Test de validation du format du numéro de téléphone
     * Test phone number format validation
     */
    it('should validate phone number format', () => {
      const phoneControl = component.editForm.get('phoneNumber');
      
      phoneControl?.setValue('0612345678');
      phoneControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(phoneControl?.errors).toBeNull();
      
      phoneControl?.setValue('01 23 45 67 89');
      phoneControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(phoneControl?.errors).toBeNull();
      
      phoneControl?.setValue('123');
      phoneControl?.updateValueAndValidity();
      fixture.detectChanges();
      expect(phoneControl?.errors?.['pattern']).toBeTruthy();
    });

    /**
     * Test d'identification correcte des champs invalides
     * Test correct identification of invalid fields
     */
    it('should correctly identify invalid fields', () => {
      const firstNameControl = component.editForm.get('firstName');
      firstNameControl?.setValue('A');
      firstNameControl?.markAsTouched();
      fixture.detectChanges();
      
      expect(component.isFieldInvalid('firstName')).toBeTruthy();
      expect(component.isFieldInvalid('lastName')).toBeFalsy();
    });
  });

  /**
   * Test de soumission du formulaire quand il est valide
   * Test form submission when valid
   */
  describe('Form Submission', () => {
    it('should submit form when valid', () => {
      const updatedProfile = { ...mockProfile, firstName: 'Pierre' };
      userProfileService.updateMyProfile.and.returnValue(of(updatedProfile));
      
      component.currentProfile = mockProfile;
      component.isOpen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      
      component.editForm.patchValue({
        firstName: 'Pierre',
        lastName: 'Martin',
        dateOfBirth: '1985-05-15',
        phoneNumber: '0623456789'
      });
      
      spyOn(component.profileUpdated, 'emit');
      spyOn(component.closeModal, 'emit');
      
      component.onSubmit();
      
      expect(userProfileService.updateMyProfile).toHaveBeenCalledWith({
        firstName: 'Pierre',
        lastName: 'Martin',
        dateOfBirth: '1985-05-15',
        phoneNumber: '0623456789'
      });
      expect(component.profileUpdated.emit).toHaveBeenCalledWith(updatedProfile);
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    /**
     * Test de non-soumission du formulaire quand il est invalide
     * Test form not submitted when invalid
     */
    it('should not submit form when invalid', () => {
      spyOn(component.profileUpdated, 'emit');
      spyOn(component.closeModal, 'emit');
      
      component.onSubmit();
      
      expect(userProfileService.updateMyProfile).not.toHaveBeenCalled();
      expect(component.profileUpdated.emit).not.toHaveBeenCalled();
      expect(component.closeModal.emit).not.toHaveBeenCalled();
    });

    /**
     * Test de gestion des erreurs de soumission
     * Test submission error handling
     */
    it('should handle submission error', () => {
      userProfileService.updateMyProfile.and.returnValue(throwError(() => new Error('Network error')));
      
      component.currentProfile = mockProfile;
      component.isOpen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      
      component.editForm.patchValue({
        firstName: 'Pierre',
        lastName: 'Martin',
        dateOfBirth: '1985-05-15',
        phoneNumber: '0623456789'
      });
      
      component.onSubmit();
      
      expect(component.error).toBe('Erreur lors de la mise à jour du profil');
      expect(component.isLoading).toBeFalse();
    });
  });

  /**
   * Test de fermeture de la modal sur clic de l'arrière-plan
   * Test modal close on backdrop click
   */
  describe('Modal Interactions', () => {
    it('should close modal on backdrop click', () => {
      spyOn(component.closeModal, 'emit');
      
      const event = new MouseEvent('click');
      component.onBackdropClick(event);
      
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    /**
     * Test de fermeture de la modal sur clic du bouton de fermeture
     * Test modal close on close button click
     */
    it('should close modal on close button click', () => {
      spyOn(component.closeModal, 'emit');
      
      component.onClose();
      
      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    /**
     * Test de verrouillage du scroll du body lors de l'ouverture de la modal
     * Test body scroll lock when modal opens
     */
    it('should lock body scroll when modal opens', () => {
      component.isOpen = true;
      component.ngOnChanges();
      
      expect(document.body.style.overflow).toBe('hidden');
      expect(document.body.classList.contains('modal-open')).toBeTruthy();
    });

    /**
     * Test de déverrouillage du scroll du body lors de la fermeture de la modal
     * Test body scroll unlock when modal closes
     */
    it('should unlock body scroll when modal closes', () => {
      component.isOpen = false;
      component.ngOnChanges();
      
      expect(document.body.style.overflow).toBe('');
      expect(document.body.classList.contains('modal-open')).toBeFalsy();
    });
  });
}); 