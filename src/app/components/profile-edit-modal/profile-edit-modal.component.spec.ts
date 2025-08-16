import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileEditModalComponent } from './profile-edit-modal.component';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';
import { of, throwError } from 'rxjs';

describe('ProfileEditModalComponent', () => {
  let component: ProfileEditModalComponent;
  let fixture: ComponentFixture<ProfileEditModalComponent>;
  let mockUserProfileService: jasmine.SpyObj<UserProfileService>;

  const mockProfile: UserProfile = {
    id: 1,
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    phoneNumber: '0123456789',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserProfileService', ['updateMyProfile']);

    await TestBed.configureTestingModule({
      imports: [
        ProfileEditModalComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: UserProfileService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileEditModalComponent);
    component = fixture.componentInstance;
    mockUserProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.isOpen).toBe(false);
      expect(component.currentProfile).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should initialize form on ngOnInit', () => {
      component.ngOnInit();
      expect(component.editForm).toBeDefined();
      expect(component.editForm.get('firstName')).toBeDefined();
      expect(component.editForm.get('lastName')).toBeDefined();
      expect(component.editForm.get('dateOfBirth')).toBeDefined();
      expect(component.editForm.get('phoneNumber')).toBeDefined();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should validate required fields', () => {
      const firstNameControl = component.editForm.get('firstName');
      const lastNameControl = component.editForm.get('lastName');
      const dateOfBirthControl = component.editForm.get('dateOfBirth');

      firstNameControl?.setValue('');
      lastNameControl?.setValue('');
      dateOfBirthControl?.setValue('');

      expect(firstNameControl?.hasError('required')).toBe(true);
      expect(lastNameControl?.hasError('required')).toBe(true);
      expect(dateOfBirthControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum length for names', () => {
      const firstNameControl = component.editForm.get('firstName');
      const lastNameControl = component.editForm.get('lastName');

      firstNameControl?.setValue('A');
      lastNameControl?.setValue('B');

      expect(firstNameControl?.hasError('minlength')).toBe(true);
      expect(lastNameControl?.hasError('minlength')).toBe(true);
    });

    it('should validate maximum length for names', () => {
      const firstNameControl = component.editForm.get('firstName');
      const lastNameControl = component.editForm.get('lastName');

      firstNameControl?.setValue('A'.repeat(51));
      lastNameControl?.setValue('B'.repeat(51));

      expect(firstNameControl?.hasError('maxlength')).toBe(true);
      expect(lastNameControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept valid form data', () => {
      component.editForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '0123456789'
      });
      expect(component.editForm.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should call updateMyProfile with form data', () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        phoneNumber: '0123456789'
      };
      component.editForm.patchValue(formData);
      mockUserProfileService.updateMyProfile.and.returnValue(of(mockProfile));

      component.onSubmit();

      expect(mockUserProfileService.updateMyProfile).toHaveBeenCalledWith(formData);
    });

    it('should handle successful update', (done) => {
      spyOn(component.profileUpdated, 'emit');
      spyOn(component.closeModal, 'emit');
      component.editForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      mockUserProfileService.updateMyProfile.and.returnValue(of(mockProfile));

      component.onSubmit();

      setTimeout(() => {
        expect(component.isLoading).toBe(false);
        expect(component.error).toBeNull();
        expect(component.profileUpdated.emit).toHaveBeenCalledWith(mockProfile);
        expect(component.closeModal.emit).toHaveBeenCalled();
        done();
      });
    });

    it('should handle update error', (done) => {
      component.editForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01'
      });
      mockUserProfileService.updateMyProfile.and.returnValue(throwError(() => new Error('Update failed')));

      component.onSubmit();

      setTimeout(() => {
        expect(component.error).toBe('Erreur lors de la mise à jour du profil');
        expect(component.isLoading).toBe(false);
        done();
      });
    });

    it('should not submit if form is invalid', () => {
      component.editForm.patchValue({
        firstName: '',
        lastName: '',
        dateOfBirth: ''
      });

      component.onSubmit();

      expect(mockUserProfileService.updateMyProfile).not.toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    it('should emit closeModal when close is called', () => {
      spyOn(component.closeModal, 'emit');

      component.onClose();

      expect(component.closeModal.emit).toHaveBeenCalled();
    });

    it('should handle backdrop click', () => {
      spyOn(component, 'onClose');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;
      mockEvent.target = mockEvent.currentTarget;

      component.onBackdropClick(mockEvent);

      expect(component.onClose).toHaveBeenCalled();
    });

    it('should not close on backdrop click if target is not currentTarget', () => {
      spyOn(component, 'onClose');
      const mockEvent = {
        target: document.createElement('div'),
        currentTarget: document.createElement('div')
      } as any;

      component.onBackdropClick(mockEvent);

      expect(component.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Field Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should return true for invalid field that has been touched', () => {
      const firstNameControl = component.editForm.get('firstName');
      firstNameControl?.setValue('');
      firstNameControl?.markAsTouched();

      expect(component.isFieldInvalid('firstName')).toBe(true);
    });

    it('should return false for valid field', () => {
      const firstNameControl = component.editForm.get('firstName');
      firstNameControl?.setValue('John');

      expect(component.isFieldInvalid('firstName')).toBe(false);
    });

    it('should return false for untouched invalid field', () => {
      const firstNameControl = component.editForm.get('firstName');
      firstNameControl?.setValue('');

      expect(component.isFieldInvalid('firstName')).toBe(false);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should handle changes when modal opens', () => {
      component.ngOnInit();
      component.isOpen = true;
      component.currentProfile = mockProfile;

      component.ngOnChanges();

      expect(component.editForm.get('firstName')?.value).toBe(mockProfile.firstName);
      expect(component.editForm.get('lastName')?.value).toBe(mockProfile.lastName);
    });

    it('should handle changes when modal closes', () => {
      component.isOpen = false;
      spyOn(component as any, 'unlockBody');

      component.ngOnChanges();

      expect((component as any).unlockBody).toHaveBeenCalled();
    });

    it('should unlock body on destroy', () => {
      spyOn(component as any, 'unlockBody');

      component.ngOnDestroy();

      expect((component as any).unlockBody).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    it('should load current profile data into form', () => {
      component.ngOnInit();
      component.currentProfile = mockProfile;

      component.loadCurrentData();

      expect(component.editForm.get('firstName')?.value).toBe(mockProfile.firstName);
      expect(component.editForm.get('lastName')?.value).toBe(mockProfile.lastName);
    });

    it('should handle missing profile data gracefully', () => {
      component.ngOnInit();
      component.currentProfile = null;
      spyOn(console, 'warn');

      component.loadCurrentData();

      expect(console.warn).toHaveBeenCalledWith('No profile data or form not initialized');
    });
  });
});