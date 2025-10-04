# 🏗️ Architectures de Projet BestCode

> Guide des structures de projet recommandées pour différents types d'applications Node.js TypeScript.

## 📁 Architectures Recommandées

### 🌐 Serveur API/Web (Express, Fastify, etc.)

```
my-api-project/
├── src/                          # Code source TypeScript
│   ├── controllers/              # Contrôleurs HTTP avec annotations Swagger
│   ├── services/                 # Logique métier
│   ├── models/                   # Modèles de données avec schémas OpenAPI
│   ├── routes/                   # Définition des routes
│   ├── middleware/               # Middlewares Express
│   ├── utils/                    # Utilitaires
│   ├── types/                    # Définitions de types
│   ├── config/                   # Configuration
│   ├── database/                 # Connexions DB, migrations
│   ├── swagger/                  # Configuration Swagger/OpenAPI
│   │   ├── swagger.config.ts     # Configuration Swagger
│   │   ├── schemas/              # Schémas OpenAPI
│   │   └── decorators.ts         # Décorateurs pour documentation
│   └── index.ts                  # Point d'entrée serveur
├── dist/                         # Code JavaScript compilé
├── docs/                         # Documentation générée
│   ├── api/                      # Documentation API Swagger
│   └── swagger.json              # Spécification OpenAPI générée
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── ...                          # Fichiers de config
```

**🎯 Cas d'usage :** API REST, applications web, backends
**📦 Dépendances clés :** express, helmet, cors, joi, winston, swagger-jsdoc, swagger-ui-express
**📚 Documentation :** Génération automatique Swagger/OpenAPI

### 📚 Librairie NPM

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

**🎯 Cas d'usage :** Packages NPM, utilitaires réutilisables
**📦 Dépendances clés :** typescript, rollup, jest, typedoc

### 🛠️ CLI Tool

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

**🎯 Cas d'usage :** Outils en ligne de commande, générateurs
**📦 Dépendances clés :** commander, inquirer, chalk, ora

### ⚡ Microservice

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

**🎯 Cas d'usage :** Architecture microservices, conteneurs
**📦 Dépendances clés :** fastify, pino, node-config, helmet

### 🔄 Worker/Background Jobs

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

**🎯 Cas d'usage :** Traitement asynchrone, tâches planifiées
**📦 Dépendances clés :** bull, agenda, node-cron, ioredis

### 🏗️ Monorepo (Lerna/Nx)

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

**🎯 Cas d'usage :** Projets multi-packages, équipes multiples
**📦 Dépendances clés :** lerna, nx, typescript, jest

## 🎯 Matrice de Sélection d'Architecture

| Critère | API/Web | Library | CLI | Microservice | Worker | Monorepo |
|---------|---------|---------|-----|--------------|--------|----------|
| **Complexité** | Moyenne | Faible | Faible | Élevée | Moyenne | Très élevée |
| **Équipe** | 2-10 | 1-3 | 1-5 | 3-8 | 2-5 | 10+ |
| **Déploiement** | Serveur | NPM | NPM/Binary | Container | Serveur/Queue | Multiple |
| **Maintenance** | Moyenne | Faible | Moyenne | Élevée | Moyenne | Très élevée |

## 📋 Checklist de Structure

### ✅ Obligatoire pour tous les projets
- [ ] `src/` avec code TypeScript source
- [ ] `tests/` avec tests unitaires
- [ ] `package.json` avec scripts standards
- [ ] `tsconfig.json` avec configuration stricte
- [ ] `README.md` avec documentation
- [ ] `.gitignore` avec exclusions appropriées
- [ ] `LICENSE` avec licence claire

### ✅ Recommandé selon le type
- [ ] `docs/` pour documentation détaillée
- [ ] `examples/` pour cas d'usage
- [ ] `benchmarks/` pour tests de performance
- [ ] `docker/` pour conteneurisation
- [ ] `scripts/` pour outils de développement

## 🔗 Navigation

- **Suivant :** [02-configuration.md](./02-configuration.md) - Configuration TypeScript et outils
- **Retour :** [README.md](./README.md) - Index de la documentation

---

**Guide BestCode** | *Architecture et Structure de Projet*
