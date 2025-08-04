/**
 * Enumeration for user gender options.
 * Énumération pour les options de genre utilisateur.
 */
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

/**
 * Enumeration for user experience levels in fitness training.
 * Énumération pour les niveaux d'expérience utilisateur en entraînement fitness.
 */
export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

/**
 * Enumeration for training session frequency preferences.
 * Énumération pour les préférences de fréquence des sessions d'entraînement.
 */
export enum SessionFrequency {
  ONE_TO_TWO = 'ONE_TO_TWO',
  THREE_TO_FOUR = 'THREE_TO_FOUR',
  FIVE_TO_SIX = 'FIVE_TO_SIX',
  DAILY = 'DAILY'
}

/**
 * Enumeration for training session duration preferences.
 * Énumération pour les préférences de durée des sessions d'entraînement.
 */
export enum SessionDuration {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG',
  EXTENDED = 'EXTENDED'
}

/**
 * Enumeration for main fitness goals.
 * Énumération pour les objectifs fitness principaux.
 */
export enum MainGoal {
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  TONING = 'TONING',
  GENERAL_FITNESS = 'GENERAL_FITNESS'
}

/**
 * Enumeration for training preference types.
 * Énumération pour les types de préférences d'entraînement.
 */
export enum TrainingPreference {
  CARDIO = 'CARDIO',
  STRENGTH_TRAINING = 'STRENGTH_TRAINING',
  FUNCTIONAL = 'FUNCTIONAL',
  FLEXIBILITY = 'FLEXIBILITY',
  SPORTS = 'SPORTS',
  MIXED = 'MIXED'
}

/**
 * Enumeration for available equipment levels.
 * Énumération pour les niveaux d'équipement disponibles.
 */
export enum Equipment {
  NONE = 'NONE',
  BASIC = 'BASIC',
  HOME_GYM = 'HOME_GYM',
  GYM_ACCESS = 'GYM_ACCESS',
  FULL_EQUIPMENT = 'FULL_EQUIPMENT'
}

/**
 * Interface representing training information for a user.
 * Interface représentant les informations d'entraînement d'un utilisateur.
 */
export interface TrainingInfo {

  id?: number;
  
  userId?: number;

  gender?: string;

  weight?: number;

  height?: number;

  bodyFatPercentage?: number;

  experienceLevel?: string;
  
  sessionFrequency?: string;
  
  sessionDuration?: string;
  
  mainGoal?: string;
  
  trainingPreference?: string;
  
  equipment?: string;
  
  bmi?: number;
  
  createdAt?: string;
  
  updatedAt?: string;
}

/**
 * Interface for creating new training information.
 * Interface pour créer de nouvelles informations d'entraînement.
 */
export interface CreateTrainingInfoRequest {

  gender: string;

  weight: number;
  
  height: number;
  
  bodyFatPercentage?: number;
  
  experienceLevel: string;
  
  sessionFrequency: string;
  
  sessionDuration: string;
  
  mainGoal: string;
  
  trainingPreference: string;
  
  equipment: string;
}

/**
 * Interface for updating existing training information.
 * Interface pour mettre à jour des informations d'entraînement existantes.

 */
export interface UpdateTrainingInfoRequest {

  gender?: string;
  
  weight?: number;
  
  height?: number;
  
  bodyFatPercentage?: number;
  
  experienceLevel?: string;
  
  sessionFrequency?: string;
  
  sessionDuration?: string;
  
  mainGoal?: string;
  
  trainingPreference?: string;
  
  equipment?: string;
}

/**
 * Mapping of gender enum values to French display names.
 * Mapping des valeurs d'énumération de genre vers les noms d'affichage français.
 */
export const GenderDisplayNames: Record<Gender, string> = {
  [Gender.MALE]: 'Homme',
  [Gender.FEMALE]: 'Femme',
  [Gender.OTHER]: 'Autre'
};

/**
 * Mapping of experience level enum values to French display names.
 * Mapping des valeurs d'énumération de niveau d'expérience vers les noms d'affichage français.
 */
export const ExperienceLevelDisplayNames: Record<ExperienceLevel, string> = {
  [ExperienceLevel.BEGINNER]: 'Débutant',
  [ExperienceLevel.INTERMEDIATE]: 'Intermédiaire',
  [ExperienceLevel.ADVANCED]: 'Avancé',
  [ExperienceLevel.EXPERT]: 'Expert'
};

/**
 * Mapping of session frequency enum values to French display names.
 * Mapping des valeurs d'énumération de fréquence de session vers les noms d'affichage français.
 */
export const SessionFrequencyDisplayNames: Record<SessionFrequency, string> = {
  [SessionFrequency.ONE_TO_TWO]: '1-2 fois',
  [SessionFrequency.THREE_TO_FOUR]: '3-4 fois',
  [SessionFrequency.FIVE_TO_SIX]: '5-6 fois',
  [SessionFrequency.DAILY]: 'Quotidien'
};

/**
 * Mapping of session duration enum values to French display names.
 * Mapping des valeurs d'énumération de durée de session vers les noms d'affichage français.
 */
export const SessionDurationDisplayNames: Record<SessionDuration, string> = {
  [SessionDuration.SHORT]: 'Court (30-45 min)',
  [SessionDuration.MEDIUM]: 'Moyen (45-60 min)',
  [SessionDuration.LONG]: 'Long (60-90 min)',
  [SessionDuration.EXTENDED]: 'Étendu (90+ min)'
};

/**
 * Mapping of main goal enum values to French display names.
 * Mapping des valeurs d'énumération d'objectif principal vers les noms d'affichage français.
 */
export const MainGoalDisplayNames: Record<MainGoal, string> = {
  [MainGoal.WEIGHT_LOSS]: 'Perte de poids',
  [MainGoal.MUSCLE_GAIN]: 'Prise de masse',
  [MainGoal.STRENGTH]: 'Force',
  [MainGoal.ENDURANCE]: 'Endurance',
  [MainGoal.TONING]: 'Tonification',
  [MainGoal.GENERAL_FITNESS]: 'Forme générale'
};

/**
 * Mapping of training preference enum values to French display names.
 * Mapping des valeurs d'énumération de préférence d'entraînement vers les noms d'affichage français.
 */
export const TrainingPreferenceDisplayNames: Record<TrainingPreference, string> = {
  [TrainingPreference.CARDIO]: 'Cardio',
  [TrainingPreference.STRENGTH_TRAINING]: 'Musculation',
  [TrainingPreference.FUNCTIONAL]: 'Fonctionnel',
  [TrainingPreference.FLEXIBILITY]: 'Flexibilité',
  [TrainingPreference.SPORTS]: 'Sports',
  [TrainingPreference.MIXED]: 'Mixte'
};

/**
 * Mapping of equipment enum values to French display names.
 * Mapping des valeurs d'énumération d'équipement vers les noms d'affichage français.
 */
export const EquipmentDisplayNames: Record<Equipment, string> = {
  [Equipment.NONE]: 'Aucun',
  [Equipment.BASIC]: 'Basique',
  [Equipment.HOME_GYM]: 'Salle à domicile',
  [Equipment.GYM_ACCESS]: 'Accès salle',
  [Equipment.FULL_EQUIPMENT]: 'Équipement complet'
}; 