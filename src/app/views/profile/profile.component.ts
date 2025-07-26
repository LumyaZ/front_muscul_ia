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

/**
 * Component for displaying and managing user profile information.
 * Composant pour afficher et gérer les informations du profil utilisateur.
 * 
 * This component handles the display and editing of user profile data including
 * personal information, training preferences, and profile management. It provides
 * functionality to view profile details, edit personal information, and manage
 * training preferences through modal dialogs.
 * 
 * Ce composant gère l'affichage et l'édition des données de profil utilisateur
 * incluant les informations personnelles, les préférences d'entraînement et la
 * gestion du profil. Il fournit des fonctionnalités pour voir les détails du
 * profil, éditer les informations personnelles et gérer les préférences
 * d'entraînement via des dialogues modaux.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
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

  /**
   * Current authenticated user data.
   * Données de l'utilisateur actuellement authentifié.
   */
  user: User | null = null;

  /**
   * User profile information including personal details.
   * Informations du profil utilisateur incluant les détails personnels.
   */
  userProfile: UserProfile | null = null;

  /**
   * User training information and preferences.
   * Informations et préférences d'entraînement de l'utilisateur.
   */
  trainingInfo: TrainingInfo | null = null;

  /**
   * Loading state indicator.
   * Indicateur d'état de chargement.
   */
  isLoading = true;

  /**
   * Error message if any operation fails.
   * Message d'erreur si une opération échoue.
   */
  error: string | null = null;

  /**
   * Flag indicating if training edit modal is open.
   * Indicateur indiquant si la modale d'édition d'entraînement est ouverte.
   */
  isModalOpen = false;

  /**
   * Currently selected training category for editing.
   * Catégorie d'entraînement actuellement sélectionnée pour l'édition.
   */
  selectedCategory: TrainingCategory = 'personal';

  /**
   * Flag indicating if profile edit modal is open.
   * Indicateur indiquant si la modale d'édition de profil est ouverte.
   */
  isProfileModalOpen = false;

  /**
   * Display name mappings for gender translations.
   * Mappings des noms d'affichage pour les traductions de genre.
   */
  genderDisplayNames = GenderDisplayNames;

  /**
   * Display name mappings for experience level translations.
   * Mappings des noms d'affichage pour les traductions de niveau d'expérience.
   */
  experienceLevelDisplayNames = ExperienceLevelDisplayNames;

  /**
   * Display name mappings for session frequency translations.
   * Mappings des noms d'affichage pour les traductions de fréquence de sessions.
   */
  sessionFrequencyDisplayNames = SessionFrequencyDisplayNames;

  /**
   * Display name mappings for session duration translations.
   * Mappings des noms d'affichage pour les traductions de durée de sessions.
   */
  sessionDurationDisplayNames = SessionDurationDisplayNames;

  /**
   * Display name mappings for main goal translations.
   * Mappings des noms d'affichage pour les traductions d'objectif principal.
   */
  mainGoalDisplayNames = MainGoalDisplayNames;

  /**
   * Display name mappings for training preference translations.
   * Mappings des noms d'affichage pour les traductions de préférence d'entraînement.
   */
  trainingPreferenceDisplayNames = TrainingPreferenceDisplayNames;

  /**
   * Display name mappings for equipment translations.
   * Mappings des noms d'affichage pour les traductions d'équipement.
   */
  equipmentDisplayNames = EquipmentDisplayNames;

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Hook de cycle de vie appelé après l'initialisation des propriétés liées aux données.
   */
  ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Load user data including profile and training information.
   * Charger les données utilisateur incluant le profil et les informations d'entraînement.
   * 
   * This method checks authentication, loads user profile, and retrieves
   * training preferences. It handles errors gracefully and sets loading states.
   * 
   * Cette méthode vérifie l'authentification, charge le profil utilisateur et
   * récupère les préférences d'entraînement. Elle gère les erreurs gracieusement
   * et définit les états de chargement.
   */
  private loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get current user
    this.user = this.authService.getCurrentUser();

    // Load user profile
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

    // Load training information
    this.trainingInfoService.getTrainingInfo().subscribe({
      next: (trainingInfo: TrainingInfo) => {
        this.trainingInfo = trainingInfo;
        console.log('Informations d\'entraînement chargées:', trainingInfo);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des infos d\'entraînement:', err);
        // Don't show error if no training info
        this.isLoading = false;
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  editTrainingInfo(): void {
    this.router.navigate(['/training-info']);
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
