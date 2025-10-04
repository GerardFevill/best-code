// @ai-refactor: String utility functions with Result pattern and validation

import { Result, ValidationError, StringOperationConfig } from '@/types';
import { validateString, validateSlugText } from '@/utils/validation';

/**
 * Capitalizes the first letter of a string with validation
 * @param str - The string to capitalize
 * @param config - Optional configuration
 * @returns Result with capitalized string or validation error
 * @example
 * ```typescript
 * const result = capitalize('hello world');
 * if (result.success) {
 *   console.log(result.data); // "Hello world"
 * }
 * ```
 */
export function capitalize(
  str: unknown,
  config?: StringOperationConfig
): Result<string, ValidationError> {
  // Validate input
  const validationResult = validateString(str, config?.maxLength);
  if (!validationResult.success) {
    return validationResult;
  }

  const validatedStr = validationResult.data;

  // Handle empty string after validation
  if (validatedStr.length === 0) {
    return { success: true, data: '' };
  }

  // Apply capitalization
  const result = config?.preserveCase
    ? validatedStr.charAt(0).toUpperCase() + validatedStr.slice(1)
    : validatedStr.charAt(0).toUpperCase() + validatedStr.slice(1).toLowerCase();

  return { success: true, data: result };
}

/**
 * Generates a URL-friendly slug from a string with comprehensive validation
 * @param text - The text to convert to slug
 * @param config - Optional configuration
 * @returns Result with generated slug or validation error
 * @example
 * ```typescript
 * const result = slugify('Hello World! Comment ça va?');
 * if (result.success) {
 *   console.log(result.data); // "hello-world-comment-ca-va"
 * }
 * ```
 */
export function slugify(
  text: unknown,
  config?: StringOperationConfig
): Result<string, ValidationError> {
  // Validate input
  const validationResult = validateSlugText(text);
  if (!validationResult.success) {
    return validationResult;
  }

  const validatedText = validationResult.data;

  // Handle empty string
  if (validatedText.trim().length === 0) {
    return { success: true, data: '' };
  }

  try {
    // Generate slug with comprehensive character handling
    let slug = validatedText
      .toLowerCase()
      .trim()
      // Normalize accented characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Remove special characters except spaces, hyphens, and underscores
      .replace(/[^\w\s-]/g, '')
      // Replace multiple spaces/underscores with single hyphen
      .replace(/[\s_-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');

    // Additional length check for slug
    const maxSlugLength = config?.maxLength || 100;
    if (slug.length > maxSlugLength) {
      slug = slug.substring(0, maxSlugLength).replace(/-[^-]*$/, '');
    }

    // Ensure slug is not empty after processing
    if (slug.length === 0) {
      return {
        success: false,
        error: new ValidationError(
          'Generated slug is empty after processing',
          'processing'
        )
      };
    }

    return { success: true, data: slug };
  } catch (error) {
    return {
      success: false,
      error: new ValidationError(
        'Failed to process slug generation',
        'processing'
      )
    };
  }
}

/**
 * Truncates text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length (default: 100)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Result with truncated text or validation error
 */
export function truncate(
  text: unknown,
  maxLength: number = 100,
  suffix: string = '...'
): Result<string, ValidationError> {
  // Validate input
  const validationResult = validateString(text);
  if (!validationResult.success) {
    return validationResult;
  }

  const validatedText = validationResult.data;

  // Validate maxLength parameter
  if (maxLength < 1) {
    return {
      success: false,
      error: new ValidationError('maxLength must be greater than 0', 'parameter')
    };
  }

  // Return original if within limit
  if (validatedText.length <= maxLength) {
    return { success: true, data: validatedText };
  }

  // Truncate and add suffix
  const truncatedLength = Math.max(0, maxLength - suffix.length);
  const truncated = validatedText.substring(0, truncatedLength) + suffix;

  return { success: true, data: truncated };
}
