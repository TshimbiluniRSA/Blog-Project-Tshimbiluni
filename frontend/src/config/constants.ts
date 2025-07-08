/**
 * Environment configuration and constants
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Tshimbiluni Blog',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  ENVIRONMENT: import.meta.env.NODE_ENV || 'development',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_COMMENTS: import.meta.env.VITE_ENABLE_COMMENTS !== 'false',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DEBUG_MODE: import.meta.env.NODE_ENV === 'development',
} as const;

// Validation Constants
export const VALIDATION = {
  ARTICLE_TITLE_MIN_LENGTH: 3,
  ARTICLE_TITLE_MAX_LENGTH: 200,
  ARTICLE_CONTENT_MIN_LENGTH: 10,
  TAG_NAME_MIN_LENGTH: 2,
  TAG_NAME_MAX_LENGTH: 50,
  COMMENT_MIN_LENGTH: 5,
  COMMENT_MAX_LENGTH: 1000,
} as const;

// UI Constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 10,
  MAX_TAGS_PER_ARTICLE: 10,
} as const;

export default {
  API_CONFIG,
  APP_CONFIG,
  FEATURES,
  VALIDATION,
  UI,
};
