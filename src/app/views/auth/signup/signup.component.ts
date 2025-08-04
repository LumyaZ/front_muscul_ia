import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CreateUserWithProfileRequest, CreateUserWithProfileResponse } from '../../../models/user-profile.model';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class SignupComponent {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm: FormGroup;
  error: string | null = null;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(12),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)]],
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Vérifie si un champ du formulaire est invalide et a été touché
   * Check if a form field is invalid and has been touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Validateur personnalisé pour s'assurer que le mot de passe et sa confirmation correspondent
   * Custom validator to ensure password and confirm password match
   */
  passwordMatchValidator(control: AbstractControl): Record<string, boolean> | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Bascule la visibilité du mot de passe
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Bascule la visibilité de la confirmation du mot de passe
   * Toggle confirm password visibility
   */
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  /**
   * Retourne le message d'erreur pour le mot de passe
   * Returns the error message for password
   */
  getPasswordErrorMessage(): string {
    const passwordControl = this.signupForm.get('password');
    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) {
        return 'Le mot de passe est requis.';
      }
      if (passwordControl.errors['minlength']) {
        return 'Le mot de passe doit contenir au moins 12 caractères.';
      }
      if (passwordControl.errors['pattern']) {
        return 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial.';
      }
    }
    return '';
  }

  /**
   * Calcule la force du mot de passe
   * Calculate password strength
   */
  getPasswordStrength(): PasswordStrength {
    const password = this.signupForm.get('password')?.value || '';
    let score = 0;

    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const strengths = [
      { score: 0, label: 'Très faible', color: '#ff4444' },
      { score: 1, label: 'Faible', color: '#ff8800' },
      { score: 2, label: 'Moyen', color: '#ffaa00' },
      { score: 3, label: 'Bon', color: '#88cc00' },
      { score: 4, label: 'Très bon', color: '#44cc44' },
      { score: 5, label: 'Excellent', color: '#00cc00' }
    ];

    return strengths.find(s => s.score === score) || strengths[0];
  }

  /**
   * Vérifie si le mot de passe a la longueur minimale
   * Check if password has minimum length
   */
  hasMinLength(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return password.length >= 12;
  }

  /**
   * Vérifie si le mot de passe contient une minuscule
   * Check if password contains lowercase
   */
  hasLowercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  /**
   * Vérifie si le mot de passe contient une majuscule
   * Check if password contains uppercase
   */
  hasUppercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  /**
   * Vérifie si le mot de passe contient un chiffre
   * Check if password contains number
   */
  hasNumber(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  /**
   * Vérifie si le mot de passe contient un caractère spécial
   * Check if password contains special character
   */
  hasSpecialChar(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[@$!%*?&]/.test(password);
  }

  /**
   * Soumet le formulaire d'inscription
   * Submit signup form
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.error = null;

      const request: CreateUserWithProfileRequest = {
        userData: {
          email: this.signupForm.get('email')?.value,
          password: this.signupForm.get('password')?.value,
          confirmPassword: this.signupForm.get('confirmPassword')?.value,
        },
        profileData: {
          firstName: this.signupForm.get('firstName')?.value,
          lastName: this.signupForm.get('lastName')?.value,
          dateOfBirth: this.signupForm.get('dateOfBirth')?.value,
          phoneNumber: this.signupForm.get('phoneNumber')?.value,
        },
      };

      this.authService.createUserWithProfile(request).subscribe({
        next: (response: CreateUserWithProfileResponse) => {
          this.isLoading = false;
          // Les données d'authentification sont maintenant sauvegardées automatiquement par le service
          this.router.navigate(['/training-info']);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.handleError(error);
        },
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  /**
   * Gère les erreurs de manière centralisée
   * Handle errors in a centralized way
   */
  private handleError(error: any): void {
    if (error.status === 409) {
      this.error = 'Un compte avec cet email existe déjà.';
    } else if (error.status === 400) {
      this.error = 'Veuillez vérifier les informations saisies.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = 'Une erreur est survenue lors de la création du compte. Veuillez réessayer.';
    }
  }

  /**
   * Marque tous les champs comme touchés pour afficher les erreurs
   * Mark all fields as touched to display errors
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Navigue vers la page de connexion
   * Navigate to login page
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Retourne la date maximale pour l'âge (aujourd'hui)
   * Returns the maximum date for age (today)
   */
  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Efface le message d'erreur quand l'utilisateur commence à taper
   * Clear error message when user starts typing
   */
  onFieldChange(): void {
    if (this.error) {
      this.error = null;
    }
  }
}
