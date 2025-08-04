/**
 * Interface representing a user profile.
 * Interface représentant un profil utilisateur.
 */
export interface UserProfile {

  id?: number;
  
  userId?: number;
  
  firstName?: string;
  
  lastName?: string;
  
  fullName?: string;
  
  dateOfBirth?: string;
  
  age?: number;
  
  phoneNumber?: string;
  
  createdAt?: string;
  
  updatedAt?: string;
}

/**
 * Interface for creating a new user profile.
 * Interface pour créer un nouveau profil utilisateur.
 */
export interface CreateUserProfileRequest {

  firstName: string;
  
  lastName: string;
  
  dateOfBirth: string;
  
  phoneNumber?: string;
}

/**
 * Interface for updating an existing user profile.
 * Interface pour mettre à jour un profil utilisateur existant.
 */
export interface UpdateUserProfileRequest {

  firstName?: string;
  
  lastName?: string;
  
  dateOfBirth?: string;
  
  phoneNumber?: string;
}

/**
 * Interface for creating a user account with profile in a single request.
 * Interface pour créer un compte utilisateur avec profil en une seule requête.
 */
export interface CreateUserWithProfileRequest {

  userData: {

    email: string;
    
    password: string;
    
    confirmPassword: string;
  };
  

  profileData: {

    firstName: string;

    lastName: string;
  
    dateOfBirth: string;
    
    phoneNumber?: string;
  };
}

/**
 * Interface for the response when creating a user with profile.
 * Interface pour la réponse lors de la création d'un utilisateur avec profil.
 */
export interface CreateUserWithProfileResponse {

  user: {

    id: number;

    email: string;

    creationDate: string;
  };
  
  profile: UserProfile;
  
  token: string;
}

/**
 * Interface for creating a user profile with email.
 * Interface pour créer un profil utilisateur avec email.
 */
export interface CreateUserProfileWithEmailRequest {

  email: string;
  
  firstName: string;
  
  lastName: string;
  
  dateOfBirth: string;

  age: number;
  
  phoneNumber?: string;
} 