import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { TrainingInfo, 
  GenderDisplayNames,
  ExperienceLevelDisplayNames,
  SessionFrequencyDisplayNames,
  SessionDurationDisplayNames,
  MainGoalDisplayNames,
  TrainingPreferenceDisplayNames,
  EquipmentDisplayNames
} from '../../models/training-info.model';
import { TrainingEditModalComponent, TrainingCategory } from '../../components/training-edit-modal/training-edit-modal.component';
import { ProfileEditModalComponent } from '../../components/profile-edit-modal/profile-edit-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TrainingEditModalComponent, ProfileEditModalComponent],
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

  // Modal states
  isModalOpen = false;
  selectedCategory: TrainingCategory = 'personal';
  isProfileModalOpen = false;

  // Display name mappings for translations
  genderDisplayNames = GenderDisplayNames;
  experienceLevelDisplayNames = ExperienceLevelDisplayNames;
  sessionFrequencyDisplayNames = SessionFrequencyDisplayNames;
  sessionDurationDisplayNames = SessionDurationDisplayNames;
  mainGoalDisplayNames = MainGoalDisplayNames;
  trainingPreferenceDisplayNames = TrainingPreferenceDisplayNames;
  equipmentDisplayNames = EquipmentDisplayNames;

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
    console.log('Opening profile edit modal');
    this.isProfileModalOpen = true;
  }

  /**
   * Edit a specific training category.
   * Modifier une catégorie d'entraînement spécifique.
   *
   * @param category - Catégorie à modifier ('personal', 'experience', 'goals', 'equipment')
   */
  editTrainingCategory(category: TrainingCategory): void {
    console.log('Opening modal for category:', category);
    console.log('Current training info:', this.trainingInfo);
    this.selectedCategory = category;
    this.isModalOpen = true;
  }

  /**
   * Close training edit modal.
   * Fermer la modale d'édition d'entraînement.
   */
  closeTrainingModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Handle training info update.
   * Gérer la mise à jour des informations d'entraînement.
   *
   * @param updatedTrainingInfo - Informations d'entraînement mises à jour
   */
  onTrainingUpdated(updatedTrainingInfo: TrainingInfo): void {
    this.trainingInfo = updatedTrainingInfo;
    this.isModalOpen = false;
  }

  /**
   * Close profile edit modal.
   * Fermer la modale d'édition du profil.
   */
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  /**
   * Handle profile update.
   * Gérer la mise à jour du profil.
   *
   * @param updatedProfile - Profil mis à jour
   */
  onProfileUpdated(updatedProfile: UserProfile): void {
    this.userProfile = updatedProfile;
    this.isProfileModalOpen = false;
  }

  /**
   * Get display name for enum values.
   * Obtenir le nom d'affichage pour les valeurs enum.
   *
   * @param enumValue - Valeur enum
   * @param displayNames - Mapping des noms d'affichage
   * @returns string - Nom traduit
   */
  getDisplayName(enumValue: string | undefined, displayNames: Record<string, string>): string {
    if (!enumValue) return '';
    return displayNames[enumValue] || enumValue;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
