/**
 * Enumeration for user gender options.
 * Énumération pour les options de genre utilisateur.
 * 
 * This enum defines the possible gender values that can be assigned
 * to a user's training information.
 * 
 * Cette énumération définit les valeurs de genre possibles qui peuvent
 * être assignées aux informations d'entraînement d'un utilisateur.
 */
export enum Gender {
  /** Male gender */
  MALE = 'MALE',
  /** Female gender */
  FEMALE = 'FEMALE',
  /** Other gender or non-binary */
  OTHER = 'OTHER'
}

/**
 * Enumeration for user experience levels in fitness training.
 * Énumération pour les niveaux d'expérience utilisateur en entraînement fitness.
 * 
 * This enum defines the different experience levels that can be assigned
 * to a user's training information, from beginner to expert.
 * 
 * Cette énumération définit les différents niveaux d'expérience qui peuvent
 * être assignés aux informations d'entraînement d'un utilisateur, du débutant
 * à l'expert.
 */
export enum ExperienceLevel {
  /** Beginner level - new to fitness training */
  BEGINNER = 'BEGINNER',
  /** Intermediate level - some experience with fitness training */
  INTERMEDIATE = 'INTERMEDIATE',
  /** Advanced level - significant experience with fitness training */
  ADVANCED = 'ADVANCED',
  /** Expert level - extensive experience with fitness training */
  EXPERT = 'EXPERT'
}

/**
 * Enumeration for training session frequency preferences.
 * Énumération pour les préférences de fréquence des sessions d'entraînement.
 * 
 * This enum defines how often a user prefers to train, from once or twice
 * a week to daily training sessions.
 * 
 * Cette énumération définit à quelle fréquence un utilisateur préfère
 * s'entraîner, d'une ou deux fois par semaine à des sessions quotidiennes.
 */
export enum SessionFrequency {
  /** One to two sessions per week */
  ONE_TO_TWO = 'ONE_TO_TWO',
  /** Three to four sessions per week */
  THREE_TO_FOUR = 'THREE_TO_FOUR',
  /** Five to six sessions per week */
  FIVE_TO_SIX = 'FIVE_TO_SIX',
  /** Daily training sessions */
  DAILY = 'DAILY'
}

/**
 * Enumeration for training session duration preferences.
 * Énumération pour les préférences de durée des sessions d'entraînement.
 * 
 * This enum defines the preferred duration of training sessions,
 * from short 30-minute sessions to extended 90+ minute sessions.
 * 
 * Cette énumération définit la durée préférée des sessions d'entraînement,
 * de courtes sessions de 30 minutes à des sessions étendues de 90+ minutes.
 */
export enum SessionDuration {
  /** Short sessions (30-45 minutes) */
  SHORT = 'SHORT',
  /** Medium sessions (45-60 minutes) */
  MEDIUM = 'MEDIUM',
  /** Long sessions (60-90 minutes) */
  LONG = 'LONG',
  /** Extended sessions (90+ minutes) */
  EXTENDED = 'EXTENDED'
}

/**
 * Enumeration for main fitness goals.
 * Énumération pour les objectifs fitness principaux.
 * 
 * This enum defines the primary fitness goals that users can have,
 * such as weight loss, muscle gain, strength, endurance, etc.
 * 
 * Cette énumération définit les objectifs fitness primaires que les
 * utilisateurs peuvent avoir, tels que la perte de poids, la prise
 * de masse, la force, l'endurance, etc.
 */
export enum MainGoal {
  /** Weight loss goal */
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  /** Muscle gain goal */
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  /** Strength improvement goal */
  STRENGTH = 'STRENGTH',
  /** Endurance improvement goal */
  ENDURANCE = 'ENDURANCE',
  /** Muscle toning goal */
  TONING = 'TONING',
  /** General fitness maintenance goal */
  GENERAL_FITNESS = 'GENERAL_FITNESS'
}

/**
 * Enumeration for training preference types.
 * Énumération pour les types de préférences d'entraînement.
 * 
 * This enum defines the types of training that users prefer,
 * such as cardio, strength training, functional training, etc.
 * 
 * Cette énumération définit les types d'entraînement que les utilisateurs
 * préfèrent, tels que le cardio, la musculation, l'entraînement fonctionnel, etc.
 */
export enum TrainingPreference {
  /** Cardiovascular training preference */
  CARDIO = 'CARDIO',
  /** Strength training preference */
  STRENGTH_TRAINING = 'STRENGTH_TRAINING',
  /** Functional training preference */
  FUNCTIONAL = 'FUNCTIONAL',
  /** Flexibility training preference */
  FLEXIBILITY = 'FLEXIBILITY',
  /** Sports-specific training preference */
  SPORTS = 'SPORTS',
  /** Mixed training preference */
  MIXED = 'MIXED'
}

/**
 * Enumeration for available equipment levels.
 * Énumération pour les niveaux d'équipement disponibles.
 * 
 * This enum defines the level of equipment available to the user,
 * from no equipment to full gym access.
 * 
 * Cette énumération définit le niveau d'équipement disponible pour
 * l'utilisateur, d'aucun équipement à un accès complet à la salle.
 */
export enum Equipment {
  /** No equipment available */
  NONE = 'NONE',
  /** Basic equipment available */
  BASIC = 'BASIC',
  /** Home gym equipment available */
  HOME_GYM = 'HOME_GYM',
  /** Gym access available */
  GYM_ACCESS = 'GYM_ACCESS',
  /** Full equipment access available */
  FULL_EQUIPMENT = 'FULL_EQUIPMENT'
}

/**
 * Interface representing user training information.
 * Interface représentant les informations d'entraînement utilisateur.
 * 
 * This interface defines the complete structure of user training information,
 * including physical characteristics, experience level, preferences, and goals.
 * All properties are optional to accommodate partial data scenarios.
 * 
 * Cette interface définit la structure complète des informations d'entraînement
 * utilisateur, incluant les caractéristiques physiques, le niveau d'expérience,
 * les préférences et les objectifs. Toutes les propriétés sont optionnelles
 * pour accommoder les scénarios de données partielles.
 */
export interface TrainingInfo {
  /**
   * Unique identifier for the training information.
   * Identifiant unique pour les informations d'entraînement.
   */
  id?: number;
  
  /**
   * ID of the associated user.
   * ID de l'utilisateur associé.
   */
  userId?: number;
  
  /**
   * User's gender.
   * Genre de l'utilisateur.
   */
  gender?: Gender;
  
  /**
   * User's weight in kilograms.
   * Poids de l'utilisateur en kilogrammes.
   */
  weight?: number;
  
  /**
   * User's height in centimeters.
   * Taille de l'utilisateur en centimètres.
   */
  height?: number;
  
  /**
   * User's body fat percentage.
   * Pourcentage de graisse corporelle de l'utilisateur.
   */
  bodyFatPercentage?: number;
  
  /**
   * User's experience level in fitness training.
   * Niveau d'expérience de l'utilisateur en entraînement fitness.
   */
  experienceLevel?: ExperienceLevel;
  
  /**
   * User's preferred training session frequency.
   * Fréquence préférée des sessions d'entraînement de l'utilisateur.
   */
  sessionFrequency?: SessionFrequency;
  
  /**
   * User's preferred training session duration.
   * Durée préférée des sessions d'entraînement de l'utilisateur.
   */
  sessionDuration?: SessionDuration;
  
  /**
   * User's main fitness goal.
   * Objectif fitness principal de l'utilisateur.
   */
  mainGoal?: MainGoal;
  
  /**
   * User's training preference type.
   * Type de préférence d'entraînement de l'utilisateur.
   */
  trainingPreference?: TrainingPreference;
  
  /**
   * User's available equipment level.
   * Niveau d'équipement disponible pour l'utilisateur.
   */
  equipment?: Equipment;
  
  /**
   * Calculated Body Mass Index (BMI).
   * Indice de masse corporelle (IMC) calculé.
   */
  bmi?: number;
  
  /**
   * Creation timestamp of the training information.
   * Horodatage de création des informations d'entraînement.
   */
  createdAt?: string;
  
  /**
   * Last update timestamp of the training information.
   * Horodatage de dernière mise à jour des informations d'entraînement.
   */
  updatedAt?: string;
}

/**
 * Interface for creating new training information.
 * Interface pour créer de nouvelles informations d'entraînement.
 * 
 * This interface defines the required data structure for creating
 * new training information. It contains all the necessary information
 * to establish a user's training profile.
 * 
 * Cette interface définit la structure de données requise pour créer
 * de nouvelles informations d'entraînement. Elle contient toutes les
 * informations nécessaires pour établir le profil d'entraînement d'un utilisateur.
 */
export interface CreateTrainingInfoRequest {
  /**
   * User's gender (required).
   * Genre de l'utilisateur (requis).
   */
  gender: Gender;
  
  /**
   * User's weight in kilograms (required).
   * Poids de l'utilisateur en kilogrammes (requis).
   */
  weight: number;
  
  /**
   * User's height in centimeters (required).
   * Taille de l'utilisateur en centimètres (requis).
   */
  height: number;
  
  /**
   * User's body fat percentage (optional).
   * Pourcentage de graisse corporelle de l'utilisateur (optionnel).
   */
  bodyFatPercentage?: number;
  
  /**
   * User's experience level (required).
   * Niveau d'expérience de l'utilisateur (requis).
   */
  experienceLevel: ExperienceLevel;
  
  /**
   * User's preferred session frequency (required).
   * Fréquence préférée des sessions de l'utilisateur (requis).
   */
  sessionFrequency: SessionFrequency;
  
  /**
   * User's preferred session duration (required).
   * Durée préférée des sessions de l'utilisateur (requis).
   */
  sessionDuration: SessionDuration;
  
  /**
   * User's main goal (required).
   * Objectif principal de l'utilisateur (requis).
   */
  mainGoal: MainGoal;
  
  /**
   * User's training preference (required).
   * Préférence d'entraînement de l'utilisateur (requis).
   */
  trainingPreference: TrainingPreference;
  
  /**
   * User's available equipment (required).
   * Équipement disponible pour l'utilisateur (requis).
   */
  equipment: Equipment;
}

/**
 * Interface for updating existing training information.
 * Interface pour mettre à jour les informations d'entraînement existantes.
 * 
 * This interface defines the data structure for updating training information.
 * All properties are optional to allow partial updates of training information.
 * 
 * Cette interface définit la structure de données pour mettre à jour les
 * informations d'entraînement. Toutes les propriétés sont optionnelles
 * pour permettre des mises à jour partielles des informations d'entraînement.
 */
export interface UpdateTrainingInfoRequest {
  /**
   * User's gender (optional for updates).
   * Genre de l'utilisateur (optionnel pour les mises à jour).
   */
  gender?: Gender;
  
  /**
   * User's weight in kilograms (optional for updates).
   * Poids de l'utilisateur en kilogrammes (optionnel pour les mises à jour).
   */
  weight?: number;
  
  /**
   * User's height in centimeters (optional for updates).
   * Taille de l'utilisateur en centimètres (optionnel pour les mises à jour).
   */
  height?: number;
  
  /**
   * User's body fat percentage (optional for updates).
   * Pourcentage de graisse corporelle de l'utilisateur (optionnel pour les mises à jour).
   */
  bodyFatPercentage?: number;
  
  /**
   * User's experience level (optional for updates).
   * Niveau d'expérience de l'utilisateur (optionnel pour les mises à jour).
   */
  experienceLevel?: ExperienceLevel;
  
  /**
   * User's preferred session frequency (optional for updates).
   * Fréquence préférée des sessions de l'utilisateur (optionnel pour les mises à jour).
   */
  sessionFrequency?: SessionFrequency;
  
  /**
   * User's preferred session duration (optional for updates).
   * Durée préférée des sessions de l'utilisateur (optionnel pour les mises à jour).
   */
  sessionDuration?: SessionDuration;
  
  /**
   * User's main goal (optional for updates).
   * Objectif principal de l'utilisateur (optionnel pour les mises à jour).
   */
  mainGoal?: MainGoal;
  
  /**
   * User's training preference (optional for updates).
   * Préférence d'entraînement de l'utilisateur (optionnel pour les mises à jour).
   */
  trainingPreference?: TrainingPreference;
  
  /**
   * User's available equipment (optional for updates).
   * Équipement disponible pour l'utilisateur (optionnel pour les mises à jour).
   */
  equipment?: Equipment;
}

// Display helpers
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