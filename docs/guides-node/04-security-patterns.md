# 🛡️ Patterns de Sécurité BestCode

> Guide complet des pratiques de sécurité, validation d'entrées, sanitisation et protection contre les vulnérabilités.

## 🚨 Interdictions Absolues

### ❌ Code Dangereux à Éviter

```typescript
// ❌ JAMAIS utiliser - Exécution de code dynamique
eval(userInput);                    
new Function(userInput)();          
setTimeout(userInput, 1000);        // Avec string
setInterval(userInput, 1000);       // Avec string

// ❌ JAMAIS utiliser - Accès direct aux variables d'environnement
const secret = process.env.SECRET;  // Sans fallback sécurisé
const config = process.env;         // Exposition complète

// ❌ JAMAIS utiliser - Types non sécurisés
const users: any[] = [];            // Type any
function doEverything(data: any) {} // Paramètre any

// ❌ JAMAIS utiliser - Requêtes SQL non paramétrées
const query = `SELECT * FROM users WHERE id = ${userId}`;
```

### ✅ Alternatives Sécurisées

```typescript
// ✅ TOUJOURS utiliser - Parsing sécurisé
function parseUserInput(input: string): Result<ParsedData, ValidationError> {
  try {
    const parsed = JSON.parse(input);
    return validateParsedData(parsed);
  } catch (error) {
    return {
      success: false,
      error: new ValidationError('Invalid JSON format')
    };
  }
}

// ✅ TOUJOURS utiliser - Configuration centralisée avec fallbacks
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

// ✅ TOUJOURS utiliser - Types stricts
const users: User[] = [];
function processUserData(data: CreateUserDTO): Result<User, ValidationError> {}

// ✅ TOUJOURS utiliser - Requêtes paramétrées
const query = 'SELECT * FROM users WHERE id = ?';
const result = await db.query(query, [userId]);
```

## 🔍 Validation et Sanitisation

### 🛡️ Validation d'Entrées Complète

```typescript
// ✅ Validation multi-niveaux
class InputValidator {
  /**
   * Valide et sanitise une chaîne de caractères
   */
  static validateString(
    input: unknown,
    options: {
      maxLength?: number;
      minLength?: number;
      pattern?: RegExp;
      allowEmpty?: boolean;
    } = {}
  ): Result<string, ValidationError> {
    // Validation de type
    if (typeof input !== 'string') {
      return {
        success: false,
        error: new ValidationError('Input must be a string', 'type')
      };
    }

    // Sanitisation de base
    const sanitized = input
      .replace(/[\x00-\x1F\x7F]/g, '') // Caractères de contrôle
      .trim();

    // Validation de longueur
    const minLen = options.minLength ?? 0;
    const maxLen = options.maxLength ?? 1000;

    if (!options.allowEmpty && sanitized.length === 0) {
      return {
        success: false,
        error: new ValidationError('Input cannot be empty', 'required')
      };
    }

    if (sanitized.length < minLen) {
      return {
        success: false,
        error: new ValidationError(
          `Input must be at least ${minLen} characters`,
          'minLength'
        )
      };
    }

    if (sanitized.length > maxLen) {
      return {
        success: false,
        error: new ValidationError(
          `Input exceeds maximum length of ${maxLen}`,
          'maxLength'
        )
      };
    }

    // Validation de pattern
    if (options.pattern && !options.pattern.test(sanitized)) {
      return {
        success: false,
        error: new ValidationError('Input format is invalid', 'pattern')
      };
    }

    return { success: true, data: sanitized };
  }

  /**
   * Valide un email avec sanitisation
   */
  static validateEmail(email: unknown): Result<string, ValidationError> {
    const stringResult = this.validateString(email, {
      maxLength: 254, // RFC 5321
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    });

    if (!stringResult.success) {
      return stringResult;
    }

    // Normalisation de l'email
    const normalizedEmail = stringResult.data.toLowerCase();

    // Validation avancée
    const parts = normalizedEmail.split('@');
    if (parts.length !== 2) {
      return {
        success: false,
        error: new ValidationError('Invalid email format', 'format')
      };
    }

    const [localPart, domain] = parts;
    
    // Validation de la partie locale
    if (localPart.length > 64) {
      return {
        success: false,
        error: new ValidationError('Email local part too long', 'localPart')
      };
    }

    // Validation du domaine
    if (domain.length > 253) {
      return {
        success: false,
        error: new ValidationError('Email domain too long', 'domain')
      };
    }

    return { success: true, data: normalizedEmail };
  }

  /**
   * Valide un nom avec règles spécifiques
   */
  static validateName(name: unknown): Result<string, ValidationError> {
    const stringResult = this.validateString(name, {
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/
    });

    if (!stringResult.success) {
      return {
        success: false,
        error: new ValidationError(
          'Name can only contain letters, spaces, hyphens, and apostrophes',
          'format'
        )
      };
    }

    return stringResult;
  }
}
```

### 🧹 Sanitisation Avancée

```typescript
// ✅ Sanitisation HTML et XSS
class Sanitizer {
  /**
   * Sanitise le HTML pour prévenir les attaques XSS
   */
  static sanitizeHtml(input: string): string {
    return input
      // Supprime les balises script
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Supprime les attributs on*
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
      // Supprime javascript: dans les liens
      .replace(/javascript:/gi, '')
      // Supprime les balises dangereuses
      .replace(/<(iframe|object|embed|form|input|textarea|script|style)[^>]*>/gi, '')
      // Encode les caractères HTML restants
      .replace(/[<>'"&]/g, (char) => {
        const htmlEntities: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return htmlEntities[char] || char;
      });
  }

  /**
   * Sanitise une URL
   */
  static sanitizeUrl(url: string): Result<string, ValidationError> {
    try {
      const urlObj = new URL(url);
      
      // Protocoles autorisés
      const allowedProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return {
          success: false,
          error: new ValidationError('Invalid URL protocol', 'protocol')
        };
      }

      // Supprime les fragments dangereux
      urlObj.hash = '';
      
      return { success: true, data: urlObj.toString() };
    } catch (error) {
      return {
        success: false,
        error: new ValidationError('Invalid URL format', 'format')
      };
    }
  }

  /**
   * Sanitise les données JSON
   */
  static sanitizeJson(data: unknown): unknown {
    if (typeof data === 'string') {
      return this.sanitizeHtml(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJson(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        // Sanitise la clé
        const cleanKey = key.replace(/[^\w-]/g, '');
        if (cleanKey.length > 0) {
          sanitized[cleanKey] = this.sanitizeJson(value);
        }
      }
      return sanitized;
    }
    
    return data;
  }
}
```

## 🔐 Gestion Sécurisée des Secrets

### 🗝️ Configuration des Secrets

```typescript
// ✅ Gestionnaire de secrets sécurisé
class SecretManager {
  private static secrets = new Map<string, string>();

  /**
   * Initialise les secrets depuis les variables d'environnement
   */
  static initialize(): void {
    const requiredSecrets = [
      'DATABASE_URL',
      'JWT_SECRET',
      'API_KEY',
      'ENCRYPTION_KEY'
    ];

    for (const secretName of requiredSecrets) {
      const value = process.env[secretName];
      
      if (!value) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error(`Required secret ${secretName} is missing`);
        }
        // Valeurs de développement sécurisées
        this.secrets.set(secretName, this.generateDevSecret(secretName));
      } else {
        this.secrets.set(secretName, value);
      }
    }
  }

  /**
   * Récupère un secret de manière sécurisée
   */
  static getSecret(name: string): string {
    const secret = this.secrets.get(name);
    if (!secret) {
      throw new Error(`Secret ${name} not found`);
    }
    return secret;
  }

  /**
   * Génère des secrets de développement
   */
  private static generateDevSecret(name: string): string {
    const devSecrets: Record<string, string> = {
      'DATABASE_URL': 'postgresql://dev:dev@localhost:5432/dev_db',
      'JWT_SECRET': 'dev-jwt-secret-key-not-for-production',
      'API_KEY': 'dev-api-key-12345',
      'ENCRYPTION_KEY': 'dev-encryption-key-32-chars-long'
    };
    
    return devSecrets[name] || `dev-${name.toLowerCase()}-secret`;
  }

  /**
   * Masque un secret pour les logs
   */
  static maskSecret(secret: string): string {
    if (secret.length <= 8) {
      return '*'.repeat(secret.length);
    }
    return secret.slice(0, 2) + '*'.repeat(secret.length - 4) + secret.slice(-2);
  }
}
```

### 🔒 Chiffrement et Hachage

```typescript
// ✅ Utilitaires de chiffrement sécurisé
import crypto from 'crypto';

class CryptoUtils {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  /**
   * Chiffre une chaîne de caractères
   */
  static encrypt(text: string, key: string): Result<string, Error> {
    try {
      const keyBuffer = crypto.scryptSync(key, 'salt', this.KEY_LENGTH);
      const iv = crypto.randomBytes(this.IV_LENGTH);
      
      const cipher = crypto.createCipher(this.ALGORITHM, keyBuffer, { iv });
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      // Combine IV + tag + encrypted data
      const result = iv.toString('hex') + tag.toString('hex') + encrypted;
      
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      };
    }
  }

  /**
   * Déchiffre une chaîne de caractères
   */
  static decrypt(encryptedData: string, key: string): Result<string, Error> {
    try {
      const keyBuffer = crypto.scryptSync(key, 'salt', this.KEY_LENGTH);
      
      // Extract IV, tag, and encrypted data
      const iv = Buffer.from(encryptedData.slice(0, this.IV_LENGTH * 2), 'hex');
      const tag = Buffer.from(encryptedData.slice(this.IV_LENGTH * 2, (this.IV_LENGTH + this.TAG_LENGTH) * 2), 'hex');
      const encrypted = encryptedData.slice((this.IV_LENGTH + this.TAG_LENGTH) * 2);
      
      const decipher = crypto.createDecipher(this.ALGORITHM, keyBuffer, { iv });
      decipher.setAuthTag(tag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return { success: true, data: decrypted };
    } catch (error) {
      return {
        success: false,
        error: new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      };
    }
  }

  /**
   * Hache un mot de passe avec salt
   */
  static async hashPassword(password: string): Promise<Result<string, Error>> {
    try {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      
      return { success: true, data: `${salt}:${hash}` };
    } catch (error) {
      return {
        success: false,
        error: new Error(`Password hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      };
    }
  }

  /**
   * Vérifie un mot de passe
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<Result<boolean, Error>> {
    try {
      const [salt, hash] = hashedPassword.split(':');
      const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
      
      const isValid = crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
      
      return { success: true, data: isValid };
    } catch (error) {
      return {
        success: false,
        error: new Error(`Password verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      };
    }
  }
}
```

## 🛡️ Protection Middleware

### 🚫 Rate Limiting et Protection

```typescript
// ✅ Middleware de sécurité pour Express
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

class SecurityMiddleware {
  /**
   * Configuration de rate limiting
   */
  static createRateLimit(options: {
    windowMs?: number;
    max?: number;
    message?: string;
  } = {}) {
    return rateLimit({
      windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
      max: options.max || 100, // limite par IP
      message: options.message || 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  /**
   * Configuration Helmet pour sécurité HTTP
   */
  static createHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  /**
   * Middleware de validation des entrées
   */
  static validateInput<T>(
    validator: (data: unknown) => Result<T, ValidationError>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = validator(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.error.message,
          field: result.error.field
        });
      }
      
      req.body = result.data;
      next();
    };
  }
}
```

## 📋 Checklist de Sécurité

### ✅ Validation et Sanitisation
- [ ] Tous les inputs utilisateur sont validés
- [ ] Sanitisation HTML pour prévenir XSS
- [ ] Validation des URLs et emails
- [ ] Limitation de taille des données

### ✅ Gestion des Secrets
- [ ] Variables d'environnement sécurisées
- [ ] Pas de secrets en dur dans le code
- [ ] Chiffrement des données sensibles
- [ ] Hachage sécurisé des mots de passe

### ✅ Protection HTTP
- [ ] Helmet configuré correctement
- [ ] Rate limiting implémenté
- [ ] CORS configuré restrictif
- [ ] Headers de sécurité présents

### ✅ Code Sécurisé
- [ ] Aucun eval() ou Function()
- [ ] Requêtes SQL paramétrées
- [ ] Types TypeScript stricts
- [ ] Gestion d'erreurs sécurisée

## 🔗 Navigation

- **Précédent :** [03-coding-practices.md](./03-coding-practices.md) - Bonnes pratiques de codage
- **Suivant :** [05-smart-refactor.md](./05-smart-refactor.md) - Méthodologie SmartRefactor™
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Sécurité et Protection des Applications*
