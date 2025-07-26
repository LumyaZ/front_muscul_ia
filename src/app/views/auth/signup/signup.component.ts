import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserProfileService } from '../../../services/user-profile.service';

/**
 * Component for user registration with comprehensive profile information.
 * Composant pour l'enregistrement utilisateur avec informations de profil complètes.
 * 
 * This component handles user registration including authentication data and
 * profile information. It provides a comprehensive reactive form with validation
 * for email, password strength, profile details, and age verification. The
 * component integrates with both authentication and user profile services.
 * 
 * Ce composant gère l'enregistrement utilisateur incluant les données
 * d'authentification et les informations de profil. Il fournit un formulaire
 * réactif complet avec validation pour email, force du mot de passe, détails
 * du profil et vérification de l'âge. Le composant s'intègre avec les services
 * d'authentification et de profil utilisateur.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  standalone: true,
})
export class SignupComponent {
  
  /**
   * Form builder service for creating reactive forms.
   * Service de construction de formulaires pour créer des formulaires réactifs.
   */
  private fb = inject(FormBuilder);
  
  /**
   * Authentication service for registration operations.
   * Service d'authentification pour les opérations d'enregistrement.
   */
  private authService = inject(AuthService);
  
  /**
   * User profile service for profile creation.
   * Service de profil utilisateur pour la création de profil.
   */
  private userProfileService = inject(UserProfileService);
  
  /**
   * Angular router for navigation.
   * Routeur Angular pour la navigation.
   */
  private router = inject(Router);

  /**
   * Reactive form for user registration with authentication and profile fields.
   * Formulaire réactif pour l'enregistrement utilisateur avec champs d'authentification et profil.
   */
  signupForm: FormGroup;
  
  /**
   * Error message to display if registration fails.
   * Message d'erreur à afficher si l'enregistrement échoue.
   */
  error: string | null = null;
  
  /**
   * Loading state indicator during registration process.
   * Indicateur d'état de chargement pendant le processus d'enregistrement.
   */
  isLoading = false;
  
  /**
   * Flag to toggle password visibility.
   * Indicateur pour basculer la visibilité du mot de passe.
   */
  showPassword = false;
  
  /**
   * Flag to toggle confirm password visibility.
   * Indicateur pour basculer la visibilité de la confirmation du mot de passe.
   */
  showConfirmPassword = false;

  /**
   * Constructor for SignupComponent.
   * Constructeur pour SignupComponent.
   * 
   * Initializes the reactive form with comprehensive validation including
   * authentication fields, profile information, and custom validators.
   * 
   * Initialise le formulaire réactif avec validation complète incluant
   * les champs d'authentification, les informations de profil et les validateurs personnalisés.
   */
  constructor() {
    // Create reactive form with validation
    this.signupForm = this.fb.group({
      // Authentication fields
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]],
      
      // User profile fields
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)]],
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Custom validator to ensure password and confirm password match.
   * Validateur personnalisé pour s'assurer que le mot de passe et sa confirmation correspondent.
   * 
   * This validator checks if the password and confirmPassword fields have
   * the same value and returns an error if they don't match.
   * 
   * Ce validateur vérifie si les champs password et confirmPassword ont
   * la même valeur et retourne une erreur s'ils ne correspondent pas.
   * 
   * @param control - Form control containing password fields
   * @returns Record<string, boolean> | null - Error object or null if valid
   */
  passwordMatchValidator(
    control: AbstractControl,
  ): Record<string, boolean> | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Validator to ensure date of birth is not in the future and user is old enough.
   * Validateur pour s'assurer que la date de naissance n'est pas dans le futur et que l'utilisateur est assez âgé.
   * 
   * This validator checks that the selected date is not in the future and
   * that the user is at least 13 years old.
   * 
   * Ce validateur vérifie que la date sélectionnée n'est pas dans le futur
   * et que l'utilisateur a au moins 13 ans.
   * 
   * @param control - Form control containing date of birth
   * @returns Record<string, boolean> | null - Error object or null if valid
   */
  dateOfBirthValidator(control: AbstractControl): Record<string, boolean> | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      
      if (selectedDate > today) {
        return { futureDate: true };
      }
      
      // Check that user is at least 13 years old
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 13);
      
      if (selectedDate > minAge) {
        return { tooYoung: true };
      }
    }
    return null;
  }

  /**
   * Toggles password visibility.
   * Bascule la visibilité du mot de passe.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Toggles confirm password visibility.
   * Bascule la visibilité de la confirmation du mot de passe.
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Gets the error message for the password field.
   * Obtient le message d'erreur pour le champ mot de passe.
   */
  getPasswordErrorMessage(): string {
    const passwordControl = this.signupForm.get('password');
    if (!passwordControl?.errors) return '';

    if (passwordControl.errors['required']) {
      return 'Le mot de passe est obligatoire';
    }
    if (passwordControl.errors['minlength']) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (passwordControl.errors['pattern']) {
      return 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)';
    }
    return '';
  }

  /**
   * Calculates password strength.
   * Calcule la force du mot de passe.
   */
  getPasswordStrength(): { score: number; label: string; color: string } {
    const password = this.signupForm.get('password')?.value || '';
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    const labels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
    
    return {
      score: Math.min(score, 5),
      label: labels[Math.min(score - 1, 4)],
      color: colors[Math.min(score - 1, 4)]
    };
  }

  /**
   * Checks if password has at least 8 characters.
   * Vérifie si le mot de passe a au moins 8 caractères.
   */
  hasMinLength(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return password.length >= 8;
  }

  /**
   * Checks if password contains at least one lowercase letter.
   * Vérifie si le mot de passe contient au moins une minuscule.
   */
  hasLowercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  /**
   * Checks if password contains at least one uppercase letter.
   * Vérifie si le mot de passe contient au moins une majuscule.
   */
  hasUppercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  /**
   * Checks if password contains at least one number.
   * Vérifie si le mot de passe contient au moins un chiffre.
   */
  hasNumber(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  /**
   * Checks if password contains at least one special character.
   * Vérifie si le mot de passe contient au moins un caractère spécial.
   */
  hasSpecialChar(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[@$!%*?&]/.test(password);
  }

  /**
   * Submits the registration form.
   * Soumet le formulaire d'inscription.
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.error = null;

      // Prepare data for combined endpoint
      const request = {
        userData: {
          email: this.signupForm.get('email')?.value,
          password: this.signupForm.get('password')?.value,
          confirmPassword: this.signupForm.get('confirmPassword')?.value
        },
        profileData: {
          firstName: this.signupForm.get('firstName')?.value,
          lastName: this.signupForm.get('lastName')?.value,
          dateOfBirth: this.signupForm.get('dateOfBirth')?.value,
          phoneNumber: this.signupForm.get('phoneNumber')?.value || undefined
        }
      };

      console.log('Sending request to create user with profile:', request);

      this.authService.createUserWithProfile(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // Use JWT token from backend
          const token = response.token;
          
          // Save authentication data
          this.saveAuthData(response.user, token);
          
          // Redirect to training-info page
          this.router.navigate(['/training-info']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating user with profile:', error);
          this.error = 'Erreur lors de la création du compte. Veuillez vérifier vos informations.';
        },
      });
    }
  }



  /**
   * Save authentication data to localStorage
   * Sauvegarder les données d'authentification dans localStorage
   */
  private saveAuthData(user: any, token: string): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));
  }

  /**
   * Redirects to the login page.
   * Redirige vers la page de connexion.
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Calculates age from date of birth.
   * Calcule l'âge à partir de la date de naissance.
   * @param dateOfBirth - Date de naissance
   * @returns number - Âge calculé
   */
  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Returns the maximum date for date of birth (today).
   * Retourne la date maximale pour la date de naissance (aujourd'hui)
   * @returns string - Date au format YYYY-MM-DD
   */
  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
