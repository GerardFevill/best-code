// @ai-refactor: Comprehensive tests for string utility functions

import { capitalize, slugify, truncate, ValidationError } from '../src';

describe('String Utility Functions', () => {
  describe('capitalize()', () => {
    it('should capitalize first letter of lowercase string', () => {
      const result = capitalize('hello world');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello world');
      }
    });

    it('should handle uppercase string correctly', () => {
      const result = capitalize('HELLO WORLD');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello world');
      }
    });

    it('should preserve case when configured', () => {
      const result = capitalize('hELLO wORLD', { preserveCase: true });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('HELLO wORLD');
      }
    });

    it('should handle empty string', () => {
      const result = capitalize('');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('required');
      }
    });

    it('should return error for non-string input', () => {
      const result = capitalize(123);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('type');
      }
    });

    it('should respect maxLength configuration', () => {
      const result = capitalize('hello world', { maxLength: 5 });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('length');
      }
    });
  });

  describe('slugify()', () => {
    it('should create basic slug from simple text', () => {
      const result = slugify('Hello World');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello-world');
      }
    });

    it('should handle special characters and accents', () => {
      const result = slugify('Hello World! Comment ça va?');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello-world-comment-ca-va');
      }
    });

    it('should handle multiple spaces and hyphens', () => {
      const result = slugify('Hello    World---Test');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello-world-test');
      }
    });

    it('should handle leading and trailing spaces', () => {
      const result = slugify('  Hello World  ');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('hello-world');
      }
    });

    it('should return error for non-string input', () => {
      const result = slugify(null);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should handle empty string after processing', () => {
      const result = slugify('!@#$%^&*()');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('processing');
      }
    });

    it('should truncate long slugs', () => {
      const longText = 'a'.repeat(150);
      const result = slugify(longText, { maxLength: 50 });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBeLessThanOrEqual(50);
      }
    });

    it('should handle unicode characters', () => {
      const result = slugify('Café & Résumé');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('cafe-resume');
      }
    });
  });

  describe('truncate()', () => {
    it('should truncate long text with default ellipsis', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncate(longText, 20);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('This is a very lo...');
        expect(result.data.length).toBe(20);
      }
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncate(shortText, 20);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Short text');
      }
    });

    it('should use custom suffix', () => {
      const text = 'This is a long text';
      const result = truncate(text, 15, ' [more]');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('This is [more]');
        expect(result.data.length).toBe(15);
      }
    });

    it('should return error for invalid maxLength', () => {
      const result = truncate('Hello', 0);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('parameter');
      }
    });

    it('should return error for non-string input', () => {
      const result = truncate(123, 10);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should handle edge case where suffix is longer than maxLength', () => {
      const result = truncate('Hello World', 5, '...........');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('...........');
      }
    });
  });
});
