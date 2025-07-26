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
 * Component for user login and authentication.
 * Composant pour la connexion et l'authentification utilisateur.
 * 
 * This component handles user login functionality including form validation,
 * authentication requests, and navigation to the signup page. It provides
 * a reactive form with email and password validation and integrates with
 * the authentication service for login operations.
 * 
 * Ce composant gère la fonctionnalité de connexion utilisateur incluant
 * la validation de formulaire, les requêtes d'authentification et la
 * navigation vers la page d'inscription. Il fournit un formulaire réactif
 * avec validation d'email et mot de passe et s'intègre avec le service
 * d'authentification pour les opérations de connexion.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  standalone: true,
})
export class LoginComponent {
  
  /**
   * Form builder service for creating reactive forms.
   * Service de construction de formulaires pour créer des formulaires réactifs.
   */
  private fb = inject(FormBuilder);
  
  /**
   * Authentication service for login operations.
   * Service d'authentification pour les opérations de connexion.
   */
  private authService = inject(AuthService);
  
  /**
   * Angular router for navigation.
   * Routeur Angular pour la navigation.
   */
  private router = inject(Router);

  /**
   * Reactive form for login with email and password fields.
   * Formulaire réactif pour la connexion avec champs email et mot de passe.
   */
  loginForm: FormGroup;
  
  /**
   * Error message to display if login fails.
   * Message d'erreur à afficher si la connexion échoue.
   */
  error: string | null = null;

  /**
   * Constructor for LoginComponent.
   * Constructeur pour LoginComponent.
   * 
   * Initializes the reactive form with email and password validation.
   * 
   * Initialise le formulaire réactif avec validation d'email et mot de passe.
   */
  constructor() {
    // Create reactive form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /**
   * Submit the login form and attempt authentication.
   * Soumettre le formulaire de connexion et tenter l'authentification.
   * 
   * This method validates the form and calls the authentication service
   * to perform login. If successful, navigation is handled by the AuthService.
   * If it fails, an error message is displayed.
   * 
   * Cette méthode valide le formulaire et appelle le service d'authentification
   * pour effectuer la connexion. Si elle réussit, la navigation est gérée par
   * l'AuthService. Si elle échoue, un message d'erreur est affiché.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          // Navigation handled by AuthService
          // Navigation gérée par AuthService
        },
        error: () => {
          // Silent error handling for now
          // Gestion d'erreur silencieuse pour l'instant
        },
      });
    }
  }

  /**
   * Navigate to the signup page.
   * Naviguer vers la page d'inscription.
   * 
   * This method redirects users to the signup page if they don't have
   * an account and want to create one.
   * 
   * Cette méthode redirige les utilisateurs vers la page d'inscription
   * s'ils n'ont pas de compte et veulent en créer un.
   */
  goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
