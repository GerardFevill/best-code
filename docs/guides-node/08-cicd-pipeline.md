# 🚀 Pipeline CI/CD BestCode

> Guide complet des pipelines d'intégration continue et déploiement continu pour projets Node.js TypeScript.

## 🎯 Architecture CI/CD BestCode

### 📋 Principes Fondamentaux

- **🔒 Sécurité d'abord** : Audit, scan de vulnérabilités à chaque étape
- **⚡ Feedback rapide** : Tests parallélisés, builds optimisés
- **🎯 Qualité garantie** : Gates de qualité obligatoires
- **📊 Métriques continues** : Monitoring de la santé du pipeline
- **🔄 Rollback automatique** : Retour en arrière en cas d'échec

### 🗺️ Workflow Standard

```mermaid
graph TD
    A[Push/PR] --> B[Lint & Format]
    B --> C[Security Audit]
    C --> D[Type Check]
    D --> E[Unit Tests]
    E --> F[Integration Tests]
    F --> G[Build]
    G --> H[E2E Tests]
    H --> I[Security Scan]
    I --> J[Performance Tests]
    J --> K{Quality Gates}
    K -->|Pass| L[Deploy Staging]
    K -->|Fail| M[Block & Notify]
    L --> N[Smoke Tests]
    N --> O{Manual Approval}
    O -->|Approved| P[Deploy Production]
    O -->|Rejected| Q[Rollback]
```

## 🔧 GitHub Actions Configuration

### 🏗️ **Workflow Principal**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline BestCode

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # Audit hebdomadaire le lundi à 2h

env:
  NODE_VERSION: '20.x'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Phase 1: Vérifications de base
  lint-and-format:
    name: 🔍 Lint & Format
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Check Prettier formatting
        run: npm run format -- --check

      - name: TypeScript type check
        run: npm run type-check

  # Phase 2: Audit de sécurité
  security-audit:
    name: 🛡️ Security Audit
    runs-on: ubuntu-latest
    needs: lint-and-format
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level moderate

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=medium

      - name: Check licenses
        run: npx license-checker --summary --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC'

  # Phase 3: Tests
  test:
    name: 🧪 Tests
    runs-on: ubuntu-latest
    needs: security-audit
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Check coverage threshold
        run: |
          COVERAGE=$(npm run test:coverage --silent | grep -o 'All files.*[0-9]*\.[0-9]*' | grep -o '[0-9]*\.[0-9]*' | tail -1)
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi
          echo "✅ Coverage $COVERAGE% meets threshold"

  # Phase 4: Build et tests d'intégration
  build-and-integration:
    name: 🏗️ Build & Integration
    runs-on: ubuntu-latest
    needs: test
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          NODE_ENV: test

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist/
            lib/
          retention-days: 7

  # Phase 5: Tests E2E et performance
  e2e-and-performance:
    name: 🎭 E2E & Performance
    runs-on: ubuntu-latest
    needs: build-and-integration
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Install dependencies
        run: npm ci

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Run performance benchmarks
        run: npm run test:performance

      - name: Performance regression check
        run: |
          # Comparer avec les métriques de référence
          node scripts/check-performance-regression.js

  # Phase 6: Quality Gates
  quality-gates:
    name: 🚪 Quality Gates
    runs-on: ubuntu-latest
    needs: [test, build-and-integration, e2e-and-performance]
    if: always()
    
    steps:
      - name: Check all jobs status
        run: |
          if [[ "${{ needs.test.result }}" != "success" || 
                "${{ needs.build-and-integration.result }}" != "success" || 
                "${{ needs.e2e-and-performance.result }}" != "success" ]]; then
            echo "❌ Quality gates failed"
            exit 1
          fi
          echo "✅ All quality gates passed"

  # Phase 7: Déploiement
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: quality-gates
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Deploy to staging
        run: |
          echo "🚀 Deploying to staging environment..."
          # Commandes de déploiement spécifiques à votre infrastructure

      - name: Run smoke tests
        run: |
          echo "🔥 Running smoke tests on staging..."
          npm run test:smoke -- --env=staging

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  deploy-production:
    name: 🌟 Deploy to Production
    runs-on: ubuntu-latest
    needs: quality-gates
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Manual approval required
        uses: trstringer/manual-approval@v1
        with:
          secret: ${{ github.TOKEN }}
          approvers: ${{ secrets.PRODUCTION_APPROVERS }}
          minimum-approvals: 2

      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts

      - name: Deploy to production
        run: |
          echo "🌟 Deploying to production environment..."
          # Commandes de déploiement production

      - name: Run smoke tests
        run: |
          echo "🔥 Running smoke tests on production..."
          npm run test:smoke -- --env=production

      - name: Create release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          draft: false
          prerelease: false
```

### 🔒 **Workflow de Sécurité Avancé**

```yaml
# .github/workflows/security-scan.yml
name: 🛡️ Advanced Security Scan

on:
  schedule:
    - cron: '0 1 * * *' # Scan quotidien à 1h
  workflow_dispatch: # Déclenchement manuel

jobs:
  security-comprehensive:
    name: 🔍 Comprehensive Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Scan des vulnérabilités npm
      - name: npm audit
        run: npm audit --audit-level moderate

      # Scan Snyk
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      # Scan CodeQL
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: javascript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2

      # Scan des secrets
      - name: Run TruffleHog
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: main
          head: HEAD

      # Scan SAST avec Semgrep
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/secrets
            p/owasp-top-ten

      # Génération du rapport de sécurité
      - name: Generate security report
        run: |
          echo "# 🛡️ Security Scan Report" > security-report.md
          echo "Date: $(date)" >> security-report.md
          echo "" >> security-report.md
          
          # Ajouter les résultats des différents scans
          if [ -f "snyk-report.json" ]; then
            echo "## Snyk Vulnerabilities" >> security-report.md
            cat snyk-report.json >> security-report.md
          fi

      - name: Upload security report
        uses: actions/upload-artifact@v3
        with:
          name: security-report
          path: security-report.md
```

## 🐳 Configuration Docker

### 📦 **Dockerfile Multi-stage**

```dockerfile
# Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY tsconfig*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY src/ ./src/

# Build de l'application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copier les dépendances de production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Changer le propriétaire
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

# Commande de démarrage
CMD ["node", "dist/index.js"]
```

### 🔧 **Docker Compose pour Développement**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Tests d'intégration
  test:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://postgres:password@test-db:5432/test_db
    depends_on:
      - test-db
    command: npm run test:integration

  test-db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=test_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password

volumes:
  postgres_data:
  redis_data:
```

## 📊 Monitoring et Métriques

### 📈 **Configuration des Métriques**

```typescript
// scripts/collect-pipeline-metrics.ts
interface PipelineMetrics {
  buildDuration: number;
  testDuration: number;
  deploymentDuration: number;
  successRate: number;
  failureReasons: string[];
  coveragePercentage: number;
  vulnerabilityCount: number;
}

class PipelineMetricsCollector {
  /**
   * Collecte les métriques du pipeline CI/CD
   */
  static async collectMetrics(): Promise<PipelineMetrics> {
    const startTime = Date.now();
    
    try {
      // Mesurer la durée de build
      const buildStart = Date.now();
      await this.runBuild();
      const buildDuration = Date.now() - buildStart;

      // Mesurer la durée des tests
      const testStart = Date.now();
      const testResults = await this.runTests();
      const testDuration = Date.now() - testStart;

      // Collecter les métriques de sécurité
      const securityMetrics = await this.collectSecurityMetrics();

      return {
        buildDuration,
        testDuration,
        deploymentDuration: 0, // À mesurer lors du déploiement
        successRate: testResults.successRate,
        failureReasons: testResults.failures,
        coveragePercentage: testResults.coverage,
        vulnerabilityCount: securityMetrics.vulnerabilities
      };
    } catch (error) {
      console.error('Failed to collect metrics:', error);
      throw error;
    }
  }

  /**
   * Envoie les métriques vers un système de monitoring
   */
  static async sendMetrics(metrics: PipelineMetrics): Promise<void> {
    // Envoyer vers DataDog, New Relic, ou autre
    const payload = {
      timestamp: new Date().toISOString(),
      metrics,
      environment: process.env.NODE_ENV,
      branch: process.env.GITHUB_REF,
      commit: process.env.GITHUB_SHA
    };

    // Exemple avec webhook
    await fetch(process.env.METRICS_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }
}
```

## 🔄 Stratégies de Déploiement

### 🎯 **Blue-Green Deployment**

```yaml
# .github/workflows/blue-green-deploy.yml
name: 🔄 Blue-Green Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'production'
        type: choice
        options:
        - staging
        - production

jobs:
  deploy-blue-green:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - name: Determine current slot
        id: current-slot
        run: |
          # Déterminer quel slot est actuellement actif
          CURRENT=$(curl -s ${{ secrets.LOAD_BALANCER_API }}/current-slot)
          if [ "$CURRENT" = "blue" ]; then
            echo "deploy-to=green" >> $GITHUB_OUTPUT
            echo "switch-from=blue" >> $GITHUB_OUTPUT
          else
            echo "deploy-to=blue" >> $GITHUB_OUTPUT
            echo "switch-from=green" >> $GITHUB_OUTPUT
          fi

      - name: Deploy to ${{ steps.current-slot.outputs.deploy-to }} slot
        run: |
          echo "🚀 Deploying to ${{ steps.current-slot.outputs.deploy-to }} slot"
          # Commandes de déploiement vers le slot inactif

      - name: Run health checks
        run: |
          echo "🏥 Running health checks on ${{ steps.current-slot.outputs.deploy-to }}"
          # Tests de santé sur le nouveau déploiement

      - name: Switch traffic
        run: |
          echo "🔄 Switching traffic from ${{ steps.current-slot.outputs.switch-from }} to ${{ steps.current-slot.outputs.deploy-to }}"
          # Basculer le trafic vers le nouveau slot

      - name: Monitor deployment
        run: |
          echo "📊 Monitoring deployment for 5 minutes"
          sleep 300
          # Surveiller les métriques pendant 5 minutes

      - name: Rollback if needed
        if: failure()
        run: |
          echo "⚠️ Rolling back to ${{ steps.current-slot.outputs.switch-from }}"
          # Rollback automatique en cas d'échec
```

## 📋 Checklist CI/CD BestCode

### ✅ **Pipeline de Base**
- [ ] Lint et formatage automatique
- [ ] Vérification TypeScript stricte
- [ ] Tests unitaires avec couverture >80%
- [ ] Tests d'intégration
- [ ] Build et validation des artefacts

### ✅ **Sécurité**
- [ ] Audit npm automatique
- [ ] Scan des vulnérabilités (Snyk/CodeQL)
- [ ] Vérification des licences
- [ ] Scan des secrets (TruffleHog)
- [ ] Analyse statique (Semgrep)

### ✅ **Qualité**
- [ ] Gates de qualité obligatoires
- [ ] Tests E2E sur les branches principales
- [ ] Tests de performance et régression
- [ ] Métriques de code (complexité, duplication)

### ✅ **Déploiement**
- [ ] Déploiement automatique en staging
- [ ] Approbation manuelle pour production
- [ ] Tests de fumée post-déploiement
- [ ] Stratégie de rollback automatique
- [ ] Monitoring et alertes

### ✅ **Monitoring**
- [ ] Métriques de pipeline
- [ ] Notifications Slack/Teams
- [ ] Rapports de sécurité
- [ ] Dashboard de santé CI/CD

## 🔗 Navigation

- **Précédent :** [07-dependency-management.md](./07-dependency-management.md) - Gestion des dépendances
- **Suivant :** [09-ai-lexicon.md](./09-ai-lexicon.md) - Lexique pour IA
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Pipeline CI/CD et Déploiement Continu*
