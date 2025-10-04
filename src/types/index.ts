// @ai-refactor: Core types following BestCode patterns

// Déclaration pour Error.captureStackTrace (Node.js)
declare global {
  interface ErrorConstructor {
    captureStackTrace?(thisArg: unknown, func?: unknown): void;
  }
}

/**
 * Result pattern for functional error handling
 * Preferred over try/catch for predictable error flows
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Option pattern for nullable values
 * Explicit handling of potentially missing values
 */
export type Option<T> = T | null;

/**
 * Validation error for input sanitization
 */
export class ValidationError extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationError';
    // Capture stack trace si disponible (Node.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}

/**
 * Configuration interface for string operations
 */
export interface StringOperationConfig {
  readonly locale?: string;
  readonly preserveCase?: boolean;
  readonly maxLength?: number;
}

/**
 * Greeting configuration with validation
 */
export interface GreetingConfig extends StringOperationConfig {
  readonly defaultGreeting?: string;
  readonly includeTimestamp?: boolean;
}
