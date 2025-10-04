# 📘 Lexique pour Agents IA

> Terminologie standardisée, patterns obligatoires et checklist de validation pour assistants IA développant avec BestCode.

## 🎯 Objectif pour les IA

Ce lexique définit la terminologie exacte et les patterns que tout agent IA doit utiliser lors du développement, refactoring ou révision de projets Node.js TypeScript suivant BestCode.

### 🤖 **Utilisation Obligatoire**
- **Référence constante** : Consulter ce lexique avant toute suggestion de code
- **Terminologie exacte** : Utiliser les termes définis, pas de synonymes
- **Patterns imposés** : Appliquer les patterns spécifiés systématiquement
- **Validation systématique** : Vérifier chaque checklist avant proposition

## 📚 Terminologie Standard BestCode

### 🏗️ **Architecture et Structure**

| Terme | Définition | Usage IA | Exemple |
|-------|------------|----------|---------|
| `@bestcode/core` | Cœur des outils IA (types, logique fonctionnelle) | Référence pour patterns recommandés | `import { Result } from '@bestcode/core'` |
| `atomic commit` | Modification isolée ne traitant qu'un seul comportement | **Obligatoire** pour toute suggestion IA | `refactor(user): extract email validation` |
| `refactor` | Transformation interne sans changement de comportement | Doit inclure `// @ai-refactor:` | `// @ai-refactor: Extract method for clarity` |
| `sanitization` | Nettoyage des entrées utilisateurs contre XSS/Injection | **Requis** pour tout input utilisateur | `const clean = sanitizeHtml(userInput)` |
| `Result<T, E>` | Type fonctionnel pour gestion d'erreurs sans exceptions | Alternative préférée aux `try/catch` | `Result<User, ValidationError>` |
| `DTO` | Data Transfer Object - objet de transfert de données | Pour validation et sérialisation | `CreateUserDTO`, `UpdateUserDTO` |
| `Repository Pattern` | Abstraction de la couche de données | Recommandé pour accès base de données | `UserRepository.findById()` |

### 🔒 **Sécurité et Validation**

| Terme | Définition | Usage IA | Exemple |
|-------|------------|----------|---------|
| `ValidationError` | Erreur de validation avec champ spécifique | Pour tous les échecs de validation | `new ValidationError('Invalid email', 'email')` |
| `input validation` | Vérification de format/type des données entrantes | **Obligatoire** avant traitement | `validateString(input, { maxLength: 100 })` |
| `sanitization` | Nettoyage des données dangereuses | **Requis** pour prévenir XSS/injection | `sanitizeHtml(userContent)` |
| `safe parsing` | Analyse sécurisée sans eval/Function | **Toujours** utiliser au lieu d'eval | `JSON.parse()` avec try/catch |
| `secure config` | Configuration avec fallbacks et validation | **Jamais** d'accès direct à process.env | `config.getSecret('API_KEY')` |

### 🧪 **Tests et Qualité**

| Terme | Définition | Usage IA | Exemple |
|-------|------------|----------|---------|
| `unit test` | Test d'une fonction/méthode isolée | **Obligatoire** pour nouveau code | `describe('validateEmail')` |
| `integration test` | Test de plusieurs composants ensemble | **Requis** pour refactoring majeur | `test('user creation flow')` |
| `regression test` | Test pour éviter la réintroduction de bugs | **Obligatoire** avant refactoring | `test('maintains existing behavior')` |
| `coverage threshold` | Seuil minimum de couverture de tests | **80% minimum** requis | `coverageThreshold: { global: { lines: 80 } }` |
| `performance test` | Test de performance et benchmarking | **Recommandé** pour code critique | `expect(duration).toBeLessThan(100)` |

### 🔄 **Refactoring et Patterns**

| Terme | Définition | Usage IA | Exemple |
|-------|------------|----------|---------|
| `SmartRefactor™` | Méthodologie de refactoring en 5 phases | **Processus obligatoire** pour IA | Phase 1: Analyse → Phase 5: Documentation |
| `extract method` | Extraction d'une méthode pour réduire complexité | **Max 50 lignes** par commit | `// @ai-refactor: Extract validateEmail method` |
| `complexity reduction` | Réduction de la complexité cyclomatique | **Objectif <10** par fonction | `Complexity: 12 → 8` |
| `dependency injection` | Injection de dépendances pour testabilité | **Pattern recommandé** | `constructor(private repo: UserRepository)` |
| `immutable data` | Données non modifiables | **Préférer** readonly et const | `readonly id: string` |

## 🤖 Patterns IA Obligatoires

### 🎯 **Pattern Result<T, E> - Usage Systématique**

```typescript
// ✅ TOUJOURS proposer ce pattern
type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

// ✅ Fonction avec Result pattern
function validateEmail(email: unknown): Result<string, ValidationError> {
  if (typeof email !== 'string') {
    return { success: false, error: new ValidationError('Must be string', 'email') };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: new ValidationError('Invalid format', 'email') };
  }
  
  return { success: true, data: email.toLowerCase() };
}

// ❌ JAMAIS proposer try/catch pour validation
function validateEmailBad(email: string): string {
  if (!email.includes('@')) {
    throw new Error('Invalid email'); // ❌ Exception
  }
  return email;
}
```

### 🏗️ **Pattern Repository - Structure Standard**

```typescript
// ✅ TOUJOURS proposer cette structure
interface UserRepository {
  findById(id: string): Promise<Result<User | null, AppError>>;
  findByEmail(email: string): Promise<Result<User | null, AppError>>;
  create(userData: CreateUserDTO): Promise<Result<User, AppError>>;
  update(id: string, userData: UpdateUserDTO): Promise<Result<User, AppError>>;
  delete(id: string): Promise<Result<void, AppError>>;
}

// ✅ Implémentation avec validation
class DatabaseUserRepository implements UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<Result<User | null, AppError>> {
    // @ai-refactor: Always validate inputs first
    const idValidation = validateUserId(id);
    if (!idValidation.success) {
      return idValidation;
    }

    return safeApiCall(async () => {
      return this.db.users.findUnique({ where: { id: idValidation.data } });
    });
  }
}
```

### 🔒 **Pattern Validation - Sécurité Obligatoire**

```typescript
// ✅ TOUJOURS inclure ces validations
class InputValidator {
  static validateString(
    input: unknown,
    options: {
      maxLength?: number;
      minLength?: number;
      pattern?: RegExp;
      allowEmpty?: boolean;
    } = {}
  ): Result<string, ValidationError> {
    // 1. Type validation
    if (typeof input !== 'string') {
      return { success: false, error: new ValidationError('Must be string', 'type') };
    }

    // 2. Sanitization
    const sanitized = input.replace(/[\x00-\x1F\x7F]/g, '').trim();

    // 3. Length validation
    const minLen = options.minLength ?? 0;
    const maxLen = options.maxLength ?? 1000;

    if (!options.allowEmpty && sanitized.length === 0) {
      return { success: false, error: new ValidationError('Cannot be empty', 'required') };
    }

    if (sanitized.length < minLen || sanitized.length > maxLen) {
      return { success: false, error: new ValidationError('Invalid length', 'length') };
    }

    // 4. Pattern validation
    if (options.pattern && !options.pattern.test(sanitized)) {
      return { success: false, error: new ValidationError('Invalid format', 'pattern') };
    }

    return { success: true, data: sanitized };
  }
}
```

## 📋 Checklist IA Obligatoire

### ✅ **Avant Toute Suggestion de Code**

#### 🔒 **Sécurité (CRITIQUE)**
- [ ] **Pas d'`eval`** : Aucune exécution de code dynamique
- [ ] **Pas d'`any`** : Types TypeScript stricts uniquement
- [ ] **process.env sécurisé** : Toujours avec fallback et validation
- [ ] **Validation inputs** : Tous les paramètres utilisateur validés
- [ ] **Sanitisation** : Nettoyage des données dangereuses

#### 🎯 **Types et Structure (OBLIGATOIRE)**
- [ ] **TypeScript strict** : Configuration stricte respectée
- [ ] **Interfaces définies** : Pas d'objets non typés
- [ ] **Result<T,E> pattern** : Gestion d'erreurs fonctionnelle
- [ ] **Readonly approprié** : Immutabilité quand possible
- [ ] **JSDoc complet** : Documentation des fonctions publiques

#### 🧪 **Tests (REQUIS)**
- [ ] **Tests inclus** : Nouveau code = nouveaux tests
- [ ] **Couverture >80%** : Seuil minimum respecté
- [ ] **Tests de régression** : Pour refactoring structurel
- [ ] **Tests de sécurité** : Validation et sanitisation testées
- [ ] **Tests de performance** : Pour code critique

#### 🔄 **Refactoring (MÉTHODOLOGIE)**
- [ ] **Atomicité** : Une seule responsabilité par commit
- [ ] **Commentaire @ai-refactor** : Toujours présent
- [ ] **Max 50 lignes** : Limite stricte par changement
- [ ] **Patterns respectés** : Repository, DTO, Result<T,E>
- [ ] **Documentation mise à jour** : JSDoc et README

### ✅ **Messages de Commit Conventionnels**

```bash
# ✅ Format OBLIGATOIRE pour l'IA
<type>(scope): <description>

# Types autorisés :
feat:     # Nouvelle fonctionnalité
fix:      # Correction de bug
refactor: # Refactoring (pas de changement comportement)
test:     # Ajout/modification de tests
docs:     # Documentation
style:    # Formatage, pas de changement logique
perf:     # Amélioration performance
security: # Correction sécurité

# Exemples corrects :
refactor(user): extract email validation method

- Extract validateEmail from createUser method
- Reduce complexity from 12 to 8
- Add unit tests for extracted method
- No behavior change, only structure improvement

# @ai-refactor: UserService.validateEmail() extracted

feat(auth): add secure password hashing

- Implement bcrypt with salt rounds
- Add password strength validation
- Include security tests
- Update user creation flow

# @ai-refactor: Secure authentication implemented
```

## 🚨 Interdictions Absolues pour l'IA

### ❌ **Code Dangereux - JAMAIS Proposer**

```typescript
// ❌ INTERDIT - Exécution de code dynamique
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);

// ❌ INTERDIT - Accès direct aux variables d'environnement
const secret = process.env.SECRET;
const config = process.env;

// ❌ INTERDIT - Types non sécurisés
const users: any[] = [];
function doEverything(data: any) {}

// ❌ INTERDIT - Responsabilités multiples
function doEverything() {
  // Validation + Business logic + Database + Logging
  // = Trop de responsabilités
}

// ❌ INTERDIT - Concurrence non limitée
await Promise.all(heavyTasks); // Sans limitation
```

### ✅ **Alternatives Sécurisées - TOUJOURS Proposer**

```typescript
// ✅ OBLIGATOIRE - Parsing sécurisé
function parseUserInput(input: string): Result<ParsedData, ValidationError> {
  try {
    const parsed = JSON.parse(input);
    return validateParsedData(parsed);
  } catch (error) {
    return { success: false, error: new ValidationError('Invalid JSON') };
  }
}

// ✅ OBLIGATOIRE - Configuration centralisée
class SecureConfig {
  static getSecret(key: string): string {
    const value = process.env[key];
    if (!value) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Required environment variable ${key} is missing`);
      }
      return 'development-fallback';
    }
    return value;
  }
}

// ✅ OBLIGATOIRE - Types stricts
const users: User[] = [];
function processUserData(data: CreateUserDTO): Result<User, ValidationError> {}

// ✅ OBLIGATOIRE - Responsabilité unique
function validateEmail(email: string): Result<string, ValidationError> {
  // Une seule responsabilité : validation email
}

// ✅ OBLIGATOIRE - Concurrence limitée
import pLimit from 'p-limit';
const limit = pLimit(5);
const results = await Promise.all(tasks.map(task => limit(() => task)));
```

## 🎯 Templates de Code IA

### 📝 **Template Fonction avec Validation**

```typescript
// Template OBLIGATOIRE pour toute fonction IA
/**
 * [Description de la fonction]
 * 
 * @param input - [Description du paramètre]
 * @returns Result with [type] or ValidationError
 * 
 * @example
 * ```typescript
 * const result = functionName(input);
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
function functionName(input: unknown): Result<OutputType, ValidationError> {
  // @ai-refactor: [Description du refactoring si applicable]
  
  // 1. Validation d'entrée OBLIGATOIRE
  const validation = validateInput(input);
  if (!validation.success) {
    return validation;
  }

  // 2. Logique métier
  try {
    const result = processValidatedInput(validation.data);
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: new ValidationError('Processing failed', 'processing')
    };
  }
}
```

### 🏗️ **Template Service avec Repository**

```typescript
// Template OBLIGATOIRE pour service IA
export class ServiceName {
  constructor(
    private readonly repository: EntityRepository,
    private readonly logger: Logger
  ) {}

  /**
   * [Description de la méthode]
   */
  async methodName(input: InputDTO): Promise<Result<OutputType, AppError>> {
    // @ai-refactor: [Description si refactoring]
    
    // 1. Validation
    const validation = this.validateInput(input);
    if (!validation.success) {
      return validation;
    }

    // 2. Logique métier
    return safeApiCall(async () => {
      const result = await this.repository.operation(validation.data);
      this.logger.info('Operation completed', { input: validation.data });
      return result;
    });
  }

  private validateInput(input: InputDTO): Result<InputDTO, ValidationError> {
    // Validation spécifique au service
    return { success: true, data: input };
  }
}
```

## 🔗 Navigation

- **Précédent :** [08-cicd-pipeline.md](./08-cicd-pipeline.md) - Pipeline CI/CD
- **Suivant :** [10-ai-examples.md](./10-ai-examples.md) - Exemples concrets pour IA
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Lexique et Standards pour Agents IA*
