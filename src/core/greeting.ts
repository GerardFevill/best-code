// @ai-refactor: Greeting functions with Result pattern and security validation

import { Result, ValidationError, GreetingConfig } from '@/types';
import { validateName } from '@/utils/validation';

/**
 * Generates a personalized greeting message with validation
 * @param name - The name of the person to greet
 * @param greeting - The type of greeting (default: 'Hello')
 * @param config - Optional configuration for the greeting
 * @returns Result with formatted greeting message or validation error
 * @throws Never throws - uses Result pattern for error handling
 * @example
 * ```typescript
 * const result = hello('John', 'Hi');
 * if (result.success) {
 *   console.log(result.data); // "Hi, John!"
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export function hello(
  name: unknown,
  greeting: string = 'Hello',
  config?: GreetingConfig
): Result<string, ValidationError> {
  // Validate name input
  const nameResult = validateName(name);
  if (!nameResult.success) {
    return nameResult;
  }

  // Validate greeting
  if (typeof greeting !== 'string' || greeting.trim().length === 0) {
    return {
      success: false,
      error: new ValidationError('Greeting must be a non-empty string', 'greeting')
    };
  }

  // Sanitize greeting
  const sanitizedGreeting = greeting.trim();
  const validatedName = nameResult.data;

  // Apply configuration
  const finalGreeting = config?.preserveCase 
    ? sanitizedGreeting 
    : sanitizedGreeting.charAt(0).toUpperCase() + sanitizedGreeting.slice(1).toLowerCase();

  const message = `${finalGreeting}, ${validatedName}!`;

  // Check max length if specified
  if (config?.maxLength && message.length > config.maxLength) {
    return {
      success: false,
      error: new ValidationError(
        `Generated message exceeds maximum length of ${config.maxLength}`,
        'length'
      )
    };
  }

  return { success: true, data: message };
}

/**
 * Generates a welcome message with current timestamp
 * @param name - The name of the person
 * @param config - Optional configuration
 * @returns Result with welcome message including timestamp or validation error
 * @example
 * ```typescript
 * const result = welcome('Alice');
 * if (result.success) {
 *   console.log(result.data); // "Bienvenue Alice! Il est actuellement 04/10/2024 à 15:30:45"
 * }
 * ```
 */
export function welcome(
  name: unknown,
  config?: GreetingConfig
): Result<string, ValidationError> {
  // Validate name input
  const nameResult = validateName(name);
  if (!nameResult.success) {
    return nameResult;
  }

  const validatedName = nameResult.data;
  const locale = config?.locale || 'fr-FR';
  
  try {
    const now = new Date().toLocaleString(locale);
    const message = config?.includeTimestamp !== false
      ? `Bienvenue ${validatedName}! Il est actuellement ${now}`
      : `Bienvenue ${validatedName}!`;

    // Check max length if specified
    if (config?.maxLength && message.length > config.maxLength) {
      return {
        success: false,
        error: new ValidationError(
          `Generated message exceeds maximum length of ${config.maxLength}`,
          'length'
        )
      };
    }

    return { success: true, data: message };
  } catch (error) {
    return {
      success: false,
      error: new ValidationError(
        `Failed to format date with locale ${locale}`,
        'locale'
      )
    };
  }
}
