import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { TrainingInfo } from '../../models/training-info.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private trainingInfoService = inject(TrainingInfoService);

  // Données utilisateur
  user: User | null = null;
  userProfile: UserProfile | null = null;
  trainingInfo: TrainingInfo | null = null;

  // États de chargement
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    // Vérifier l'authentification
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Récupérer l'utilisateur connecté
    this.user = this.authService.getCurrentUser();

    // Charger le profil utilisateur
    this.userProfileService.getMyProfile().subscribe({
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        console.log('Profil utilisateur chargé:', profile);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du profil:', err);
        this.error = 'Erreur lors du chargement du profil utilisateur';
      }
    });

    // Charger les informations d'entraînement
    this.trainingInfoService.getTrainingInfo().subscribe({
      next: (trainingInfo: TrainingInfo) => {
        this.trainingInfo = trainingInfo;
        console.log('Informations d\'entraînement chargées:', trainingInfo);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des infos d\'entraînement:', err);
        // Ne pas afficher d'erreur si pas d'infos d'entraînement
        this.isLoading = false;
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  editProfile(): void {
    // TODO: Navigation vers la page d'édition du profil
    console.log('Édition du profil');
  }

  editTrainingInfo(): void {
    this.router.navigate(['/training-info']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
