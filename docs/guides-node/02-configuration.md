# ⚙️ Configuration BestCode

> Guide complet des configurations TypeScript, package.json et outils de développement.

## 🎯 Versions Compatibles

| Composant | Version Recommandée | Version Minimale | Notes |
|-----------|-------------------|------------------|-------|
| **Node.js** | `20.x LTS` | `18.x` | Support à long terme |
| **TypeScript** | `5.3.x` | `5.0.x` | Dernières fonctionnalités |
| **npm** | `10.x` | `9.x` | Gestionnaire de packages |

## 📄 Configuration de Base

### `package.json` - Configuration Standard

```json
{
  "name": "my-typescript-project",
  "version": "1.0.0",
  "description": "Description du projet",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "type-check": "tsc --noEmit",
    "security:audit": "npm audit --audit-level moderate",
    "clean": "rimraf dist",
    "prebuild": "npm run clean",
    "prestart": "npm run build"
  },
  "keywords": ["typescript", "node", "bestcode"],
  "author": "Your Name",
  "license": "MIT"
}
```

### `tsconfig.json` - Configuration TypeScript Stricte

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "types": ["node"],
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

### `tsconfig.build.json` - Configuration Build Production

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./lib",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": false,
    "removeComments": true
  },
  "exclude": ["node_modules", "dist", "tests", "**/*.test.ts", "**/*.spec.ts"]
}
```

## 🧪 Configuration des Tests

### `jest.config.js` - Configuration Jest

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testTimeout: 10000,
  verbose: true
};
```

### `tsconfig.test.json` - Configuration Tests

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["jest", "node"],
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist", "lib"]
}
```

## 🔍 Configuration Linting et Formatage

### `.eslintrc.js` - ESLint Configuration

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  rules: {
    // Sécurité - Interdictions absolues selon BestCode
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // TypeScript strict
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    
    // Complexité
    'complexity': ['error', 10],
    'max-lines-per-function': ['error', { max: 50 }],
  },
};
```

### `.prettierrc.js` - Prettier Configuration

```javascript
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
};
```

## 🔒 Configuration Sécurité

### `.npmrc` - Configuration NPM Sécurisée

```ini
# Sécurité
audit-level=moderate
fund=false

# Registry sécurisé
registry=https://registry.npmjs.org/

# Configuration pour packages scoped
@yourscope:registry=https://registry.npmjs.org/
access=public
```

### `bestcode.config.json` - Configuration BestCode

```json
{
  "ai": {
    "refactor": true,
    "enforceAtomicCommits": true,
    "securityLevel": "moderate",
    "strictTypes": true,
    "preferredPatterns": ["Result<T, E>", "Repository", "DTO"]
  },
  "refactoring": {
    "maxLinesPerCommit": 50,
    "requireTests": true,
    "requireDocumentation": true
  },
  "security": {
    "validateInputs": true,
    "sanitizeOutputs": true,
    "auditLevel": "moderate"
  },
  "typescript": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## 📦 Dépendances Recommandées

### Production Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "dotenv": "^16.3.1",
    "joi": "^17.11.0",
    "winston": "^3.11.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.3.2",
    "@types/node": "^20.9.0",
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

## 🚀 Scripts de Développement

### Scripts Essentiels

```bash
# Développement
npm run dev              # Mode développement avec rechargement
npm run build            # Build de production
npm run start            # Démarrage production

# Tests
npm test                 # Lancer les tests
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture

# Qualité
npm run lint             # Vérification ESLint
npm run lint:fix         # Correction automatique
npm run format           # Formatage Prettier
npm run type-check       # Vérification types TypeScript

# Sécurité
npm run security:audit   # Audit de sécurité
```

## 📋 Checklist de Configuration

### ✅ Configuration TypeScript
- [ ] `tsconfig.json` avec mode strict activé
- [ ] `tsconfig.build.json` pour la production
- [ ] `tsconfig.test.json` pour les tests
- [ ] Paths mapping configuré (`@/*`)

### ✅ Configuration Tests
- [ ] Jest configuré avec ts-jest
- [ ] Couverture de code >80%
- [ ] Setup des tests personnalisé
- [ ] Matchers personnalisés pour Result<T,E>

### ✅ Configuration Qualité
- [ ] ESLint avec règles TypeScript strictes
- [ ] Prettier pour formatage cohérent
- [ ] Pre-commit hooks (optionnel)
- [ ] Scripts npm standardisés

### ✅ Configuration Sécurité
- [ ] `.npmrc` avec audit-level moderate
- [ ] Interdiction des patterns dangereux (eval, any)
- [ ] Validation des entrées activée
- [ ] Audit automatique des dépendances

## 🔗 Navigation

- **Précédent :** [01-project-structures.md](./01-project-structures.md) - Architectures de projet
- **Suivant :** [03-coding-practices.md](./03-coding-practices.md) - Bonnes pratiques de codage
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Configuration et Outils de Développement*
