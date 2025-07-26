import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileEditModalComponent } from './profile-edit-modal.component';
import { UserProfileService } from '../../services/user-profile.service';
import { UserProfile } from '../../models/user-profile.model';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.editForm.get('firstName')?.value).toBe('');
    expect(component.editForm.get('lastName')?.value).toBe('');
    expect(component.editForm.get('dateOfBirth')?.value).toBe('');
    expect(component.editForm.get('phoneNumber')?.value).toBe('');
  });

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

  it('should validate required fields', () => {
    const form = component.editForm;
    
    expect(form.valid).toBeFalsy();
    expect(form.get('firstName')?.errors?.['required']).toBeTruthy();
    expect(form.get('lastName')?.errors?.['required']).toBeTruthy();
    expect(form.get('dateOfBirth')?.errors?.['required']).toBeTruthy();
  });

  it('should validate name length', () => {
    const firstNameControl = component.editForm.get('firstName');
    const lastNameControl = component.editForm.get('lastName');
    
    firstNameControl?.setValue('A');
    firstNameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(firstNameControl?.errors?.['minlength']).toBeTruthy();
    
    firstNameControl?.setValue('A'.repeat(51));
    firstNameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(firstNameControl?.errors?.['maxlength']).toBeTruthy();
    
    lastNameControl?.setValue('A');
    lastNameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(lastNameControl?.errors?.['minlength']).toBeTruthy();
    
    lastNameControl?.setValue('A'.repeat(51));
    lastNameControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(lastNameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should validate date of birth', () => {
    const dateControl = component.editForm.get('dateOfBirth');
    
    // Future date should be invalid
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    dateControl?.setValue(futureDate.toISOString().split('T')[0]);
    dateControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(dateControl?.errors?.['tooOld']).toBeTruthy();
    
    // Date making user too young (less than 13 years old)
    const youngDate = new Date();
    youngDate.setFullYear(youngDate.getFullYear() - 10);
    dateControl?.setValue(youngDate.toISOString().split('T')[0]);
    dateControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(dateControl?.errors?.['tooYoung']).toBeTruthy();
  });

  it('should validate phone number format', () => {
    const phoneControl = component.editForm.get('phoneNumber');
    
    // Valid French phone numbers
    phoneControl?.setValue('0612345678');
    phoneControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(phoneControl?.errors).toBeNull();
    
    phoneControl?.setValue('01 23 45 67 89');
    phoneControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(phoneControl?.errors).toBeNull();
    
    phoneControl?.setValue('+33 6 12 34 56 78');
    phoneControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(phoneControl?.errors).toBeNull();
    
    // Invalid phone numbers
    phoneControl?.setValue('123');
    phoneControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();
    
    phoneControl?.setValue('invalid');
    phoneControl?.updateValueAndValidity();
    fixture.detectChanges();
    expect(phoneControl?.errors?.['pattern']).toBeTruthy();
  });

  it('should submit form when valid', () => {
    const updatedProfile = { ...mockProfile, firstName: 'Pierre' };
    userProfileService.updateMyProfile.and.returnValue(jasmine.createSpyObj('Observable', ['subscribe']));
    
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
  });

  it('should not submit form when invalid', () => {
    spyOn(component.profileUpdated, 'emit');
    spyOn(component.closeModal, 'emit');
    
    component.onSubmit();
    
    expect(userProfileService.updateMyProfile).not.toHaveBeenCalled();
    expect(component.profileUpdated.emit).not.toHaveBeenCalled();
    expect(component.closeModal.emit).not.toHaveBeenCalled();
  });

  it('should close modal on backdrop click', () => {
    spyOn(component.closeModal, 'emit');
    
    const event = new MouseEvent('click');
    component.onBackdropClick(event);
    
    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should close modal on close button click', () => {
    spyOn(component.closeModal, 'emit');
    
    component.onClose();
    
    expect(component.closeModal.emit).toHaveBeenCalled();
  });
}); 