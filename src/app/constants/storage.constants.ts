/**
 * Constants for localStorage keys.
 * Constantes pour les clés localStorage.
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  CURRENT_USER: 'current_user'
} as const;

/**
 * HTTP status codes.
 * Codes de statut HTTP.
 */
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const; 