/**
 * Interface representing a user account.
 * Interface représentant un compte utilisateur.
 * 
 * This interface defines the structure of a user account containing
 * basic authentication and identification information. The password
 * field is optional to accommodate scenarios where the password
 * should not be included in responses.
 * 
 * Cette interface définit la structure d'un compte utilisateur contenant
 * des informations d'authentification et d'identification de base. Le champ
 * password est optionnel pour accommoder les scénarios où le mot de passe
 * ne doit pas être inclus dans les réponses.
 */
export interface User {
  /**
   * Unique identifier for the user account.
   * Identifiant unique pour le compte utilisateur.
   */
  id?: number;
  
  /**
   * User's email address (required for authentication).
   * Adresse email de l'utilisateur (requis pour l'authentification).
   */
  email: string;
  
  /**
   * User's password (optional, not included in responses).
   * Mot de passe de l'utilisateur (optionnel, non inclus dans les réponses).
   */
  password?: string;
  
  /**
   * Account creation timestamp.
   * Horodatage de création du compte.
   */
  creationDate?: string;
}
