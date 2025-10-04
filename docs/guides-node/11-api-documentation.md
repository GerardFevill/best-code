# 📚 Documentation API Automatique

> Guide complet pour la génération automatique de documentation Swagger/OpenAPI avec TypeScript et patterns BestCode.

## 🎯 Objectifs de la Documentation API

### 📋 Principes BestCode pour Documentation API
- **🔄 Génération automatique** : Documentation synchronisée avec le code
- **🔒 Sécurité intégrée** : Schémas de validation documentés
- **🎯 Types stricts** : Cohérence TypeScript → OpenAPI
- **📊 Exemples vivants** : Documentation interactive et testable
- **🧪 Tests intégrés** : Validation des schémas dans les tests

## 🏗️ Architecture Documentation API

### 📁 Structure Recommandée

```
src/
├── controllers/                  # Contrôleurs avec annotations
│   ├── user.controller.ts       # @swagger annotations
│   └── auth.controller.ts
├── models/                       # Modèles avec schémas OpenAPI
│   ├── user.model.ts            # Interface + Schema OpenAPI
│   └── dto/                     # DTOs documentés
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── swagger/                      # Configuration Swagger
│   ├── swagger.config.ts        # Configuration principale
│   ├── schemas/                 # Schémas OpenAPI réutilisables
│   │   ├── common.schemas.ts    # Schémas communs (Error, Result)
│   │   ├── user.schemas.ts      # Schémas utilisateur
│   │   └── auth.schemas.ts      # Schémas authentification
│   ├── decorators/              # Décorateurs personnalisés
│   │   ├── api-response.decorator.ts
│   │   └── api-validation.decorator.ts
│   └── middleware/              # Middleware Swagger
│       └── swagger.middleware.ts
└── docs/                        # Documentation générée
    ├── swagger.json             # Spécification OpenAPI
    ├── swagger.yaml             # Version YAML
    └── api-examples/            # Exemples de requêtes
```

## ⚙️ Configuration Swagger/OpenAPI

### 🔧 Installation des Dépendances

```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  },
  "devDependencies": {
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6",
    "swagger-typescript-api": "^13.0.3"
  }
}
```

### 📝 Configuration Principale

```typescript
// src/swagger/swagger.config.ts
// @ai-refactor: Swagger configuration following BestCode patterns

import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

/**
 * Configuration Swagger suivant les standards BestCode
 */
export class SwaggerConfig {
  private static readonly API_VERSION = '1.0.0';
  private static readonly API_TITLE = 'BestCode API';
  private static readonly API_DESCRIPTION = 'API REST sécurisée avec patterns BestCode';

  /**
   * Génère la configuration Swagger complète
   */
  static generateConfig(): swaggerJsdoc.Options {
    const definition: SwaggerDefinition = {
      openapi: '3.0.0',
      info: {
        title: this.API_TITLE,
        version: this.API_VERSION,
        description: this.API_DESCRIPTION,
        contact: {
          name: 'BestCode Team',
          email: 'support@bestcode.dev'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: process.env.API_BASE_URL || 'http://localhost:3000',
          description: 'Serveur de développement'
        },
        {
          url: 'https://api.bestcode.dev',
          description: 'Serveur de production'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        },
        schemas: {
          // Schémas BestCode standards
          Result: {
            type: 'object',
            oneOf: [
              {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { type: 'object' }
                },
                required: ['success', 'data']
              },
              {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: { $ref: '#/components/schemas/Error' }
                },
                required: ['success', 'error']
              }
            ]
          },
          Error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Validation failed' },
              statusCode: { type: 'number', example: 400 },
              field: { type: 'string', example: 'email' }
            },
            required: ['message']
          },
          ValidationError: {
            allOf: [
              { $ref: '#/components/schemas/Error' },
              {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' }
                }
              }
            ]
          }
        }
      },
      security: [
        { bearerAuth: [] }
      ]
    };

    return {
      definition,
      apis: [
        './src/controllers/*.ts',
        './src/models/*.ts',
        './src/swagger/schemas/*.ts'
      ]
    };
  }

  /**
   * Génère la spécification OpenAPI
   */
  static generateSpec(): object {
    const config = this.generateConfig();
    return swaggerJsdoc(config);
  }
}
```

## 🎯 Décorateurs et Annotations

### 🏷️ Décorateurs Personnalisés BestCode

```typescript
// src/swagger/decorators/api-response.decorator.ts
// @ai-refactor: Custom decorators for BestCode patterns

import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

/**
 * Décorateur pour réponses Result<T, E> BestCode
 */
export function ApiResultResponse<T>(
  status: number,
  description: string,
  dataType?: any,
  options?: Partial<ApiResponseOptions>
) {
  return ApiResponse({
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: dataType ? { $ref: `#/components/schemas/${dataType.name}` } : { type: 'object' }
      },
      required: ['success', 'data']
    },
    ...options
  });
}

/**
 * Décorateur pour erreurs de validation BestCode
 */
export function ApiValidationErrorResponse(description: string = 'Erreur de validation') {
  return ApiResponse({
    status: 400,
    description,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Validation failed' },
            field: { type: 'string', example: 'email' },
            statusCode: { type: 'number', example: 400 }
          }
        }
      }
    }
  });
}

/**
 * Décorateur pour erreurs d'authentification
 */
export function ApiAuthErrorResponse() {
  return ApiResponse({
    status: 401,
    description: 'Non autorisé',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Token JWT invalide' },
            statusCode: { type: 'number', example: 401 }
          }
        }
      }
    }
  });
}
```

### 📝 Exemple de Contrôleur Documenté

```typescript
// src/controllers/user.controller.ts
// @ai-refactor: Controller with comprehensive Swagger documentation

import { Request, Response } from 'express';
import { UserService } from '@/services/UserService';
import { CreateUserDTO, UpdateUserDTO } from '@/models/dto';
import { ApiResultResponse, ApiValidationErrorResponse, ApiAuthErrorResponse } from '@/swagger/decorators';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs avec patterns BestCode
 */
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Créer un nouvel utilisateur
   *     description: Crée un utilisateur avec validation complète et sécurisation
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDTO'
   *           examples:
   *             validUser:
   *               summary: Utilisateur valide
   *               value:
   *                 name: "John Doe"
   *                 email: "john@example.com"
   *                 age: 30
   *             minimalUser:
   *               summary: Utilisateur minimal
   *               value:
   *                 name: "Jane Doe"
   *                 email: "jane@example.com"
   *     responses:
   *       201:
   *         description: Utilisateur créé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Erreur de validation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidationErrorResponse'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       409:
   *         description: Email déjà existant
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "Email already exists"
   *                     statusCode:
   *                       type: number
   *                       example: 409
   */
  @ApiResultResponse(201, 'Utilisateur créé', 'User')
  @ApiValidationErrorResponse()
  @ApiAuthErrorResponse()
  async createUser(req: Request, res: Response): Promise<void> {
    const result = await this.userService.createUser(req.body);
    
    if (!result.success) {
      const statusCode = result.error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: {
          message: result.error.message,
          statusCode,
          ...(result.error.field && { field: result.error.field })
        }
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: result.data
    });
  }

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Récupérer un utilisateur par ID
   *     description: Récupère les détails d'un utilisateur avec validation sécurisée
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID unique de l'utilisateur
   *         schema:
   *           type: string
   *           pattern: '^[a-zA-Z0-9-_]+$'
   *           minLength: 1
   *           maxLength: 50
   *         example: "user-123"
   *     responses:
   *       200:
   *         description: Utilisateur trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       404:
   *         description: Utilisateur non trouvé
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: object
   *                   properties:
   *                     message:
   *                       type: string
   *                       example: "User not found"
   *                     statusCode:
   *                       type: number
   *                       example: 404
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.userService.getUserById(id);
    
    if (!result.success) {
      const statusCode = result.error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: {
          message: result.error.message,
          statusCode
        }
      });
      return;
    }

    if (!result.data) {
      res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          statusCode: 404
        }
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.data
    });
  }
}
```

## 📊 Schémas OpenAPI pour DTOs

### 🏗️ DTOs avec Validation et Documentation

```typescript
// src/models/dto/create-user.dto.ts
// @ai-refactor: DTO with OpenAPI schema and validation

import { IsEmail, IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDTO:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           pattern: '^[a-zA-ZÀ-ÿ\s''-]+$'
 *           description: Nom complet de l'utilisateur
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 254
 *           description: Adresse email unique
 *           example: "john.doe@example.com"
 *         age:
 *           type: integer
 *           minimum: 0
 *           maximum: 150
 *           description: Âge de l'utilisateur (optionnel)
 *           example: 30
 *       example:
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *         age: 30
 */
export class CreateUserDTO {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  readonly name: string;

  @IsEmail({}, { message: 'Format d\'email invalide' })
  @Length(1, 254, { message: 'L\'email ne peut pas dépasser 254 caractères' })
  readonly email: string;

  @IsOptional()
  @IsInt({ message: 'L\'âge doit être un nombre entier' })
  @Min(0, { message: 'L\'âge ne peut pas être négatif' })
  @Max(150, { message: 'L\'âge ne peut pas dépasser 150 ans' })
  readonly age?: number;
}
```

## 🚀 Middleware et Intégration

### 🔧 Middleware Swagger

```typescript
// src/swagger/middleware/swagger.middleware.ts
// @ai-refactor: Swagger middleware with security and BestCode patterns

import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import { SwaggerConfig } from '../swagger.config';
import { SecureConfig } from '@/config/secure.config';

export class SwaggerMiddleware {
  /**
   * Configure Swagger UI avec sécurité
   */
  static setup(app: Application): void {
    const swaggerSpec = SwaggerConfig.generateSpec();
    
    // Configuration Swagger UI
    const swaggerOptions: swaggerUi.SwaggerUiOptions = {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #1976d2 }
      `,
      customSiteTitle: 'BestCode API Documentation',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        docExpansion: 'list'
      }
    };

    // Routes Swagger
    app.get('/api-docs/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    // Interface Swagger UI
    if (process.env.NODE_ENV !== 'production' || SecureConfig.getBoolean('ENABLE_SWAGGER_PROD')) {
      app.use('/api-docs', swaggerUi.serve);
      app.get('/api-docs', swaggerUi.setup(swaggerSpec, swaggerOptions));
      
      console.log('📚 Swagger UI disponible sur: http://localhost:3000/api-docs');
    }

    // Redirection pour faciliter l'accès
    app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });
  }

  /**
   * Génère les fichiers de documentation statiques
   */
  static async generateStaticDocs(): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const swaggerSpec = SwaggerConfig.generateSpec();
    const docsDir = path.join(process.cwd(), 'docs');
    
    // Créer le dossier docs s'il n'existe pas
    await fs.mkdir(docsDir, { recursive: true });
    
    // Générer swagger.json
    await fs.writeFile(
      path.join(docsDir, 'swagger.json'),
      JSON.stringify(swaggerSpec, null, 2)
    );
    
    // Générer swagger.yaml
    const yaml = await import('yaml');
    await fs.writeFile(
      path.join(docsDir, 'swagger.yaml'),
      yaml.stringify(swaggerSpec)
    );
    
    console.log('📄 Documentation statique générée dans /docs');
  }
}
```

## 🧪 Tests de Documentation

### ✅ Tests de Validation des Schémas

```typescript
// tests/integration/swagger.test.ts
// @ai-refactor: Tests for Swagger documentation validation

import request from 'supertest';
import { app } from '@/index';
import { SwaggerConfig } from '@/swagger/swagger.config';

describe('Swagger Documentation', () => {
  describe('Swagger Specification', () => {
    it('should generate valid OpenAPI specification', () => {
      const spec = SwaggerConfig.generateSpec();
      
      expect(spec).toHaveProperty('openapi', '3.0.0');
      expect(spec).toHaveProperty('info');
      expect(spec.info).toHaveProperty('title');
      expect(spec.info).toHaveProperty('version');
      expect(spec).toHaveProperty('paths');
      expect(spec).toHaveProperty('components');
    });

    it('should include BestCode standard schemas', () => {
      const spec = SwaggerConfig.generateSpec();
      
      expect(spec.components.schemas).toHaveProperty('Result');
      expect(spec.components.schemas).toHaveProperty('Error');
      expect(spec.components.schemas).toHaveProperty('ValidationError');
    });

    it('should include security schemes', () => {
      const spec = SwaggerConfig.generateSpec();
      
      expect(spec.components.securitySchemes).toHaveProperty('bearerAuth');
      expect(spec.components.securitySchemes).toHaveProperty('apiKey');
    });
  });

  describe('Swagger UI Endpoints', () => {
    it('should serve swagger.json', async () => {
      const response = await request(app)
        .get('/api-docs/swagger.json')
        .expect(200);
      
      expect(response.headers['content-type']).toContain('application/json');
      expect(response.body).toHaveProperty('openapi');
    });

    it('should serve Swagger UI in development', async () => {
      if (process.env.NODE_ENV !== 'production') {
        await request(app)
          .get('/api-docs')
          .expect(200);
      }
    });

    it('should redirect /docs to /api-docs', async () => {
      await request(app)
        .get('/docs')
        .expect(302)
        .expect('Location', '/api-docs');
    });
  });

  describe('API Endpoints Documentation', () => {
    it('should document all user endpoints', () => {
      const spec = SwaggerConfig.generateSpec();
      
      expect(spec.paths).toHaveProperty('/users');
      expect(spec.paths).toHaveProperty('/users/{id}');
      
      // Vérifier les méthodes HTTP
      expect(spec.paths['/users']).toHaveProperty('post');
      expect(spec.paths['/users/{id}']).toHaveProperty('get');
    });

    it('should include proper response schemas', () => {
      const spec = SwaggerConfig.generateSpec();
      const userCreateEndpoint = spec.paths['/users'].post;
      
      expect(userCreateEndpoint.responses).toHaveProperty('201');
      expect(userCreateEndpoint.responses).toHaveProperty('400');
      expect(userCreateEndpoint.responses).toHaveProperty('401');
    });
  });
});
```

## 📋 Scripts de Génération

### 🔧 Scripts Package.json

```json
{
  "scripts": {
    "docs:generate": "ts-node src/swagger/scripts/generate-docs.ts",
    "docs:validate": "swagger-codegen validate -i docs/swagger.json",
    "docs:serve": "swagger-ui-serve docs/swagger.json",
    "docs:export": "swagger-codegen generate -i docs/swagger.json -l html2 -o docs/html",
    "postbuild": "npm run docs:generate"
  }
}
```

### 🎯 Script de Génération

```typescript
// src/swagger/scripts/generate-docs.ts
// @ai-refactor: Documentation generation script

import { SwaggerMiddleware } from '../middleware/swagger.middleware';
import { SwaggerConfig } from '../swagger.config';

async function generateDocumentation(): Promise<void> {
  try {
    console.log('🚀 Génération de la documentation API...');
    
    // Générer les fichiers statiques
    await SwaggerMiddleware.generateStaticDocs();
    
    // Valider la spécification
    const spec = SwaggerConfig.generateSpec();
    console.log(`✅ Spécification OpenAPI valide (${Object.keys(spec.paths).length} endpoints)`);
    
    console.log('📚 Documentation générée avec succès !');
    console.log('   - docs/swagger.json');
    console.log('   - docs/swagger.yaml');
    console.log('   - Interface: http://localhost:3000/api-docs');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  generateDocumentation();
}
```

## 📋 Checklist Documentation API

### ✅ Configuration
- [ ] Swagger-jsdoc et swagger-ui-express installés
- [ ] Configuration OpenAPI 3.0 complète
- [ ] Schémas BestCode (Result<T,E>, Error) définis
- [ ] Sécurité JWT/API Key configurée

### ✅ Documentation des Endpoints
- [ ] Tous les contrôleurs documentés avec @swagger
- [ ] Exemples de requêtes et réponses fournis
- [ ] Codes d'erreur documentés (400, 401, 404, 500)
- [ ] Paramètres et corps de requête validés

### ✅ Schémas et DTOs
- [ ] DTOs avec validation class-validator
- [ ] Schémas OpenAPI synchronisés avec TypeScript
- [ ] Exemples de données dans les schémas
- [ ] Patterns de validation documentés

### ✅ Tests et Validation
- [ ] Tests de génération de spécification
- [ ] Validation des schémas OpenAPI
- [ ] Tests des endpoints de documentation
- [ ] Intégration dans le pipeline CI/CD

## 🔗 Navigation

- **Précédent :** [10-ai-examples.md](./10-ai-examples.md) - Exemples concrets pour IA
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Documentation API Automatique avec Swagger/OpenAPI*
