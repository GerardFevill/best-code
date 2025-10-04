# 💻 Bonnes Pratiques de Codage BestCode

> Guide des conventions de nommage, types, interfaces et patterns de développement TypeScript sécurisé.

## 🎯 Conventions de Nommage

### 📝 Standards de Nommage

```typescript
// ✅ Bonnes pratiques
class UserService {}                    // PascalCase pour les classes
interface UserData {}                  // PascalCase pour les interfaces
type ApiResponse<T> = {}               // PascalCase pour les types
const API_BASE_URL = 'https://...'     // SCREAMING_SNAKE_CASE pour les constantes
const userName = 'john'                // camelCase pour les variables
function getUserById() {}              // camelCase pour les fonctions

// ❌ À éviter
class userservice {}                   // Mauvaise casse
interface userData {}                 // Mauvaise casse
const apibaseurl = 'https://...'      // Mauvaise casse
```

### 🏷️ Conventions Spécifiques BestCode

```typescript
// Types et interfaces
type Result<T, E = Error> = Success<T> | Failure<E>;
interface CreateUserDTO { readonly name: string; }
interface UserRepository { findById(id: string): Promise<Option<User>>; }

// Fonctions et méthodes
function validateUserInput(): Result<User, ValidationError> {}
async function fetchUserData(): Promise<Result<User[], NetworkError>> {}

// Constantes et configuration
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/
} as const;
```

## 🔧 Types et Interfaces

### 📋 Définition des Types

```typescript
// ✅ Utiliser des interfaces pour les objets
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
}

// ✅ Utiliser des types pour les unions et les primitives
type Status = 'pending' | 'approved' | 'rejected';
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';

// ✅ Génériques pour la réutilisabilité
interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly success: boolean;
  readonly timestamp: Date;
}

// ✅ Types utilitaires TypeScript
type CreateUserRequest = Omit<User, 'id' | 'createdAt'>;
type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>>;
type UserPublicInfo = Pick<User, 'id' | 'name'>;
```

### 🛡️ Types de Sécurité

```typescript
// Types pour validation sécurisée
interface ValidatedInput<T> {
  readonly value: T;
  readonly isValid: boolean;
  readonly errors: ValidationError[];
}

// Types pour sanitisation
type SanitizedString = string & { readonly __sanitized: true };
type SafeHtml = string & { readonly __safeHtml: true };

// Types pour configuration sécurisée
interface SecureConfig {
  readonly apiKey: string;
  readonly dbUrl: string;
  readonly jwtSecret: string;
  readonly environment: 'development' | 'staging' | 'production';
}
```

## 🛠️ Gestion des Erreurs

### 🎯 Pattern Result<T, E>

```typescript
// ✅ Type Result pour la gestion d'erreurs fonctionnelle
type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// ✅ Classes d'erreur personnalisées
class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super(message, 400);
  }
}

class NetworkError extends AppError {
  constructor(message: string, public readonly statusCode: number) {
    super(message, statusCode);
  }
}
```

### 🔄 Fonctions de Gestion d'Erreurs

```typescript
// ✅ Wrapper pour gestion d'erreurs sécurisée
async function safeApiCall<T>(
  fn: () => Promise<T>
): Promise<Result<T, AppError>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const appError = error instanceof AppError 
      ? error 
      : new AppError('Unexpected error occurred');
    return { success: false, error: appError };
  }
}

// ✅ Validation avec Result pattern
function validateEmail(email: unknown): Result<string, ValidationError> {
  if (typeof email !== 'string') {
    return { 
      success: false, 
      error: new ValidationError('Email must be a string', 'email') 
    };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { 
      success: false, 
      error: new ValidationError('Invalid email format', 'email') 
    };
  }
  
  return { success: true, data: email.toLowerCase().trim() };
}
```

## 📝 Documentation et Commentaires

### 📚 JSDoc Standards

```typescript
/**
 * Service pour gérer les utilisateurs avec validation sécurisée
 * 
 * @example
 * ```typescript
 * const userService = new UserService();
 * const result = await userService.getUserById('123');
 * if (result.success) {
 *   console.log(result.data.name);
 * }
 * ```
 */
class UserService {
  /**
   * Récupère un utilisateur par son ID avec validation
   * 
   * @param id - L'identifiant unique de l'utilisateur
   * @returns Promise qui résout vers Result<User, AppError>
   * 
   * @throws Jamais - utilise le pattern Result pour les erreurs
   * 
   * @example
   * ```typescript
   * const result = await userService.getUserById('user-123');
   * if (result.success) {
   *   console.log(`Utilisateur: ${result.data.name}`);
   * } else {
   *   console.error(`Erreur: ${result.error.message}`);
   * }
   * ```
   */
  async getUserById(id: string): Promise<Result<User, AppError>> {
    // Validation de l'ID
    const idValidation = this.validateUserId(id);
    if (!idValidation.success) {
      return idValidation;
    }
    
    // Récupération sécurisée
    return safeApiCall(async () => {
      const user = await this.repository.findById(idValidation.data);
      if (!user) {
        throw new AppError(`User not found: ${id}`, 404);
      }
      return user;
    });
  }

  /**
   * Valide un ID utilisateur
   * @internal
   */
  private validateUserId(id: string): Result<string, ValidationError> {
    if (!id || id.trim().length === 0) {
      return {
        success: false,
        error: new ValidationError('User ID is required', 'id')
      };
    }
    
    return { success: true, data: id.trim() };
  }
}
```

### 💬 Commentaires de Code

```typescript
// @ai-refactor: Fonction extraite pour améliorer la lisibilité
function sanitizeUserInput(input: string): string {
  // Suppression des caractères de contrôle dangereux
  return input
    .replace(/[\x00-\x1F\x7F]/g, '') // Caractères de contrôle
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Scripts
    .trim();
}

// TODO: Implémenter la validation des mots de passe forts
// FIXME: Gérer le cas où l'utilisateur n'existe pas
// SECURITY: Vérifier que l'input ne contient pas de code malveillant
```

## 🏗️ Patterns Architecturaux

### 🎯 Repository Pattern

```typescript
// ✅ Interface Repository
interface UserRepository {
  findById(id: string): Promise<Result<User | null, AppError>>;
  findByEmail(email: string): Promise<Result<User | null, AppError>>;
  create(userData: CreateUserDTO): Promise<Result<User, AppError>>;
  update(id: string, userData: UpdateUserDTO): Promise<Result<User, AppError>>;
  delete(id: string): Promise<Result<void, AppError>>;
}

// ✅ Implémentation Repository
class DatabaseUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<User | null, AppError>> {
    return safeApiCall(async () => {
      const user = await this.db.users.findUnique({ where: { id } });
      return user;
    });
  }

  async create(userData: CreateUserDTO): Promise<Result<User, AppError>> {
    // Validation des données
    const validation = this.validateCreateData(userData);
    if (!validation.success) {
      return validation;
    }

    return safeApiCall(async () => {
      const user = await this.db.users.create({
        data: {
          ...validation.data,
          id: generateId(),
          createdAt: new Date()
        }
      });
      return user;
    });
  }

  private validateCreateData(
    data: CreateUserDTO
  ): Result<CreateUserDTO, ValidationError> {
    // Validation de l'email
    const emailResult = validateEmail(data.email);
    if (!emailResult.success) {
      return emailResult;
    }

    // Validation du nom
    if (!data.name || data.name.trim().length < 2) {
      return {
        success: false,
        error: new ValidationError('Name must be at least 2 characters', 'name')
      };
    }

    return { success: true, data };
  }
}
```

### 🎨 DTO Pattern

```typescript
// ✅ DTOs avec validation intégrée
interface CreateUserDTO {
  readonly name: string;
  readonly email: string;
  readonly age?: number;
}

interface UpdateUserDTO {
  readonly name?: string;
  readonly email?: string;
  readonly age?: number;
}

// ✅ Factory pour DTOs validés
class UserDTOFactory {
  static createUser(data: unknown): Result<CreateUserDTO, ValidationError> {
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        error: new ValidationError('Invalid data format')
      };
    }

    const obj = data as Record<string, unknown>;

    // Validation du nom
    if (typeof obj.name !== 'string' || obj.name.trim().length < 2) {
      return {
        success: false,
        error: new ValidationError('Name is required and must be at least 2 characters', 'name')
      };
    }

    // Validation de l'email
    const emailResult = validateEmail(obj.email);
    if (!emailResult.success) {
      return emailResult;
    }

    // Validation de l'âge (optionnel)
    if (obj.age !== undefined) {
      if (typeof obj.age !== 'number' || obj.age < 0 || obj.age > 150) {
        return {
          success: false,
          error: new ValidationError('Age must be a number between 0 and 150', 'age')
        };
      }
    }

    return {
      success: true,
      data: {
        name: obj.name.trim(),
        email: emailResult.data,
        age: obj.age as number | undefined
      }
    };
  }
}
```

## 📋 Checklist des Bonnes Pratiques

### ✅ Nommage et Structure
- [ ] PascalCase pour classes, interfaces, types
- [ ] camelCase pour variables et fonctions
- [ ] SCREAMING_SNAKE_CASE pour constantes
- [ ] Noms descriptifs et explicites

### ✅ Types et Sécurité
- [ ] Aucun type `any` utilisé
- [ ] Interfaces pour les objets complexes
- [ ] Types union pour les énumérations
- [ ] Validation de tous les inputs utilisateur

### ✅ Gestion d'Erreurs
- [ ] Pattern Result<T, E> implémenté
- [ ] Classes d'erreur personnalisées
- [ ] Pas de throw non géré
- [ ] Messages d'erreur explicites

### ✅ Documentation
- [ ] JSDoc pour toutes les fonctions publiques
- [ ] Exemples d'utilisation fournis
- [ ] Commentaires pour la logique complexe
- [ ] Types de retour documentés

## 🔗 Navigation

- **Précédent :** [02-configuration.md](./02-configuration.md) - Configuration et outils
- **Suivant :** [04-security-patterns.md](./04-security-patterns.md) - Patterns de sécurité
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Bonnes Pratiques de Développement TypeScript*
