/**
 * Interface representing a user profile.
 * Interface représentant un profil utilisateur.
 * 
 * This interface defines the structure of a user profile containing
 * personal information such as name, date of birth, age, and contact
 * details. All properties are optional to accommodate partial data
 * scenarios.
 * 
 * Cette interface définit la structure d'un profil utilisateur contenant
 * des informations personnelles telles que le nom, la date de naissance,
 * l'âge et les coordonnées. Toutes les propriétés sont optionnelles pour
 * accommoder les scénarios de données partielles.
 */
export interface UserProfile {
  /**
   * Unique identifier for the user profile.
   * Identifiant unique pour le profil utilisateur.
   */
  id?: number;
  
  /**
   * ID of the associated user account.
   * ID du compte utilisateur associé.
   */
  userId?: number;
  
  /**
   * User's first name.
   * Prénom de l'utilisateur.
   */
  firstName?: string;
  
  /**
   * User's last name.
   * Nom de famille de l'utilisateur.
   */
  lastName?: string;
  
  /**
   * User's date of birth in ISO string format.
   * Date de naissance de l'utilisateur au format chaîne ISO.
   */
  dateOfBirth?: string;
  
  /**
   * Calculated age of the user in years.
   * Âge calculé de l'utilisateur en années.
   */
  age?: number;
  
  /**
   * User's phone number.
   * Numéro de téléphone de l'utilisateur.
   */
  phoneNumber?: string;
  
  /**
   * Creation timestamp of the profile.
   * Horodatage de création du profil.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the profile.
   * Horodatage de dernière mise à jour du profil.
   */
  updatedAt?: string;
}

/**
 * Interface for creating a new user profile.
 * Interface pour créer un nouveau profil utilisateur.
 * 
 * This interface defines the required data structure for creating
 * a new user profile. It contains all the necessary information
 * to establish a user's profile.
 * 
 * Cette interface définit la structure de données requise pour créer
 * un nouveau profil utilisateur. Elle contient toutes les informations
 * nécessaires pour établir le profil d'un utilisateur.
 */
export interface CreateUserProfileRequest {
  /**
   * User's first name (required).
   * Prénom de l'utilisateur (requis).
   */
  firstName: string;
  
  /**
   * User's last name (required).
   * Nom de famille de l'utilisateur (requis).
   */
  lastName: string;
  
  /**
   * User's date of birth in ISO string format (required).
   * Date de naissance de l'utilisateur au format chaîne ISO (requis).
   */
  dateOfBirth: string;
  
  /**
   * User's phone number (optional).
   * Numéro de téléphone de l'utilisateur (optionnel).
   */
  phoneNumber?: string;
}

/**
 * Interface for updating an existing user profile.
 * Interface pour mettre à jour un profil utilisateur existant.
 * 
 * This interface defines the data structure for updating a user profile.
 * All properties are optional to allow partial updates of profile information.
 * 
 * Cette interface définit la structure de données pour mettre à jour
 * un profil utilisateur. Toutes les propriétés sont optionnelles pour
 * permettre des mises à jour partielles des informations de profil.
 */
export interface UpdateUserProfileRequest {
  /**
   * User's first name (optional for updates).
   * Prénom de l'utilisateur (optionnel pour les mises à jour).
   */
  firstName?: string;
  
  /**
   * User's last name (optional for updates).
   * Nom de famille de l'utilisateur (optionnel pour les mises à jour).
   */
  lastName?: string;
  
  /**
   * User's date of birth in ISO string format (optional for updates).
   * Date de naissance de l'utilisateur au format chaîne ISO (optionnel pour les mises à jour).
   */
  dateOfBirth?: string;
  
  /**
   * User's phone number (optional for updates).
   * Numéro de téléphone de l'utilisateur (optionnel pour les mises à jour).
   */
  phoneNumber?: string;
}

/**
 * Interface for creating a user account with profile in a single request.
 * Interface pour créer un compte utilisateur avec profil en une seule requête.
 * 
 * This interface combines user account creation data with profile creation
 * data to allow creating both the user account and profile simultaneously.
 * 
 * Cette interface combine les données de création de compte utilisateur
 * avec les données de création de profil pour permettre de créer à la fois
 * le compte utilisateur et le profil simultanément.
 */
export interface CreateUserWithProfileRequest {
  /**
   * User account creation data.
   * Données de création du compte utilisateur.
   */
  userData: {
    /**
     * User's email address.
     * Adresse email de l'utilisateur.
     */
    email: string;
    
    /**
     * User's password.
     * Mot de passe de l'utilisateur.
     */
    password: string;
    
    /**
     * Password confirmation for validation.
     * Confirmation du mot de passe pour validation.
     */
    confirmPassword: string;
  };
  
  /**
   * Profile creation data.
   * Données de création du profil.
   */
  profileData: CreateUserProfileRequest;
}

/**
 * Interface for the response when creating a user with profile.
 * Interface pour la réponse lors de la création d'un utilisateur avec profil.
 * 
 * This interface defines the structure of the response returned when
 * successfully creating a user account with an associated profile.
 * 
 * Cette interface définit la structure de la réponse retournée lors
 * de la création réussie d'un compte utilisateur avec un profil associé.
 */
export interface CreateUserWithProfileResponse {
  /**
   * Created user account information.
   * Informations du compte utilisateur créé.
   */
  user: {
    /**
     * Unique identifier for the user account.
     * Identifiant unique pour le compte utilisateur.
     */
    id: number;
    
    /**
     * User's email address.
     * Adresse email de l'utilisateur.
     */
    email: string;
    
    /**
     * Account creation timestamp.
     * Horodatage de création du compte.
     */
    creationDate: string;
  };
  
  /**
   * Created user profile information.
   * Informations du profil utilisateur créé.
   */
  profile: UserProfile;
} 