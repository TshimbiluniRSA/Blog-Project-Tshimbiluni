import { VALIDATION } from '../config/constants';

/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validate article title
 */
export const validateTitle = (title: string): ValidationResult => {
  const trimmed = title.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Title is required.' };
  }
  
  if (trimmed.length < VALIDATION.ARTICLE_TITLE_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Title must be at least ${VALIDATION.ARTICLE_TITLE_MIN_LENGTH} characters long.` 
    };
  }
  
  if (trimmed.length > VALIDATION.ARTICLE_TITLE_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Title must be no more than ${VALIDATION.ARTICLE_TITLE_MAX_LENGTH} characters long.` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate article content
 */
export const validateContent = (content: string): ValidationResult => {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Content is required.' };
  }
  
  if (trimmed.length < VALIDATION.ARTICLE_CONTENT_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Content must be at least ${VALIDATION.ARTICLE_CONTENT_MIN_LENGTH} characters long.` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate tag name
 */
export const validateTagName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Tag name is required.' };
  }
  
  if (trimmed.length < VALIDATION.TAG_NAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Tag name must be at least ${VALIDATION.TAG_NAME_MIN_LENGTH} characters long.` 
    };
  }
  
  if (trimmed.length > VALIDATION.TAG_NAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Tag name must be no more than ${VALIDATION.TAG_NAME_MAX_LENGTH} characters long.` 
    };
  }
  
  // Check for invalid characters (only allow alphanumeric, spaces, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validPattern.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Tag name can only contain letters, numbers, spaces, hyphens, and underscores.' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate comment content
 */
export const validateComment = (content: string): ValidationResult => {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Comment is required.' };
  }
  
  if (trimmed.length < VALIDATION.COMMENT_MIN_LENGTH) {
    return { 
      isValid: false, 
      message: `Comment must be at least ${VALIDATION.COMMENT_MIN_LENGTH} characters long.` 
    };
  }
  
  if (trimmed.length > VALIDATION.COMMENT_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Comment must be no more than ${VALIDATION.COMMENT_MAX_LENGTH} characters long.` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  const trimmed = email.trim();
  
  if (!trimmed) {
    return { isValid: false, message: 'Email is required.' };
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  
  return { isValid: true };
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number | undefined;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};
