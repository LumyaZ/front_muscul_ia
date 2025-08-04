/**
 * Interface representing a user account.
 * Interface représentant un compte utilisateur.

 */
export interface User {

  id?: number;
  
  email: string;
  
  password?: string;
  
  creationDate?: string;
}

/**
 * Interface for user login request.
 * Interface pour la requête de connexion utilisateur.
 */
export interface LoginRequest {

  email: string;
  
  password: string;
}

/**
 * Interface for user registration request.
 * Interface pour la requête d'inscription utilisateur.
 */
export interface RegisterRequest {

  email: string;
  
  password: string;
  
  confirmPassword: string;
}
