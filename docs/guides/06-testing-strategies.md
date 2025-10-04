# 🧪 Stratégies de Tests BestCode

> Guide complet des stratégies de tests, Jest, couverture de code et patterns de test pour TypeScript.

## 🎯 Philosophie de Test BestCode

### 📋 Principes Fondamentaux

- **🔒 Sécurité d'abord** : Tester tous les cas de validation et sanitisation
- **⚡ Result<T,E> pattern** : Tests adaptés à la gestion d'erreurs fonctionnelle  
- **🎯 Couverture >80%** : Minimum requis pour refactoring
- **🧪 Tests atomiques** : Un test = un comportement
- **📊 Métriques continues** : Suivi de la qualité des tests

## 🏗️ Architecture de Tests

### 📁 Structure Recommandée

```
tests/
├── unit/                    # Tests unitaires
│   ├── core/               # Tests des fonctions métier
│   ├── utils/              # Tests des utilitaires
│   └── types/              # Tests des types et validations
├── integration/            # Tests d'intégration
│   ├── api/               # Tests des endpoints
│   ├── database/          # Tests de persistance
│   └── services/          # Tests des services
├── e2e/                   # Tests end-to-end
│   ├── scenarios/         # Scénarios utilisateur
│   └── fixtures/          # Données de test
├── performance/           # Tests de performance
│   ├── benchmarks/        # Benchmarks
│   └── load/              # Tests de charge
├── security/              # Tests de sécurité
│   ├── validation/        # Tests de validation
│   └── sanitization/      # Tests de sanitisation
├── setup.ts               # Configuration globale
├── helpers/               # Utilitaires de test
└── mocks/                 # Mocks et stubs
```

## ⚙️ Configuration Jest Avancée

### 🔧 Configuration Complète

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Chemins et patterns
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/tests/**/*.+(ts|tsx|js)',
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  
  // Transformation TypeScript
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  
  // Couverture de code
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.type.ts'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  
  // Seuils de couverture BestCode
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    // Seuils spécifiques par module critique
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/utils/validation.ts': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  
  // Configuration des modules
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Setup et configuration
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true,
  
  // Parallélisation
  maxWorkers: '50%',
  
  // Gestion des erreurs
  errorOnDeprecated: true,
  
  // Reporters personnalisés
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'coverage',
      outputName: 'junit.xml'
    }]
  ]
};
```

### 🛠️ Setup de Tests Personnalisé

```typescript
// tests/setup.ts
import { performance } from 'perf_hooks';

// Configuration globale
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'error'; // Réduire les logs en test
});

afterAll(() => {
  // Nettoyage global
});

// Matchers personnalisés pour Result<T, E>
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeSuccessResult(): R;
      toBeErrorResult(): R;
      toBeValidationError(field?: string): R;
      toHavePerformanceBetter(threshold: number): R;
    }
  }
}

expect.extend({
  toBeSuccessResult(received) {
    const pass = received && received.success === true && 'data' in received;
    return {
      message: () => pass 
        ? `Expected ${JSON.stringify(received)} not to be a success result`
        : `Expected ${JSON.stringify(received)} to be a success result`,
      pass,
    };
  },
  
  toBeErrorResult(received) {
    const pass = received && received.success === false && 'error' in received;
    return {
      message: () => pass
        ? `Expected ${JSON.stringify(received)} not to be an error result`
        : `Expected ${JSON.stringify(received)} to be an error result`,
      pass,
    };
  },
  
  toBeValidationError(received, expectedField) {
    const isErrorResult = received && received.success === false && 'error' in received;
    const isValidationError = isErrorResult && received.error.name === 'ValidationError';
    const fieldMatches = !expectedField || received.error.field === expectedField;
    
    const pass = isValidationError && fieldMatches;
    
    return {
      message: () => pass
        ? `Expected not to be ValidationError${expectedField ? ` with field ${expectedField}` : ''}`
        : `Expected ValidationError${expectedField ? ` with field ${expectedField}` : ''}`,
      pass,
    };
  },
  
  toHavePerformanceBetter(received, threshold) {
    const pass = received < threshold;
    return {
      message: () => pass
        ? `Expected ${received}ms not to be better than ${threshold}ms`
        : `Expected ${received}ms to be better than ${threshold}ms`,
      pass,
    };
  },
});

// Utilitaires de test globaux
global.createMockUser = () => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date('2024-01-01'),
});

global.measurePerformance = async (fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};
```

## 🧪 Patterns de Tests BestCode

### 🎯 Tests pour Result<T, E> Pattern

```typescript
// tests/unit/core/greeting.test.ts
import { hello, welcome, ValidationError } from '@/core/greeting';

describe('Greeting Functions with Result Pattern', () => {
  describe('hello()', () => {
    describe('Success Cases', () => {
      it('should return success with valid name and default greeting', () => {
        const result = hello('John');
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('Hello, John!');
      });

      it('should return success with custom greeting', () => {
        const result = hello('Alice', 'Hi');
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('Hi, Alice!');
      });

      it('should handle accented names correctly', () => {
        const result = hello('François', 'Bonjour');
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('Bonjour, François!');
      });
    });

    describe('Validation Errors', () => {
      it('should return error for non-string name', () => {
        const result = hello(123);
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('type');
      });

      it('should return error for empty name', () => {
        const result = hello('   ');
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('required');
      });

      it('should return error for invalid name format', () => {
        const result = hello('John123');
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('format');
      });

      it('should return error for empty greeting', () => {
        const result = hello('John', '');
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('greeting');
      });
    });

    describe('Configuration Options', () => {
      it('should respect maxLength configuration', () => {
        const result = hello('John', 'Hello', { maxLength: 10 });
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('length');
      });

      it('should preserve case when configured', () => {
        const result = hello('john', 'HELLO', { preserveCase: true });
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('HELLO, john!');
      });
    });
  });
});
```

### 🔒 Tests de Sécurité

```typescript
// tests/security/validation.test.ts
import { validateString, validateEmail, validateName } from '@/utils/validation';

describe('Security Validation Tests', () => {
  describe('validateString()', () => {
    describe('XSS Prevention', () => {
      it('should remove control characters', () => {
        const maliciousInput = 'Hello\x00\x1F\x7FWorld';
        const result = validateString(maliciousInput);
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('HelloWorld');
      });

      it('should handle extremely long inputs', () => {
        const longInput = 'a'.repeat(10000);
        const result = validateString(longInput, { maxLength: 1000 });
        
        expect(result).toBeErrorResult();
        expect(result).toBeValidationError('length');
      });
    });

    describe('Injection Prevention', () => {
      it('should reject SQL injection attempts', () => {
        const sqlInjection = "'; DROP TABLE users; --";
        const result = validateString(sqlInjection);
        
        expect(result).toBeSuccessResult();
        // Vérifie que les caractères dangereux sont nettoyés
        expect(result.success && result.data).not.toContain('DROP TABLE');
      });

      it('should reject script injection attempts', () => {
        const scriptInjection = '<script>alert("xss")</script>';
        const result = validateString(scriptInjection);
        
        expect(result).toBeSuccessResult();
        // La validation de base ne supprime pas HTML, mais les sanitizers le font
        expect(result.success && result.data).toContain('<script>');
      });
    });
  });

  describe('validateEmail()', () => {
    describe('Email Security', () => {
      it('should normalize email addresses', () => {
        const result = validateEmail('  TEST@EXAMPLE.COM  ');
        
        expect(result).toBeSuccessResult();
        expect(result.success && result.data).toBe('test@example.com');
      });

      it('should reject malformed emails', () => {
        const malformedEmails = [
          'not-an-email',
          '@example.com',
          'test@',
          'test..test@example.com',
          'test@example',
        ];

        malformedEmails.forEach(email => {
          const result = validateEmail(email);
          expect(result).toBeErrorResult();
        });
      });

      it('should enforce RFC 5321 limits', () => {
        // Local part trop long (>64 chars)
        const longLocal = 'a'.repeat(65) + '@example.com';
        const result1 = validateEmail(longLocal);
        expect(result1).toBeErrorResult();

        // Domain trop long (>253 chars)
        const longDomain = 'test@' + 'a'.repeat(250) + '.com';
        const result2 = validateEmail(longDomain);
        expect(result2).toBeErrorResult();
      });
    });
  });
});
```

### ⚡ Tests de Performance

```typescript
// tests/performance/string-utils.bench.ts
import { slugify, capitalize } from '@/core/string-utils';

describe('Performance Benchmarks', () => {
  describe('slugify() performance', () => {
    it('should process short strings quickly', async () => {
      const shortText = 'Hello World';
      
      const duration = await measurePerformance(async () => {
        for (let i = 0; i < 1000; i++) {
          slugify(shortText);
        }
      });
      
      expect(duration).toHavePerformanceBetter(100); // < 100ms pour 1000 itérations
    });

    it('should handle long strings efficiently', async () => {
      const longText = 'Lorem ipsum '.repeat(100);
      
      const duration = await measurePerformance(async () => {
        for (let i = 0; i < 100; i++) {
          slugify(longText);
        }
      });
      
      expect(duration).toHavePerformanceBetter(500); // < 500ms pour 100 itérations
    });

    it('should maintain consistent performance', async () => {
      const text = 'Consistent Performance Test';
      const durations: number[] = [];
      
      // Mesurer 10 fois
      for (let run = 0; run < 10; run++) {
        const duration = await measurePerformance(async () => {
          for (let i = 0; i < 100; i++) {
            slugify(text);
          }
        });
        durations.push(duration);
      }
      
      // Calculer la variance
      const mean = durations.reduce((a, b) => a + b) / durations.length;
      const variance = durations.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);
      
      // La déviation standard ne doit pas dépasser 20% de la moyenne
      expect(stdDev).toBeLessThan(mean * 0.2);
    });
  });
});
```

### 🔄 Tests d'Intégration

```typescript
// tests/integration/user-service.test.ts
import { UserService } from '@/services/UserService';
import { DatabaseUserRepository } from '@/repositories/DatabaseUserRepository';
import { TestDatabase } from '../helpers/TestDatabase';

describe('UserService Integration Tests', () => {
  let userService: UserService;
  let testDb: TestDatabase;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.setup();
    
    const repository = new DatabaseUserRepository(testDb.connection);
    userService = new UserService(repository);
  });

  afterAll(async () => {
    await testDb.cleanup();
  });

  beforeEach(async () => {
    await testDb.clearTables();
  });

  describe('User Creation Flow', () => {
    it('should create user with complete validation flow', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30
      };

      const result = await userService.createUser(userData);
      
      expect(result).toBeSuccessResult();
      
      if (result.success) {
        expect(result.data.id).toBeDefined();
        expect(result.data.name).toBe('John Doe');
        expect(result.data.email).toBe('john.doe@example.com');
        expect(result.data.createdAt).toBeInstanceOf(Date);
      }
    });

    it('should prevent duplicate email registration', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'duplicate@example.com'
      };

      // Premier utilisateur
      const result1 = await userService.createUser(userData);
      expect(result1).toBeSuccessResult();

      // Tentative de duplication
      const result2 = await userService.createUser({
        ...userData,
        name: 'Different Name'
      });
      
      expect(result2).toBeErrorResult();
      expect(result2.success === false && result2.error.message).toContain('email already exists');
    });
  });

  describe('User Retrieval Flow', () => {
    it('should retrieve user by ID with proper error handling', async () => {
      // Créer un utilisateur d'abord
      const createResult = await userService.createUser({
        name: 'Test User',
        email: 'test@example.com'
      });
      
      expect(createResult).toBeSuccessResult();
      
      if (createResult.success) {
        const userId = createResult.data.id;
        
        // Récupérer l'utilisateur
        const getResult = await userService.getUserById(userId);
        
        expect(getResult).toBeSuccessResult();
        expect(getResult.success && getResult.data.id).toBe(userId);
      }
    });

    it('should handle non-existent user gracefully', async () => {
      const result = await userService.getUserById('non-existent-id');
      
      expect(result).toBeErrorResult();
      expect(result.success === false && result.error.statusCode).toBe(404);
    });
  });
});
```

## 📊 Métriques et Reporting

### 🎯 Configuration des Métriques

```typescript
// tests/helpers/MetricsCollector.ts
export class TestMetricsCollector {
  private static metrics: TestMetrics[] = [];

  static recordTest(testName: string, duration: number, status: 'pass' | 'fail') {
    this.metrics.push({
      testName,
      duration,
      status,
      timestamp: new Date(),
    });
  }

  static generateReport(): TestReport {
    const totalTests = this.metrics.length;
    const passedTests = this.metrics.filter(m => m.status === 'pass').length;
    const failedTests = totalTests - passedTests;
    const averageDuration = this.metrics.reduce((acc, m) => acc + m.duration, 0) / totalTests;

    return {
      totalTests,
      passedTests,
      failedTests,
      passRate: (passedTests / totalTests) * 100,
      averageDuration,
      slowestTests: this.metrics
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
    };
  }
}

interface TestMetrics {
  testName: string;
  duration: number;
  status: 'pass' | 'fail';
  timestamp: Date;
}

interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
  averageDuration: number;
  slowestTests: TestMetrics[];
}
```

## 📋 Checklist de Tests BestCode

### ✅ Tests Unitaires
- [ ] Couverture >80% pour tous les modules
- [ ] Couverture >90% pour les modules critiques
- [ ] Tests pour tous les cas de Result<T,E>
- [ ] Tests de validation et sanitisation
- [ ] Tests de performance pour fonctions critiques

### ✅ Tests d'Intégration
- [ ] Tests des flux complets utilisateur
- [ ] Tests de persistance des données
- [ ] Tests des APIs externes
- [ ] Tests de gestion d'erreurs end-to-end

### ✅ Tests de Sécurité
- [ ] Tests d'injection (SQL, XSS, etc.)
- [ ] Tests de validation des entrées
- [ ] Tests de sanitisation
- [ ] Tests des limites et cas extrêmes

### ✅ Tests de Performance
- [ ] Benchmarks des fonctions critiques
- [ ] Tests de charge
- [ ] Tests de régression performance
- [ ] Profiling mémoire

### ✅ Configuration et Outils
- [ ] Jest configuré avec seuils stricts
- [ ] Matchers personnalisés pour Result<T,E>
- [ ] Setup de tests sécurisé
- [ ] Reporting automatique des métriques

## 🔗 Navigation

- **Précédent :** [05-smart-refactor.md](./05-smart-refactor.md) - Méthodologie SmartRefactor™
- **Suivant :** [07-dependency-management.md](./07-dependency-management.md) - Gestion des dépendances
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Stratégies de Tests et Qualité*
