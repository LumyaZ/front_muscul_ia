// Enums matching the backend
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum SessionFrequency {
  ONE_TO_TWO = 'ONE_TO_TWO',
  THREE_TO_FOUR = 'THREE_TO_FOUR',
  FIVE_TO_SIX = 'FIVE_TO_SIX',
  DAILY = 'DAILY'
}

export enum SessionDuration {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG',
  EXTENDED = 'EXTENDED'
}

export enum MainGoal {
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  TONING = 'TONING',
  GENERAL_FITNESS = 'GENERAL_FITNESS'
}

export enum TrainingPreference {
  CARDIO = 'CARDIO',
  STRENGTH_TRAINING = 'STRENGTH_TRAINING',
  FUNCTIONAL = 'FUNCTIONAL',
  FLEXIBILITY = 'FLEXIBILITY',
  SPORTS = 'SPORTS',
  MIXED = 'MIXED'
}

export enum Equipment {
  NONE = 'NONE',
  BASIC = 'BASIC',
  HOME_GYM = 'HOME_GYM',
  GYM_ACCESS = 'GYM_ACCESS',
  FULL_EQUIPMENT = 'FULL_EQUIPMENT'
}

// Main interfaces
export interface TrainingInfo {
  id?: number;
  userId?: number;
  gender?: Gender;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  experienceLevel?: ExperienceLevel;
  sessionFrequency?: SessionFrequency;
  sessionDuration?: SessionDuration;
  mainGoal?: MainGoal;
  trainingPreference?: TrainingPreference;
  equipment?: Equipment;
  bmi?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrainingInfoRequest {
  gender: Gender;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  experienceLevel: ExperienceLevel;
  sessionFrequency: SessionFrequency;
  sessionDuration: SessionDuration;
  mainGoal: MainGoal;
  trainingPreference: TrainingPreference;
  equipment: Equipment;
}

export interface UpdateTrainingInfoRequest {
  gender?: Gender;
  weight?: number;
  height?: number;
  bodyFatPercentage?: number;
  experienceLevel?: ExperienceLevel;
  sessionFrequency?: SessionFrequency;
  sessionDuration?: SessionDuration;
  mainGoal?: MainGoal;
  trainingPreference?: TrainingPreference;
  equipment?: Equipment;
}

// Display helpers
export const GenderDisplayNames: Record<Gender, string> = {
  [Gender.MALE]: 'Homme',
  [Gender.FEMALE]: 'Femme',
  [Gender.OTHER]: 'Autre'
};

export const ExperienceLevelDisplayNames: Record<ExperienceLevel, string> = {
  [ExperienceLevel.BEGINNER]: 'Débutant',
  [ExperienceLevel.INTERMEDIATE]: 'Intermédiaire',
  [ExperienceLevel.ADVANCED]: 'Avancé',
  [ExperienceLevel.EXPERT]: 'Expert'
};

export const SessionFrequencyDisplayNames: Record<SessionFrequency, string> = {
  [SessionFrequency.ONE_TO_TWO]: '1-2 fois',
  [SessionFrequency.THREE_TO_FOUR]: '3-4 fois',
  [SessionFrequency.FIVE_TO_SIX]: '5-6 fois',
  [SessionFrequency.DAILY]: 'Quotidien'
};

export const SessionDurationDisplayNames: Record<SessionDuration, string> = {
  [SessionDuration.SHORT]: 'Court (30-45 min)',
  [SessionDuration.MEDIUM]: 'Moyen (45-60 min)',
  [SessionDuration.LONG]: 'Long (60-90 min)',
  [SessionDuration.EXTENDED]: 'Étendu (90+ min)'
};

export const MainGoalDisplayNames: Record<MainGoal, string> = {
  [MainGoal.WEIGHT_LOSS]: 'Perte de poids',
  [MainGoal.MUSCLE_GAIN]: 'Prise de masse',
  [MainGoal.STRENGTH]: 'Force',
  [MainGoal.ENDURANCE]: 'Endurance',
  [MainGoal.TONING]: 'Tonification',
  [MainGoal.GENERAL_FITNESS]: 'Forme générale'
};

export const TrainingPreferenceDisplayNames: Record<TrainingPreference, string> = {
  [TrainingPreference.CARDIO]: 'Cardio',
  [TrainingPreference.STRENGTH_TRAINING]: 'Musculation',
  [TrainingPreference.FUNCTIONAL]: 'Fonctionnel',
  [TrainingPreference.FLEXIBILITY]: 'Flexibilité',
  [TrainingPreference.SPORTS]: 'Sports',
  [TrainingPreference.MIXED]: 'Mixte'
};

export const EquipmentDisplayNames: Record<Equipment, string> = {
  [Equipment.NONE]: 'Aucun',
  [Equipment.BASIC]: 'Basique',
  [Equipment.HOME_GYM]: 'Salle à domicile',
  [Equipment.GYM_ACCESS]: 'Accès salle',
  [Equipment.FULL_EQUIPMENT]: 'Équipement complet'
}; 