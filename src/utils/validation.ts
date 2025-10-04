// @ai-refactor: Input validation utilities following security best practices

import { Result, ValidationError } from '@/types';

/**
 * Validates and sanitizes string input
 * @param input - Raw input to validate
 * @param maxLength - Maximum allowed length (default: 1000)
 * @returns Result with sanitized string or validation error
 */
export function validateString(
  input: unknown, 
  maxLength: number = 1000
): Result<string, ValidationError> {
  // Type validation
  if (typeof input !== 'string') {
    return {
      success: false,
      error: new ValidationError('Input must be a string', 'type')
    };
  }

  // Empty string validation
  if (input.trim().length === 0) {
    return {
      success: false,
      error: new ValidationError('Input cannot be empty', 'required')
    };
  }

  // Length validation
  if (input.length > maxLength) {
    return {
      success: false,
      error: new ValidationError(
        `Input exceeds maximum length of ${maxLength} characters`,
        'length'
      )
    };
  }

  // Basic sanitization - remove control characters
  const sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');

  return { success: true, data: sanitized };
}

/**
 * Validates name input with specific rules
 * @param name - Name to validate
 * @returns Result with validated name or error
 */
export function validateName(name: unknown): Result<string, ValidationError> {
  const stringResult = validateString(name, 100);
  if (!stringResult.success) {
    return stringResult;
  }

  const sanitizedName = stringResult.data;

  // Name-specific validation
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(sanitizedName)) {
    return {
      success: false,
      error: new ValidationError(
        'Name can only contain letters, spaces, hyphens, and apostrophes',
        'format'
      )
    };
  }

  return { success: true, data: sanitizedName.trim() };
}

/**
 * Validates text for slug generation
 * @param text - Text to validate for slugification
 * @returns Result with validated text or error
 */
export function validateSlugText(text: unknown): Result<string, ValidationError> {
  const stringResult = validateString(text, 200);
  if (!stringResult.success) {
    return stringResult;
  }

  return { success: true, data: stringResult.data };
}
