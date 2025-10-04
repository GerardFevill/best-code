# 🎯 Exemples Concrets pour IA

> Cas d'usage pratiques, templates et exemples de code suivant les standards BestCode pour agents IA.

## 🚀 Cas d'Usage Fréquents

### 📝 **Génération d'une Route API Sécurisée**

#### 🎯 Demande Type
> "Génère une route POST /users sécurisée avec validation"

#### ✅ Réponse IA Conforme BestCode

```typescript
// @ai-refactor: Generated secure route with validation and Result pattern

import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validateCreateUserDTO } from '@/utils/validation';
import { UserService } from '@/services/UserService';
import { ValidationError } from '@/types';

// Rate limiting pour sécurité
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Too many user creation attempts'
});

/**
 * Route sécurisée pour création d'utilisateur
 * 
 * @route POST /users
 * @access Public (avec rate limiting)
 */
export async function createUserRoute(req: Request, res: Response): Promise<void> {
  try {
    // 1. Validation des données d'entrée
    const validationResult = validateCreateUserDTO(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationResult.error.message,
        field: validationResult.error.field
      });
      return;
    }

    // 2. Création de l'utilisateur via service
    const userService = new UserService();
    const createResult = await userService.createUser(validationResult.data);
    
    if (!createResult.success) {
      const statusCode = createResult.error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: createResult.error.message
      });
      return;
    }

    // 3. Réponse de succès
    res.status(201).json({
      success: true,
      data: {
        id: createResult.data.id,
        name: createResult.data.name,
        email: createResult.data.email,
        createdAt: createResult.data.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Configuration de la route avec middleware
app.post('/users', 
  createUserLimiter,
  createUserRoute
);
```

### 🏗️ **Implémentation Repository Pattern**

#### 🎯 Demande Type
> "Refactore UserService pour appliquer un pattern Repository"

#### ✅ Réponse IA Conforme BestCode

```typescript
// @ai-refactor: Implement Repository pattern for better separation of concerns

// 1. Interface Repository
interface UserRepository {
  findById(id: string): Promise<Result<User | null, AppError>>;
  findByEmail(email: string): Promise<Result<User | null, AppError>>;
  create(userData: CreateUserDTO): Promise<Result<User, AppError>>;
  update(id: string, userData: UpdateUserDTO): Promise<Result<User, AppError>>;
  delete(id: string): Promise<Result<void, AppError>>;
}

// 2. Implémentation Database Repository
export class DatabaseUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<User | null, AppError>> {
    // Validation de l'ID
    const idValidation = validateUserId(id);
    if (!idValidation.success) {
      return { success: false, error: new AppError(idValidation.error.message, 400) };
    }

    return safeApiCall(async () => {
      const user = await this.db.users.findUnique({ 
        where: { id: idValidation.data } 
      });
      return user;
    });
  }

  async create(userData: CreateUserDTO): Promise<Result<User, AppError>> {
    return safeApiCall(async () => {
      const user = await this.db.users.create({
        data: {
          id: generateId(),
          ...userData,
          createdAt: new Date()
        }
      });
      return user;
    });
  }
}

// 3. Service refactorisé avec Repository
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  async createUser(userData: CreateUserDTO): Promise<Result<User, AppError>> {
    // @ai-refactor: Delegated data access to repository
    
    // 1. Vérifier si l'email existe déjà
    const existingUserResult = await this.userRepository.findByEmail(userData.email);
    if (!existingUserResult.success) {
      return existingUserResult;
    }

    if (existingUserResult.data) {
      return {
        success: false,
        error: new AppError('Email already exists', 409)
      };
    }

    // 2. Créer l'utilisateur
    const createResult = await this.userRepository.create(userData);
    if (createResult.success) {
      this.logger.info('User created successfully', { userId: createResult.data.id });
    }

    return createResult;
  }
}
```

## 🧪 Templates de Tests

### ✅ **Tests pour Result<T,E> Pattern**

```typescript
// @ai-refactor: Generated comprehensive tests for Result pattern

describe('UserService with Result Pattern', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userService = new UserService(mockRepository, mockLogger);
  });

  describe('createUser()', () => {
    const validUserData: CreateUserDTO = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    it('should return success result when user is created', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue({ success: true, data: null });
      mockRepository.create.mockResolvedValue({ 
        success: true, 
        data: { id: '123', ...validUserData, createdAt: new Date() }
      });

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toBeSuccessResult();
      expect(result.success && result.data.email).toBe('john@example.com');
    });

    it('should return error result when email already exists', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue({ 
        success: true, 
        data: { id: '456', ...validUserData, createdAt: new Date() }
      });

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toBeErrorResult();
      expect(result.success === false && result.error.statusCode).toBe(409);
    });
  });
});
```

## 🔒 Exemples de Sécurité

### 🛡️ **Validation et Sanitisation Complète**

```typescript
// @ai-refactor: Comprehensive input validation and sanitization

export class SecureInputValidator {
  /**
   * Valide et sanitise les données utilisateur pour création de compte
   */
  static validateCreateUserInput(input: unknown): Result<CreateUserDTO, ValidationError> {
    if (!input || typeof input !== 'object') {
      return {
        success: false,
        error: new ValidationError('Invalid input format', 'input')
      };
    }

    const data = input as Record<string, unknown>;

    // Validation du nom
    const nameResult = this.validateName(data.name);
    if (!nameResult.success) return nameResult;

    // Validation de l'email
    const emailResult = this.validateEmail(data.email);
    if (!emailResult.success) return emailResult;

    // Validation de l'âge (optionnel)
    let age: number | undefined;
    if (data.age !== undefined) {
      const ageResult = this.validateAge(data.age);
      if (!ageResult.success) return ageResult;
      age = ageResult.data;
    }

    return {
      success: true,
      data: {
        name: nameResult.data,
        email: emailResult.data,
        age
      }
    };
  }

  private static validateName(name: unknown): Result<string, ValidationError> {
    if (typeof name !== 'string') {
      return { success: false, error: new ValidationError('Name must be string', 'name') };
    }

    // Sanitisation
    const sanitized = name
      .replace(/[\x00-\x1F\x7F]/g, '') // Caractères de contrôle
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Scripts
      .trim();

    // Validation de longueur
    if (sanitized.length < 2 || sanitized.length > 100) {
      return { success: false, error: new ValidationError('Name length invalid', 'name') };
    }

    // Validation de format
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(sanitized)) {
      return { success: false, error: new ValidationError('Name format invalid', 'name') };
    }

    return { success: true, data: sanitized };
  }
}
```

## 📊 Métriques et Monitoring

### 📈 **Collecte de Métriques Automatique**

```typescript
// @ai-refactor: Generated metrics collection for monitoring

export class MetricsCollector {
  private static metrics: Map<string, number> = new Map();

  /**
   * Collecte les métriques d'une opération
   */
  static async measureOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      
      // Enregistrer le succès
      this.incrementCounter(`${operationName}.success`);
      this.recordDuration(`${operationName}.duration`, Date.now() - startTime);
      
      return result;
    } catch (error) {
      // Enregistrer l'échec
      this.incrementCounter(`${operationName}.error`);
      this.recordDuration(`${operationName}.duration`, Date.now() - startTime);
      
      throw error;
    }
  }

  private static incrementCounter(metric: string): void {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + 1);
  }

  private static recordDuration(metric: string, duration: number): void {
    // Enregistrer la durée (moyenne mobile)
    const current = this.metrics.get(metric) || 0;
    const newAverage = current === 0 ? duration : (current + duration) / 2;
    this.metrics.set(metric, newAverage);
  }
}

// Usage dans les services
export class UserService {
  async createUser(userData: CreateUserDTO): Promise<Result<User, AppError>> {
    return MetricsCollector.measureOperation('user.create', async () => {
      // Logique de création
      return this.userRepository.create(userData);
    });
  }
}
```

## 📋 Checklist de Génération IA

### ✅ **Avant de Proposer du Code**

#### 🔒 **Sécurité (CRITIQUE)**
- [ ] Validation de tous les inputs utilisateur
- [ ] Sanitisation contre XSS/injection
- [ ] Pas d'eval, Function(), ou code dynamique
- [ ] Configuration sécurisée (pas de process.env direct)
- [ ] Gestion des erreurs sans exposition de détails

#### 🎯 **Patterns BestCode (OBLIGATOIRE)**
- [ ] Result<T,E> pour gestion d'erreurs
- [ ] Types TypeScript stricts (pas d'any)
- [ ] Repository pattern pour accès données
- [ ] DTO pour transfert de données
- [ ] Validation avec classes d'erreur spécifiques

#### 🧪 **Tests (REQUIS)**
- [ ] Tests unitaires pour nouveau code
- [ ] Tests d'intégration pour refactoring
- [ ] Tests de sécurité pour validation
- [ ] Matchers personnalisés pour Result<T,E>
- [ ] Couverture >80% maintenue

#### 📝 **Documentation (OBLIGATOIRE)**
- [ ] JSDoc complet avec exemples
- [ ] Commentaires @ai-refactor pour refactoring
- [ ] Messages de commit conventionnels
- [ ] Types de retour documentés
- [ ] Cas d'erreur expliqués

## 🔗 Navigation

- **Précédent :** [09-ai-lexicon.md](./09-ai-lexicon.md) - Lexique pour IA
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Exemples Pratiques pour Agents IA*
