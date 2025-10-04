// @ai-refactor: Main entry point with TypeScript exports and Result patterns

/**
 * @cosmospark/best-code
 * TypeScript utility library following BestCode best practices
 * 
 * Features:
 * - Result<T, E> pattern for error handling
 * - Comprehensive input validation and sanitization
 * - Security-first approach with no eval or unsafe operations
 * - Strict TypeScript types with no 'any'
 * - Functional programming patterns
 */

// Export types for consumers
export type { 
  Result, 
  Option, 
  StringOperationConfig,
  GreetingConfig 
} from '@/types';

// Export ValidationError class for error handling
export { ValidationError } from '@/types';

// Export core functions
export { hello, welcome } from '@/core/greeting';
export { capitalize, slugify, truncate } from '@/core/string-utils';

// Export validation utilities for advanced users
export { validateString, validateName, validateSlugText } from '@/utils/validation';

// Default export for backward compatibility
import { hello, welcome } from '@/core/greeting';
import { capitalize, slugify, truncate } from '@/core/string-utils';

const bestCode = {
  hello,
  welcome,
  capitalize,
  slugify,
  truncate
};

export default bestCode;
