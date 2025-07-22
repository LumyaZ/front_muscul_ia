import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

/**
 * Login component for user authentication.
 * Composant de connexion pour l'authentification utilisateur.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  error: string | null = null;

  constructor() {
    // Création du formulaire réactif avec validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Soumet le formulaire de connexion
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
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
   * Navigate to signup page
   * Naviguer vers la page d'inscription
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
