// @ai-refactor: Comprehensive tests for greeting functions

import { hello, welcome, ValidationError } from '../src';

describe('Greeting Functions', () => {
  describe('hello()', () => {
    it('should return success with valid name and default greeting', () => {
      const result = hello('John');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hello, John!');
      }
    });

    it('should return success with valid name and custom greeting', () => {
      const result = hello('Alice', 'Hi');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Hi, Alice!');
      }
    });

    it('should handle names with accents correctly', () => {
      const result = hello('François', 'Bonjour');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Bonjour, François!');
      }
    });

    it('should return error for non-string name', () => {
      const result = hello(123);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('type');
      }
    });

    it('should return error for empty name', () => {
      const result = hello('   ');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('required');
      }
    });

    it('should return error for invalid name format', () => {
      const result = hello('John123');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('format');
      }
    });

    it('should return error for empty greeting', () => {
      const result = hello('John', '');
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('greeting');
      }
    });

    it('should respect maxLength configuration', () => {
      const result = hello('John', 'Hello', { maxLength: 10 });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('length');
      }
    });

    it('should preserve case when configured', () => {
      const result = hello('john', 'HELLO', { preserveCase: true });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('HELLO, john!');
      }
    });
  });

  describe('welcome()', () => {
    it('should return success with valid name and timestamp', () => {
      const result = welcome('Developer');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain('Bienvenue Developer!');
        expect(result.data).toContain('Il est actuellement');
      }
    });

    it('should return success without timestamp when configured', () => {
      const result = welcome('Developer', { includeTimestamp: false });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('Bienvenue Developer!');
      }
    });

    it('should use custom locale when specified', () => {
      const result = welcome('Developer', { locale: 'en-US' });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toContain('Bienvenue Developer!');
        // Should contain English-formatted date
        expect(result.data).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      }
    });

    it('should return error for invalid name', () => {
      const result = welcome(null);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it('should handle invalid locale gracefully', () => {
      const result = welcome('Developer', { locale: 'invalid-locale' });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.field).toBe('locale');
      }
    });
  });
});
