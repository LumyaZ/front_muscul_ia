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

/**
 * Signup component for user registration.
 * Composant d'inscription pour l'enregistrement utilisateur.
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
  private router = inject(Router);

  signupForm: FormGroup;
  error: string | null = null;

  constructor() {
    // Création du formulaire réactif avec validation
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
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
   * Soumet le formulaire d'inscription
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: () => {
          // Navigation gérée par AuthService
        },
        error: () => {
          // Gestion d'erreur silencieuse pour l'instant
        },
      });
    }
  }

  /**
   * Redirige vers la page de connexion
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
