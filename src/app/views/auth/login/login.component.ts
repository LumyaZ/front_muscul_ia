import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  error: string | null = null;
  isLoading = false;
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Vérifie si un champ du formulaire est invalide et a été touché
   * Check if a form field is invalid and has been touched
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  /**
   * Bascule la visibilité du mot de passe
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Soumet le formulaire de connexion
   * Submit the login form
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          
          if (error.status === 401) {
            this.error = 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
          } else {
            this.error = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
          }
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  /**
   * Navigue vers la page d'inscription
   * Navigate to signup page
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
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