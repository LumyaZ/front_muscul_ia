import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../services/auth.service';

/**
 * Signup component for user registration.
 * Composant d'inscription pour l'enregistrement utilisateur.
 */
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  standalone: true
})
export class SignupComponent {
  signupForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    // Création du formulaire réactif avec validation
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  /**
   * Custom validator to check if passwords match
   * Validateur personnalisé pour vérifier la correspondance des mots de passe
   */
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * Submit signup form
   * Soumettre le formulaire d'inscription
   */
  onSubmit(): void {
    if (this.signupForm.invalid) return;
    const request: RegisterRequest = this.signupForm.value;
    this.authService.signup(request).subscribe({
      next: user => {
        // La navigation est gérée par le service
        this.error = null;
      },
      error: err => {
        this.error = 'Signup failed. Please check your data.';
      }
    });
  }

  /**
   * Navigate to login page
   * Naviguer vers la page de connexion
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 