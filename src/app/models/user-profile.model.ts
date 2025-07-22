export interface UserProfile {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  age?: number;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
}

export interface CreateUserWithProfileRequest {
  userData: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  profileData: CreateUserProfileRequest;
}

export interface CreateUserWithProfileResponse {
  user: {
    id: number;
    email: string;
    creationDate: string;
  };
  profile: UserProfile;
} 