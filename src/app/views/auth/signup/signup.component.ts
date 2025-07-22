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
 * Signup component for user registration with profile information.
 * Composant d'inscription pour l'enregistrement utilisateur avec informations de profil.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  standalone: true,
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  signupForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor() {
    // Création du formulaire réactif avec validation
    this.signupForm = this.fb.group({
      // Champs d'authentification
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      
      // Champs du profil utilisateur
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern(/^(\+33|0)[1-9](\d{8})$/)]],
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validateur personnalisé pour vérifier que les mots de passe correspondent
   * @param control - Contrôle du formulaire
   * @returns object | null - Erreur ou null si valide
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
   * Validateur pour vérifier que la date de naissance n'est pas dans le futur
   * @param control - Contrôle du formulaire
   * @returns object | null - Erreur ou null si valide
   */
  dateOfBirthValidator(control: AbstractControl): Record<string, boolean> | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      
      if (selectedDate > today) {
        return { futureDate: true };
      }
      
      // Vérifier que l'utilisateur a au moins 13 ans
      const minAge = new Date();
      minAge.setFullYear(today.getFullYear() - 13);
      
      if (selectedDate > minAge) {
        return { tooYoung: true };
      }
    }
    return null;
  }

  /**
   * Soumet le formulaire d'inscription
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.error = null;

      // Préparer les données pour l'endpoint combiné
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
          console.log('User and profile created successfully:', response);
          
          // Générer un token simple (en production, le back devrait le fournir)
          const token = this.generateToken();
          
          // Sauvegarder les données d'authentification
          this.saveAuthData(response.user, token);
          
          // Rediriger vers la page training-info
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
   * Generate a simple token (in production, this should come from the backend)
   * Générer un token simple (en production, cela devrait venir du backend)
   */
  private generateToken(): string {
    return (
      'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
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
   * Redirige vers la page de connexion
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Calcule l'âge à partir de la date de naissance
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
   * Retourne la date maximale pour la date de naissance (aujourd'hui)
   * @returns string - Date au format YYYY-MM-DD
   */
  getMaxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
