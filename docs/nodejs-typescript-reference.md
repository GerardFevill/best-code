# 📚 Guide de Référence Node.js + TypeScript

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-Best%20Practices-red?logo=security)](https://nodejs.org/en/security/)
[![AI-Friendly](https://img.shields.io/badge/AI-Friendly-purple?logo=openai)](https://github.com/GerardFevill/best-code)

> Guide complet des bonnes pratiques pour développer des applications Node.js en TypeScript robustes, sécurisées et maintenables.

## 🎯 Objectif pour les IA

Ce document est conçu pour guider toute intelligence artificielle assistant le développement logiciel, dans la génération, l'amélioration, ou la révision de projets Node.js + TypeScript.

### 🤖 L'IA doit :
- **Suivre** la structure et les conventions décrites
- **Favoriser** le refactoring sûr et progressif
- **Générer** des commits atomiques et documentés
- **Respecter** les bonnes pratiques de sécurité et de typage
- **Ne jamais modifier** plusieurs responsabilités en un seul commit
- **Proposer** des alternatives fonctionnelles (Result<T, E>, Option<T>)
- **Valider** la sécurité avant toute suggestion de code

### 🧑‍💻 Pour les développeurs :
Ces sections peuvent être modifiées selon les besoins métier, mais les suggestions IA doivent toujours se baser sur ces standards par défaut.

## 📋 Table des Matières

- [🏗️ Structure du Projet](#-structure-du-projet)
- [💻 Bonnes Pratiques de Codage](#-bonnes-pratiques-de-codage)
- [🧬 Refactoring IA Progressif](#-refactoring-ia-progressif-smartrefactor)
- [📦 Gestion des Dépendances](#-gestion-des-dépendances)
- [🛡️ Sécurité](#️-sécurité)
- [🔄 Compatibilité des Versions](#-compatibilité-des-versions)
- [🚀 Pipeline CI/CD](#-pipeline-cicd)
- [📘 Lexique pour les Agents IA](#-lexique-pour-les-agents-ia)
- [📖 Ressources](#-ressources)

---

## 🏗️ Structure du Projet

### 📁 Architectures Recommandées

#### 🌐 Serveur API/Web (Express, Fastify, etc.)

```
my-api-project/
├── src/                          # Code source TypeScript
│   ├── controllers/              # Contrôleurs HTTP
│   ├── services/                 # Logique métier
│   ├── models/                   # Modèles de données
│   ├── routes/                   # Définition des routes
│   ├── middleware/               # Middlewares Express
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Définitions de types
│   ├── config/                   # Configuration
│   ├── database/                 # Connexions DB, migrations
│   └── index.ts                  # Point d'entrée serveur
├── dist/                         # Code JavaScript compilé
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── ...                          # Fichiers de config
```

#### 📚 Librairie NPM

```
my-library/
├── src/                          # Code source TypeScript
│   ├── core/                     # Fonctionnalités principales
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Définitions de types exportées
│   └── index.ts                  # Point d'entrée public
├── lib/                          # Code compilé pour distribution
├── examples/                     # Exemples d'utilisation
├── docs/                         # Documentation API
├── tests/                        # Tests unitaires
├── benchmarks/                   # Tests de performance
├── package.json                  # Metadata NPM
├── tsconfig.json                 # Config TypeScript
├── tsconfig.build.json           # Config build production
├── rollup.config.js              # Bundling (optionnel)
└── README.md                     # Documentation utilisateur
```

#### 🛠️ CLI Tool

```
my-cli-tool/
├── src/                          # Code source TypeScript
│   ├── commands/                 # Commandes CLI
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Types
│   ├── templates/                # Templates de génération
│   ├── config/                   # Configuration
│   └── index.ts                  # Point d'entrée CLI
├── bin/                          # Scripts exécutables
├── dist/                         # Code compilé
├── tests/                        # Tests
├── examples/                     # Exemples d'usage
├── package.json                  # Scripts CLI dans "bin"
└── README.md                     # Documentation CLI
```

#### ⚡ Microservice

```
my-microservice/
├── src/                          # Code source TypeScript
│   ├── handlers/                 # Handlers d'événements
│   ├── services/                 # Services métier
│   ├── models/                   # Modèles de données
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Types
│   ├── config/                   # Configuration
│   ├── health/                   # Health checks
│   └── index.ts                  # Point d'entrée
├── docker/                       # Configuration Docker
├── k8s/                          # Manifests Kubernetes
├── tests/                        # Tests
├── Dockerfile                    # Image Docker
└── docker-compose.yml            # Développement local
```

#### 🔄 Worker/Background Jobs

```
my-worker/
├── src/                          # Code source TypeScript
│   ├── jobs/                     # Définitions des jobs
│   ├── processors/               # Processeurs de tâches
│   ├── queues/                   # Gestion des queues
│   ├── services/                 # Services métier
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Types
│   ├── config/                   # Configuration
│   └── index.ts                  # Point d'entrée worker
├── dist/                         # Code compilé
├── tests/                        # Tests
└── ...                          # Config files
```

#### 🏗️ Monorepo (Lerna/Nx)

```
my-monorepo/
├── packages/                     # Packages du monorepo
│   ├── core/                     # Package core
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── api/                      # Package API
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── cli/                      # Package CLI
│       ├── src/
│       ├── tests/
│       └── package.json
├── tools/                        # Outils partagés
├── docs/                         # Documentation globale
├── package.json                  # Root package.json
├── lerna.json                    # Configuration Lerna
├── nx.json                       # Configuration Nx
└── tsconfig.base.json            # Config TypeScript partagée
```

### 🎯 Versions Compatibles

| Composant | Version Recommandée | Version Minimale | Notes |
|-----------|-------------------|------------------|-------|
| **Node.js** | `20.x LTS` | `18.x` | Support à long terme |
| **TypeScript** | `5.3.x` | `5.0.x` | Dernières fonctionnalités |
| **npm** | `10.x` | `9.x` | Gestionnaire de packages |

### 📄 Configuration de Base

#### `package.json`
```json
{
  "name": "my-typescript-project",
  "version": "1.0.0",
  "description": "Description du projet",
  "main": "dist/index.js",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "type-check": "tsc --noEmit",
    "audit": "npm audit",
    "audit:fix": "npm audit fix",
    "clean": "rimraf dist",
    "prebuild": "npm run clean",
    "prestart": "npm run build"
  },
  "keywords": ["typescript", "node", "api"],
  "author": "Your Name",
  "license": "MIT"
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## 💻 Bonnes Pratiques de Codage

### 🎯 Conventions de Nommage

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

### 🔧 Types et Interfaces

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

// ✅ Génériques pour la réutilisabilité
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// ✅ Types utilitaires TypeScript
type CreateUserRequest = Omit<User, 'id' | 'createdAt'>;
type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>>;
```

### 🛠️ Gestion des Erreurs

```typescript
// ✅ Classes d'erreur personnalisées
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// ✅ Type Result pour la gestion d'erreurs fonctionnelle
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 📝 Documentation et Commentaires

```typescript
/**
 * Service pour gérer les utilisateurs
 * @example
 * ```typescript
 * const userService = new UserService();
 * const user = await userService.getUserById('123');
 * ```
 */
class UserService {
  /**
   * Récupère un utilisateur par son ID
   * @param id - L'identifiant unique de l'utilisateur
   * @returns Promise qui résout vers l'utilisateur ou null si non trouvé
   * @throws {ValidationError} Quand l'ID est invalide
   * @throws {AppError} Quand une erreur serveur survient
   */
  async getUserById(id: string): Promise<User | null> {
    if (!id || id.trim().length === 0) {
      throw new ValidationError('User ID is required');
    }
    
    // Implémentation...
    return null;
  }
}
```

> 🤖 **Pour l'IA :**
> Toujours proposer une fonction `Result<T, E>` en alternative aux blocs `try/catch` si le projet utilise une architecture fonctionnelle.

> 🧑‍💻 **Pour les développeurs :**
> Ces patterns peuvent être adaptés selon l'architecture choisie, mais l'IA doit proposer ces alternatives par défaut.

---

## 🧬 Refactoring IA Progressif (SmartRefactor™)

### 🎯 Méthodologie de Refactorisation

Les IA doivent suivre cette approche progressive pour tout refactoring :

#### 1. 🔍 Analyse Préalable
```typescript
// @ai-refactor: Identifier les responsabilités unitaires (SRP)
// Avant refactoring, analyser :
// - Une seule responsabilité par classe/fonction
// - Couplage faible entre modules
// - Cohésion forte à l'intérieur des modules
```

#### 2. 📋 Proposition de Diff Minimal
```typescript
// ❌ Éviter : Refactoring massif
class UserService {
  // 50 lignes de changements...
}

// ✅ Préférer : Changements atomiques
class UserService {
  // @ai-refactor: Extract method validateEmail
  private validateEmail(email: string): Result<string, ValidationError> {
    // Une seule responsabilité : validation email
  }
}
```

#### 3. 🧪 Tests Avant Refactorisation
```typescript
// ✅ L'IA doit TOUJOURS proposer des tests avant refactoring structurel
describe('UserService - Before Refactor', () => {
  it('should maintain existing behavior', () => {
    // Test du comportement actuel
  });
});

// Puis proposer le refactoring avec nouveaux tests
describe('UserService - After Refactor', () => {
  it('should validate email correctly', () => {
    // Test du nouveau comportement
  });
});
```

#### 4. 💬 Messages de Commit Conventionnels
```bash
# ✅ Format requis pour l'IA
refactor(user): extract email validation to separate method

- Extract validateEmail method from createUser
- Improve testability and single responsibility
- No behavior change, only structure improvement

# @ai-refactor: UserService.validateEmail()
```

### 📌 Règles de Refactoring IA

> ⚠️ **🤖 L'IA ne doit jamais :**
> - Modifier plusieurs responsabilités en un seul commit
> - Changer le comportement externe pendant un refactoring
> - Proposer du code sans tests de régression
> - Ignorer les types TypeScript existants

> ✅ **🤖 L'IA doit toujours :**
> - Ajouter un commentaire `// @ai-refactor:` dans le code proposé
> - Proposer un diff minimal et typé
> - Inclure des tests avant refactorisation structurelle
> - Respecter les patterns existants du projet

### 📥 Exemples de Tâches IA Attendues

> 📌 **Tâches de génération courantes :**
> - `génère une route POST /users sécurisée avec validation`
> - `refactore UserService pour appliquer un pattern Repository`
> - `ajoute un middleware de rate-limiting sur /login`
> - `crée un type Result<T, E> pour la gestion d'erreurs`
> - `implémente la validation Joi pour CreateUserDTO`

```typescript
// Exemple : Génération automatique d'une route sécurisée
// @ai-refactor: Generated secure route with validation
app.post('/users', 
  rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }),
  validateSchema(createUserSchema),
  async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    res.status(201).json(result.data);
  }
);
```

### 🗺️ Roadmap de Refactoring IA (SmartRefactor™)

#### Phase 1: 🔍 Préparation et Analyse

**1.1 Identification des zones à refactorer**
```typescript
// @ai-refactor: Analysis phase
interface RefactorAnalysis {
  duplications: CodeDuplication[];
  obsoletePatterns: ObsoletePattern[];
  fragilityPoints: FragilityPoint[];
  complexityScore: number;
  technicalDebt: TechnicalDebtItem[];
}

// L'IA analyse automatiquement :
// - Duplications de code (>3 lignes identiques)
// - Patterns obsolètes (callbacks vs async/await)
// - Points de fragilité (any types, eval, process.env direct)
// - Complexité cyclomatique (>10 = refactor requis)
```

**1.2 Évaluation de la couverture de tests**
```typescript
// @ai-refactor: Test coverage analysis
interface TestCoverageAnalysis {
  unitTestCoverage: number;      // Minimum 80%
  integrationTests: boolean;     // Requis pour refactoring
  e2eTests: boolean;            // Recommandé
  criticalPathsCovered: boolean; // Obligatoire
}

// Checklist IA obligatoire :
// ✅ Coverage >80% avant refactoring
// ✅ Tests critiques existants
// ✅ Tests de régression en place
```

#### Phase 2: 📋 Planification du Refactoring

**2.1 Définition des objectifs SMART**
```typescript
// @ai-refactor: Refactoring objectives
interface RefactorObjectives {
  complexityReduction: {
    current: number;
    target: number;        // Max 10 par fonction
    priority: 'high' | 'medium' | 'low';
  };
  performanceImprovement: {
    metric: 'latency' | 'memory' | 'throughput';
    currentValue: number;
    targetValue: number;
  };
  maintainabilityScore: {
    current: number;       // 1-10
    target: number;        // Minimum 8
  };
  securityLevel: 'basic' | 'moderate' | 'strict';
}
```

**2.2 Priorisation des tâches (Matrice Impact/Faisabilité)**
```typescript
// @ai-refactor: Task prioritization matrix
interface RefactorTask {
  id: string;
  description: string;
  impact: 1 | 2 | 3 | 4 | 5;        // 5 = impact critique
  feasibility: 1 | 2 | 3 | 4 | 5;   // 5 = très facile
  riskLevel: 'low' | 'medium' | 'high';
  estimatedHours: number;
  dependencies: string[];
  priority: 'P0' | 'P1' | 'P2' | 'P3'; // P0 = urgent
}

// Algorithme de priorisation IA :
// Priority = (Impact × 2 + Feasibility) / RiskFactor
// P0: Score >8 && RiskLevel = 'low'
// P1: Score 6-8 && RiskLevel ≤ 'medium'
```

#### Phase 3: ⚡ Exécution Automatisée

**3.1 Refactoring par étapes atomiques**
```typescript
// @ai-refactor: Atomic refactoring steps
interface AtomicRefactorStep {
  stepId: string;
  type: 'extract-method' | 'extract-class' | 'rename' | 'move' | 'inline';
  scope: 'function' | 'class' | 'module' | 'package';
  rollbackPlan: RollbackStep[];
  validationTests: TestCase[];
  maxLinesChanged: 50;  // Limite stricte
}

// Processus IA obligatoire :
// 1. Backup automatique
// 2. Changement atomique (<50 lignes)
// 3. Exécution des tests
// 4. Validation TypeScript
// 5. Commit ou rollback
```

**3.2 Génération automatique de tests**
```typescript
// @ai-refactor: Auto-generated tests
interface AutoTestGeneration {
  beforeRefactor: TestSuite;
  afterRefactor: TestSuite;
  regressionTests: TestCase[];
  performanceTests: BenchmarkTest[];
}

// L'IA génère automatiquement :
// - Tests de régression pour comportement existant
// - Tests unitaires pour nouvelles méthodes extraites
// - Tests d'intégration pour interfaces modifiées
// - Benchmarks pour validation performance
```

#### Phase 4: ✅ Revue et Validation

**4.1 Code review assistée par IA**
```typescript
// @ai-refactor: AI-assisted code review
interface AICodeReview {
  securityIssues: SecurityIssue[];
  performanceImpacts: PerformanceImpact[];
  bestPracticeViolations: BestPracticeViolation[];
  typeScriptIssues: TypeIssue[];
  recommendedImprovements: Improvement[];
}

// Checklist de validation IA :
// ✅ Aucun eval, Function(), process.env direct
// ✅ Types stricts, pas d'any
// ✅ Patterns recommandés appliqués
// ✅ Sécurité maintenue ou améliorée
// ✅ Performance maintenue ou améliorée
```

**4.2 Validation des performances**
```typescript
// @ai-refactor: Performance validation
interface PerformanceValidation {
  beforeMetrics: PerformanceMetrics;
  afterMetrics: PerformanceMetrics;
  regressionThreshold: number;  // Max 5% dégradation
  improvementAchieved: boolean;
  benchmarkResults: BenchmarkResult[];
}

// Métriques surveillées :
// - Temps de réponse API
// - Utilisation mémoire
// - Complexité cyclomatique
// - Temps de compilation TypeScript
```

#### Phase 5: 📚 Documentation et Suivi

**5.1 Mise à jour automatique de la documentation**
```typescript
// @ai-refactor: Auto-documentation update
interface DocumentationUpdate {
  apiDocumentation: boolean;     // JSDoc mis à jour
  architectureGuides: boolean;   // Diagrammes actualisés
  changelogEntry: ChangelogEntry;
  migrationGuide?: MigrationGuide;
}

// L'IA met à jour automatiquement :
// - JSDoc pour nouvelles méthodes
// - README si API publique modifiée
// - CHANGELOG avec détails techniques
// - Guide de migration si breaking changes
```

**5.2 Suivi continu de la qualité**
```typescript
// @ai-refactor: Continuous quality monitoring
interface QualityMonitoring {
  codeQualityScore: number;      // 1-10, objectif >8
  technicalDebtReduction: number; // Pourcentage amélioré
  maintainabilityIndex: number;   // Objectif >85
  nextRefactoringSuggestions: RefactorSuggestion[];
}

// Surveillance continue :
// - Métriques de qualité quotidiennes
// - Détection de nouvelles dettes techniques
// - Suggestions proactives d'amélioration
// - Alertes si dégradation détectée
```

### 🎯 Template de Commit pour Roadmap

```bash
# Phase 1: Analyse
docs(refactor): add refactoring analysis for UserService

- Identified 3 code duplications in validation logic
- Found 2 obsolete callback patterns
- Complexity score: 12 (target: 8)
- Test coverage: 75% (target: 80%)

# @ai-refactor: Analysis phase completed

# Phase 2: Planification  
plan(refactor): prioritize UserService refactoring tasks

- P0: Extract email validation (Impact: 5, Feasibility: 5)
- P1: Convert callbacks to async/await (Impact: 4, Feasibility: 4)
- P2: Split large methods (Impact: 3, Feasibility: 5)

# @ai-refactor: Planning phase completed

# Phase 3: Exécution
refactor(user): extract email validation method

- Extract validateEmail from createUser method
- Reduce complexity from 12 to 8
- Add unit tests for extracted method
- No behavior change, only structure improvement

# @ai-refactor: UserService.validateEmail() extracted

# Phase 4: Validation
test(refactor): validate UserService refactoring

- Performance maintained: 95ms → 92ms
- Test coverage increased: 75% → 85%
- No security regressions detected
- TypeScript compilation successful

# @ai-refactor: Validation completed

# Phase 5: Documentation
docs(refactor): update UserService documentation

- Updated JSDoc for new validateEmail method
- Added architecture decision record
- Updated API documentation
- Created migration guide for breaking changes

# @ai-refactor: Documentation updated
```

---

## 📦 Gestion des Dépendances

### 🎯 Stratégie de Sélection

#### Critères d'Évaluation
1. **Popularité** : `npm trends`, téléchargements hebdomadaires
2. **Maintenance** : Dernière mise à jour, fréquence des releases
3. **Sécurité** : Audit de sécurité, vulnérabilités connues
4. **Qualité** : Tests, documentation, TypeScript support
5. **Taille** : Impact sur le bundle final

#### Dépendances Recommandées

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0",
    "winston": "^3.11.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "typescript": "^5.3.2",
    "@types/node": "^20.9.0",
    "@types/express": "^4.17.21",
    "ts-node-dev": "^2.0.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "ts-jest": "^29.1.1",
    "eslint": "^8.54.0",
    "@typescript-eslint/parser": "^6.12.0",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "prettier": "^3.1.0",
    "rimraf": "^5.0.5"
  }
}
```

### 🔒 Verrouillage des Versions

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "volta": {
    "node": "20.9.0",
    "npm": "10.1.0"
  }
}
```

### 📊 Audit et Maintenance

```bash
# Audit de sécurité
npm audit
npm audit --audit-level moderate
npm audit fix

# Vérification des mises à jour
npx npm-check-updates
npx npm-check-updates -u

# Analyse des dépendances
npx depcheck
npx bundle-phobia <package-name>
```

---

## 🛡️ Sécurité

### 🔍 Outils de Vérification

#### Configuration `.npmrc`
```ini
# Sécurité
audit-level=moderate
fund=false

# Registry sécurisé
registry=https://registry.npmjs.org/
```

#### Scripts de Sécurité
```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level moderate",
    "security:check": "npx better-npm-audit audit",
    "security:licenses": "npx license-checker --summary",
    "security:outdated": "npm outdated",
    "precommit": "npm run security:audit && npm run lint && npm run test"
  }
}
```

### 🛡️ Pratiques de Sécurisation

> ⚠️ **🤖 L'IA ne doit jamais proposer un code contenant :**
> - Des accès directs à `process.env` sans fallback sécurisé
> - Des dépendances non vérifiées ou inconnues
> - Des `eval`, `Function()` ou autres constructions dynamiques
> - Des requêtes SQL non paramétrées
> - Des uploads de fichiers sans validation de type
> - Des tokens JWT sans expiration

```typescript
// ✅ Validation des entrées avec types stricts
import Joi from 'joi';

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(120)
});

// ✅ Sanitisation des données
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite à 100 requêtes par IP
}));

// ✅ Gestion sécurisée des secrets avec fallbacks
import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  dbUrl: process.env.DATABASE_URL || (() => {
    throw new Error('DATABASE_URL is required in production');
  })(),
  jwtSecret: process.env.JWT_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production');
    }
    return 'dev-secret-key';
  })()
};

// ✅ Sanitisation XSS
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}
```

> 🤖 **Pour l'IA :**
> Toujours proposer une validation d'entrée ET une sanitisation pour tout input utilisateur.

### 🔐 Variables d'Environnement

```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-super-secret-key
API_KEY=your-api-key

# Logging
LOG_LEVEL=info
LOG_FILE=app.log
```

---

## 🔄 Compatibilité des Versions

### 📊 Matrice de Compatibilité

| Node.js | TypeScript | Support | Recommandation |
|---------|------------|---------|----------------|
| 18.x LTS | 5.0+ | ✅ Active | Production |
| 20.x LTS | 5.0+ | ✅ Active | **Recommandé** |
| 21.x | 5.0+ | ⚠️ Current | Développement |
| 16.x | 4.9+ | ❌ EOL | Migration requise |

### 🎯 Stratégie de Migration

#### Node.js 18 → 20
```json
{
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "check-node": "node --version",
    "migrate": "npm run test && npm run build"
  }
}
```

#### TypeScript 4.x → 5.x
```bash
# Mise à jour progressive
npm install typescript@^5.0.0 --save-dev
npm run type-check
npm run test
```

### 📋 Checklist de Compatibilité

- [ ] **Node.js** : Version LTS active
- [ ] **TypeScript** : Dernière version stable
- [ ] **Dépendances** : Support des versions cibles
- [ ] **Tests** : Passage sur toutes les versions
- [ ] **CI/CD** : Matrix de tests multi-versions

---

## 🚀 Pipeline CI/CD

### 🔧 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Security audit
      run: npm audit --audit-level moderate
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Test
      run: npm run test:coverage
    
    - name: Build
      run: npm run build
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### 🔒 Contrôles de Sécurité

```yaml
  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Snyk to check for vulnerabilities
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
    
    - name: Audit dependencies
      run: |
        npm audit --audit-level high
        npx better-npm-audit audit
```

---

## 📘 Lexique pour les Agents IA

### 🎯 Terminologie Standard

| Terme | Définition | Usage IA |
|-------|------------|----------|
| `@bestcode/core` | Cœur des outils IA (types, logique fonctionnelle) | Référence pour patterns recommandés |
| `atomic commit` | Modification isolée ne traitant qu'un seul comportement | **Obligatoire** pour toute suggestion IA |
| `refactor` | Transformation interne sans changement de comportement | Doit inclure `// @ai-refactor:` |
| `sanitization` | Nettoyage des entrées utilisateurs contre XSS/Injection | **Requis** pour tout input utilisateur |
| `Result<T, E>` | Type fonctionnel pour gestion d'erreurs sans exceptions | Alternative préférée aux `try/catch` |
| `DTO` | Data Transfer Object - objet de transfert de données | Pour validation et sérialisation |
| `Repository Pattern` | Abstraction de la couche de données | Recommandé pour accès base de données |

### 🤖 Patterns IA Recommandés

```typescript
// Pattern Result<T, E> - À proposer systématiquement
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Pattern Option<T> - Pour valeurs optionnelles
type Option<T> = T | null;

// Pattern DTO avec validation
interface CreateUserDTO {
  readonly name: string;
  readonly email: string;
  readonly age?: number;
}

// Pattern Repository
interface UserRepository {
  findById(id: string): Promise<Option<User>>;
  create(user: CreateUserDTO): Promise<Result<User, ValidationError>>;
}
```

### 📋 Checklist IA Obligatoire

Avant toute suggestion de code, l'IA doit vérifier :

- [ ] **Sécurité** : Pas d'`eval`, `process.env` sécurisé, validation inputs
- [ ] **Types** : TypeScript strict, pas d'`any`, interfaces définies
- [ ] **Tests** : Tests inclus pour nouveau code/refactoring
- [ ] **Atomicité** : Une seule responsabilité par commit
- [ ] **Documentation** : JSDoc pour fonctions publiques
- [ ] **Patterns** : Utilisation des patterns recommandés (Result, Repository)
- [ ] **Performance** : Pas de boucles O(n²), async/await approprié

### 🚨 Interdictions Absolues pour l'IA

```typescript
// ❌ JAMAIS proposer
eval(userInput);                    // Exécution de code dynamique
process.env.SECRET;                 // Accès direct sans fallback
const users: any[] = [];            // Type any
function doEverything() {}          // Responsabilités multiples
await Promise.all(heavyTasks);      // Sans limitation de concurrence

// ✅ TOUJOURS proposer
const result = parseUserInput(input);  // Parsing sécurisé
const secret = config.getSecret();     // Configuration centralisée
const users: User[] = [];              // Types stricts
function validateEmail() {}            // Responsabilité unique
const results = await pLimit(5)(tasks); // Concurrence limitée
```

---

## 📖 Ressources

### 📚 Documentation Officielle
- [Node.js Documentation](https://nodejs.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)

### 🛠️ Outils Recommandés
- **IDE** : VS Code avec extensions TypeScript
- **Linting** : ESLint + Prettier
- **Testing** : Jest + Supertest
- **Security** : Snyk, npm audit, OWASP ZAP

### 🔗 Liens Utiles
- [Node.js Security Best Practices](https://nodejs.org/en/security/)
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [npm Security Guidelines](https://docs.npmjs.com/security)

---

## 📝 Changelog

### v2.0.0 - AI-Enhanced Release
- 🤖 Guide spécialisé pour les agents IA
- 🧬 Méthodologie SmartRefactor™
- 📘 Lexique et patterns standardisés
- 🔒 Sécurité IA-first
- ✅ Checklist obligatoire pour l'IA

### v1.0.0 - Initial Release
- ✅ Structure de projet complète
- ✅ Bonnes pratiques TypeScript
- ✅ Guide de sécurité
- ✅ Pipeline CI/CD
- ✅ Matrice de compatibilité

---

**Maintenu par l'équipe BestCode** | *Dernière mise à jour : Octobre 2024*
**🤖 AI-Friendly Documentation** | *Optimisé pour les assistants IA*
