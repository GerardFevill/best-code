# 📦 Gestion des Dépendances BestCode

> Guide complet de la sélection, audit, maintenance et sécurisation des dépendances Node.js TypeScript.

## 🎯 Stratégie de Sélection des Dépendances

### 📊 Critères d'Évaluation BestCode

#### 1. **Popularité et Adoption**
```bash
# Vérification des métriques npm
npm info <package-name>
npx npm-trends <package1> <package2> <package3>

# Métriques à analyser :
# - Téléchargements hebdomadaires (>100k recommandé)
# - Nombre d'étoiles GitHub (>1k recommandé)
# - Nombre de dépendants (>100 recommandé)
```

#### 2. **Maintenance et Activité**
```typescript
// Critères de maintenance BestCode
interface MaintenanceCriteria {
  lastUpdate: Date;           // < 6 mois pour packages critiques
  releaseFrequency: number;   // Au moins 1 release/trimestre
  issueResponseTime: number;  // < 7 jours en moyenne
  openIssuesRatio: number;    // < 20% d'issues ouvertes
  maintainerCount: number;    // > 2 maintainers actifs
}

// ✅ Package bien maintenu
const goodPackage: MaintenanceCriteria = {
  lastUpdate: new Date('2024-09-01'),
  releaseFrequency: 4, // 4 releases/trimestre
  issueResponseTime: 3, // 3 jours
  openIssuesRatio: 0.15, // 15%
  maintainerCount: 5
};

// ❌ Package à éviter
const badPackage: MaintenanceCriteria = {
  lastUpdate: new Date('2022-01-01'),
  releaseFrequency: 0.5, // 1 release/2 trimestres
  issueResponseTime: 30, // 30 jours
  openIssuesRatio: 0.60, // 60%
  maintainerCount: 1
};
```

#### 3. **Sécurité et Vulnérabilités**
```bash
# Audit de sécurité automatique
npm audit --audit-level moderate
npx better-npm-audit audit

# Vérification avec Snyk
npx snyk test
npx snyk monitor

# Vérification des licences
npx license-checker --summary
```

#### 4. **Qualité et TypeScript Support**
```typescript
// Critères de qualité TypeScript
interface QualityCriteria {
  hasTypeDefinitions: boolean;    // Types inclus ou @types disponibles
  typeScriptSupport: 'native' | 'community' | 'none';
  bundleSize: number;            // Impact sur le bundle final
  treeshakeable: boolean;        // Support du tree-shaking
  esModuleSupport: boolean;      // Support ESM
  testCoverage: number;          // > 80% recommandé
}
```

## 📋 Dépendances Recommandées par Catégorie

### 🌐 **Serveurs Web et API**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "fastify": "^4.24.3",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5"
  }
}
```

**🎯 Justification :**
- **Express** : Standard de l'industrie, écosystème mature
- **Fastify** : Alternative performante avec TypeScript natif
- **Helmet** : Sécurité HTTP essentielle
- **CORS** : Gestion des requêtes cross-origin
- **Rate-limit** : Protection contre les abus

### 🔒 **Sécurité et Validation**

```json
{
  "dependencies": {
    "joi": "^17.11.0",
    "zod": "^3.22.4",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "crypto": "built-in"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

**🎯 Justification :**
- **Joi/Zod** : Validation de schémas robuste
- **bcrypt** : Hachage de mots de passe sécurisé
- **jsonwebtoken** : Gestion JWT standard
- **crypto** : Module Node.js natif pour chiffrement

### 🗄️ **Base de Données et ORM**

```json
{
  "dependencies": {
    "prisma": "^5.6.0",
    "typeorm": "^0.3.17",
    "mongoose": "^8.0.3",
    "redis": "^4.6.10",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "@prisma/client": "^5.6.0",
    "@types/pg": "^8.10.9"
  }
}
```

### 🧪 **Tests et Qualité**

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "@types/jest": "^29.5.8",
    "supertest": "^6.3.3",
    "msw": "^2.0.8",
    "faker": "^6.6.6"
  }
}
```

### 📊 **Logging et Monitoring**

```json
{
  "dependencies": {
    "winston": "^3.11.0",
    "pino": "^8.16.2",
    "morgan": "^1.10.0",
    "newrelic": "^11.7.0"
  },
  "devDependencies": {
    "@types/morgan": "^1.9.9"
  }
}
```

## 🔒 Verrouillage et Sécurisation

### 📌 **Package-lock et Versions**

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

### 🛡️ **Configuration .npmrc Sécurisée**

```ini
# .npmrc - Configuration sécurisée
audit-level=moderate
fund=false
save-exact=true
package-lock=true

# Registry sécurisé
registry=https://registry.npmjs.org/

# Configuration pour packages scoped
@yourscope:registry=https://registry.npmjs.org/
access=public

# Sécurité
audit-level=moderate
```

### 🔍 **Scripts d'Audit Automatique**

```json
{
  "scripts": {
    "security:audit": "npm audit --audit-level moderate",
    "security:check": "npx better-npm-audit audit",
    "security:licenses": "npx license-checker --summary",
    "security:outdated": "npm outdated",
    "security:full": "npm run security:audit && npm run security:licenses && npm run security:outdated",
    "precommit": "npm run security:audit && npm run lint && npm run test"
  }
}
```

## 📊 Audit et Maintenance Continue

### 🔄 **Processus d'Audit Régulier**

```typescript
// scripts/audit-dependencies.ts
import { execSync } from 'child_process';
import fs from 'fs';

interface AuditResult {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  metadata: {
    vulnerabilities: number;
    dependencies: number;
    devDependencies: number;
    optionalDependencies: number;
    totalDependencies: number;
  };
}

class DependencyAuditor {
  /**
   * Effectue un audit complet des dépendances
   */
  static async performFullAudit(): Promise<AuditResult> {
    try {
      // Audit npm
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
      const auditResult: AuditResult = JSON.parse(auditOutput);
      
      // Vérification des licences
      const licenseOutput = execSync('npx license-checker --json', { encoding: 'utf8' });
      const licenses = JSON.parse(licenseOutput);
      
      // Vérification des packages obsolètes
      const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdated = JSON.parse(outdatedOutput);
      
      // Génération du rapport
      this.generateAuditReport(auditResult, licenses, outdated);
      
      return auditResult;
    } catch (error) {
      console.error('Audit failed:', error);
      throw error;
    }
  }

  /**
   * Génère un rapport d'audit détaillé
   */
  private static generateAuditReport(
    audit: AuditResult,
    licenses: Record<string, any>,
    outdated: Record<string, any>
  ): void {
    const report = {
      timestamp: new Date().toISOString(),
      security: {
        totalVulnerabilities: audit.metadata.vulnerabilities,
        criticalVulnerabilities: audit.vulnerabilities.critical,
        highVulnerabilities: audit.vulnerabilities.high,
        status: audit.vulnerabilities.critical > 0 ? 'CRITICAL' : 
                audit.vulnerabilities.high > 0 ? 'HIGH' : 'OK'
      },
      licenses: {
        total: Object.keys(licenses).length,
        problematic: this.findProblematicLicenses(licenses)
      },
      outdated: {
        total: Object.keys(outdated).length,
        packages: outdated
      }
    };

    fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
    console.log('📊 Rapport d\'audit généré: audit-report.json');
  }

  /**
   * Identifie les licences problématiques
   */
  private static findProblematicLicenses(licenses: Record<string, any>): string[] {
    const problematicLicenses = ['GPL-2.0', 'GPL-3.0', 'AGPL-1.0', 'AGPL-3.0'];
    const problematic: string[] = [];

    for (const [pkg, info] of Object.entries(licenses)) {
      if (problematicLicenses.includes(info.licenses)) {
        problematic.push(`${pkg}: ${info.licenses}`);
      }
    }

    return problematic;
  }
}
```

### 🔄 **Mise à Jour Automatisée**

```typescript
// scripts/update-dependencies.ts
class DependencyUpdater {
  /**
   * Met à jour les dépendances de manière sécurisée
   */
  static async updateDependencies(type: 'patch' | 'minor' | 'major' = 'patch'): Promise<void> {
    console.log(`🔄 Mise à jour des dépendances (${type})...`);

    try {
      // Sauvegarde du package-lock.json
      execSync('cp package-lock.json package-lock.json.backup');

      // Mise à jour selon le type
      switch (type) {
        case 'patch':
          execSync('npm update');
          break;
        case 'minor':
          execSync('npx npm-check-updates -u --target minor');
          execSync('npm install');
          break;
        case 'major':
          execSync('npx npm-check-updates -u');
          execSync('npm install');
          break;
      }

      // Vérification post-mise à jour
      await this.verifyUpdates();

    } catch (error) {
      console.error('❌ Mise à jour échouée, restauration...');
      execSync('mv package-lock.json.backup package-lock.json');
      execSync('npm ci');
      throw error;
    }
  }

  /**
   * Vérifie que les mises à jour n'ont pas cassé le projet
   */
  private static async verifyUpdates(): Promise<void> {
    console.log('🧪 Vérification des mises à jour...');

    // Tests
    execSync('npm test');
    
    // Build
    execSync('npm run build');
    
    // Audit de sécurité
    execSync('npm audit --audit-level moderate');
    
    console.log('✅ Mises à jour vérifiées avec succès');
  }
}
```

## 🎯 **Stratégies par Type de Projet**

### 📚 **Librairie NPM**

```json
{
  "peerDependencies": {
    "typescript": ">=4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.2",
    "rollup": "^4.6.1",
    "rollup-plugin-typescript2": "^0.36.0"
  },
  "bundledDependencies": []
}
```

**🎯 Stratégie :**
- **Minimiser les dependencies** : Réduire la surface d'attaque
- **Utiliser peerDependencies** : Laisser le choix à l'utilisateur
- **Éviter bundledDependencies** : Sauf cas spécifiques

### 🌐 **Application Web**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "ts-node-dev": "^2.0.0"
  }
}
```

**🎯 Stratégie :**
- **Sécurité prioritaire** : Helmet, rate-limiting, validation
- **Monitoring intégré** : Logging, métriques
- **Développement optimisé** : Hot-reload, debugging

### ⚡ **Microservice**

```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "pino": "^8.16.2",
    "node-config": "^1.4.3"
  }
}
```

**🎯 Stratégie :**
- **Performance maximale** : Fastify vs Express
- **Logging structuré** : Pino pour JSON logging
- **Configuration externalisée** : Variables d'environnement

## 📋 Checklist de Gestion des Dépendances

### ✅ **Sélection**
- [ ] Vérification des métriques de popularité
- [ ] Analyse de la maintenance et activité
- [ ] Audit de sécurité des nouvelles dépendances
- [ ] Vérification du support TypeScript
- [ ] Analyse de l'impact sur la taille du bundle

### ✅ **Sécurisation**
- [ ] Configuration .npmrc sécurisée
- [ ] Verrouillage des versions (package-lock.json)
- [ ] Scripts d'audit automatique
- [ ] Vérification des licences
- [ ] Monitoring des vulnérabilités

### ✅ **Maintenance**
- [ ] Audit mensuel des dépendances
- [ ] Mise à jour régulière des patches
- [ ] Tests après chaque mise à jour
- [ ] Documentation des changements
- [ ] Plan de rollback en cas de problème

### ✅ **Monitoring**
- [ ] Alertes sur nouvelles vulnérabilités
- [ ] Suivi des packages obsolètes
- [ ] Métriques de performance du bundle
- [ ] Rapport d'audit automatique
- [ ] Dashboard de santé des dépendances

## 🔗 Navigation

- **Précédent :** [06-testing-strategies.md](./06-testing-strategies.md) - Stratégies de tests
- **Suivant :** [08-cicd-pipeline.md](./08-cicd-pipeline.md) - Pipeline CI/CD
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Gestion et Sécurisation des Dépendances*
