import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';

/**
 * Login component for user authentication.
 * Composant de connexion pour l'authentification utilisateur.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [AuthService],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    // Création du formulaire réactif avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Submit login form
   * Soumettre le formulaire de connexion
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const request: LoginRequest = this.loginForm.value;
    this.authService.login(request).subscribe({
      next: user => {
        // La navigation est gérée par le service
        this.error = null;
      },
      error: err => {
        this.error = 'Login failed. Please check your credentials.';
      }
    });
  }

  /**
   * Navigate to signup page
   * Naviguer vers la page d'inscription
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
} 