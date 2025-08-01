import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserProfileService } from '../../services/user-profile.service';
import { TrainingInfoService } from '../../services/training-info.service';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { 
  TrainingInfo, 
  Gender, 
  ExperienceLevel, 
  SessionFrequency, 
  SessionDuration, 
  MainGoal, 
  TrainingPreference, 
  Equipment,
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
 * Component for user profile display and management.
 * Composant pour l'affichage et la gestion du profil utilisateur.
 * 
 * This component provides a comprehensive view of user profile information
 * including personal details and training preferences. It allows users to
 * view and edit their profile information through modal dialogs.
 * 
 * Ce composant fournit une vue complète des informations de profil utilisateur
 * incluant les détails personnels et les préférences d'entraînement. Il permet
 * aux utilisateurs de visualiser et modifier leurs informations de profil via
 * des dialogues modaux.
 * 
 * @author Muscul IA Team
 * @version 1.0
 * @since 2024-01-01
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, TrainingEditModalComponent, ProfileEditModalComponent]
})
export class ProfileComponent implements OnInit {

  userProfile: UserProfile | null = null;
  trainingInfo: TrainingInfo | null = null;
  isLoading = false;
  error: string | null = null;
  isModalOpen = false;
  isProfileModalOpen = false;
  selectedCategory: TrainingCategory = 'personal';
  currentUser: any = null;
  authToken: string | null = null;

  private authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private trainingInfoService = inject(TrainingInfoService);
  private router = inject(Router);

  genderDisplayNames = GenderDisplayNames;
  experienceLevelDisplayNames = ExperienceLevelDisplayNames;
  sessionFrequencyDisplayNames = SessionFrequencyDisplayNames;
  sessionDurationDisplayNames = SessionDurationDisplayNames;
  mainGoalDisplayNames = MainGoalDisplayNames;
  trainingPreferenceDisplayNames = TrainingPreferenceDisplayNames;
  equipmentDisplayNames = EquipmentDisplayNames;

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadUserData();
  }

  /**
   * Loads the current user from localStorage
   * Charge l'utilisateur actuel depuis localStorage
   */
  private loadCurrentUser(): void {
    this.authToken = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Loads user profile and training information
   * Charge le profil utilisateur et les informations d'entraînement
   */
  private loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    this.loadUserProfile();
    this.loadTrainingInfo();
  }

  /**
   * Loads user profile data
   * Charge les données du profil utilisateur
   */
  private loadUserProfile(): void {
    this.userProfileService.getMyProfile().subscribe({
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        this.handleError(err);
      }
    });
  }

  /**
   * Loads training information data
   * Charge les données d'informations d'entraînement
   */
  private loadTrainingInfo(): void {
    this.trainingInfoService.getTrainingInfo().subscribe({
      next: (trainingInfo: TrainingInfo) => {
        this.trainingInfo = trainingInfo;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        this.handleError(err);
      }
    });
  }

  /**
   * Checks if all data loading is complete
   * Vérifie si le chargement de toutes les données est terminé
   */
  private checkLoadingComplete(): void {
    // Stop loading if both profile and training info have been processed (even if null)
    // Arrêter le chargement si le profil et les infos d'entraînement ont été traités (même si null)
    // Since this method is called after each request completes, we can stop loading
    // Puisque cette méthode est appelée après chaque requête terminée, on peut arrêter le loading
    this.isLoading = false;
  }

  /**
   * Centralized error handling
   * Gestion centralisée des erreurs
   * @param error - Error object / Objet d'erreur
   */
  private handleError(error: any): void {
    this.isLoading = false;
    
    if (error.status === 401) {
      this.error = 'Session expirée. Veuillez vous reconnecter.';
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      this.error = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
    } else if (error.status === 404) {
      this.error = 'Données non trouvées.';
    } else if (error.status === 422) {
      this.error = 'Données invalides. Veuillez vérifier vos informations.';
    } else if (error.status === 0) {
      this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
    } else {
      this.error = error.error?.message || 'Une erreur est survenue lors du chargement des données.';
    }
  }

  /**
   * Navigates back to dashboard
   * Navigue vers le tableau de bord
   */
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Opens training information edit modal
   * Ouvre la modale d'édition des informations d'entraînement
   */
  editTrainingInfo(): void {
    this.isModalOpen = true;
  }

  /**
   * Opens profile edit modal
   * Ouvre la modale d'édition du profil
   */
  editProfile(): void {
    this.isProfileModalOpen = true;
  }

  /**
   * Closes training information edit modal
   * Ferme la modale d'édition des informations d'entraînement
   */
  closeTrainingModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Closes profile edit modal
   * Ferme la modale d'édition du profil
   */
  closeProfileModal(): void {
    this.isProfileModalOpen = false;
  }

  /**
   * Handles training information update
   * Gère la mise à jour des informations d'entraînement
   * @param updatedTrainingInfo - Updated training information / Informations d'entraînement mises à jour
   */
  onTrainingUpdated(updatedTrainingInfo: TrainingInfo): void {
    this.trainingInfo = updatedTrainingInfo;
    this.isModalOpen = false;
    this.error = null;  
  }

  /**
   * Handles profile update
   * Gère la mise à jour du profil
   * @param updatedProfile - Updated profile information / Informations de profil mises à jour
   */
  onProfileUpdated(updatedProfile: UserProfile): void {
    this.userProfile = updatedProfile;
    this.isProfileModalOpen = false;
    this.error = null; 
  }



  /**
   * Gets display name for enum values
   * Obtient le nom d'affichage pour les valeurs d'énumération
   * @param value - Enum value / Valeur d'énumération
   * @param displayNames - Display names mapping / Mappage des noms d'affichage
   * @returns string - Display name / Nom d'affichage
   */
  getDisplayName(value: string | undefined, displayNames: Record<string, string>): string {
    if (!value) return 'Non défini';
    return displayNames[value] || value;
  }

  /**
   * Checks if user has complete profile
   * Vérifie si l'utilisateur a un profil complet
   * @returns boolean - True if profile is complete / True si le profil est complet
   */
  hasCompleteProfile(): boolean {
    return !!(this.userProfile && this.trainingInfo);
  }

  /**
   * Gets profile completion percentage
   * Obtient le pourcentage de completion du profil
   * @returns number - Completion percentage / Pourcentage de completion
   */
  getProfileCompletionPercentage(): number {
    const total = 2;
    let completed = 0;

    if (this.userProfile) completed++;
    if (this.trainingInfo) completed++;

    return Math.round((completed / total) * 100);
  }

  /**
   * Clears error message when user starts interacting
   * Efface le message d'erreur quand l'utilisateur commence à interagir
   */
  clearError(): void {
    if (this.error) {
      this.error = null;
    }
  }
}
