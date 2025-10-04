#!/usr/bin/env node
// @ai-refactor: Script de migration vers TypeScript suivant BestCode

const fs = require('fs');
const path = require('path');

console.log('🚀 Migration BestCode vers TypeScript');
console.log('=====================================\n');

// Étapes de migration
const migrationSteps = [
  {
    name: 'Vérification des prérequis',
    check: () => {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion < 18) {
        throw new Error(`Node.js 18+ requis. Version actuelle: ${nodeVersion}`);
      }
      
      console.log('✅ Node.js version compatible:', nodeVersion);
      return true;
    }
  },
  {
    name: 'Vérification de la structure TypeScript',
    check: () => {
      const requiredFiles = [
        'tsconfig.json',
        'tsconfig.build.json',
        'tsconfig.test.json',
        'src/index.ts',
        'src/types/index.ts',
        'jest.config.js'
      ];
      
      const missingFiles = requiredFiles.filter(file => 
        !fs.existsSync(path.join(process.cwd(), file))
      );
      
      if (missingFiles.length > 0) {
        throw new Error(`Fichiers manquants: ${missingFiles.join(', ')}`);
      }
      
      console.log('✅ Structure TypeScript complète');
      return true;
    }
  },
  {
    name: 'Vérification de la configuration BestCode',
    check: () => {
      const configPath = path.join(process.cwd(), 'bestcode.config.json');
      
      if (!fs.existsSync(configPath)) {
        throw new Error('bestcode.config.json manquant');
      }
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      if (!config.ai || !config.ai.refactor) {
        throw new Error('Configuration AI manquante dans bestcode.config.json');
      }
      
      console.log('✅ Configuration BestCode valide');
      console.log(`   - Refactoring IA: ${config.ai.refactor ? 'activé' : 'désactivé'}`);
      console.log(`   - Niveau sécurité: ${config.security?.auditLevel || 'non défini'}`);
      console.log(`   - Types stricts: ${config.typescript?.strict ? 'activé' : 'désactivé'}`);
      
      return true;
    }
  },
  {
    name: 'Vérification des patterns de sécurité',
    check: () => {
      const validationPath = path.join(process.cwd(), 'src/utils/validation.ts');
      
      if (!fs.existsSync(validationPath)) {
        throw new Error('Module de validation manquant');
      }
      
      const validationContent = fs.readFileSync(validationPath, 'utf8');
      
      // Vérifier les patterns de sécurité
      const securityPatterns = [
        'validateString',
        'validateName',
        'ValidationError',
        'sanitized'
      ];
      
      const missingPatterns = securityPatterns.filter(pattern => 
        !validationContent.includes(pattern)
      );
      
      if (missingPatterns.length > 0) {
        throw new Error(`Patterns de sécurité manquants: ${missingPatterns.join(', ')}`);
      }
      
      console.log('✅ Patterns de sécurité implémentés');
      return true;
    }
  },
  {
    name: 'Vérification des tests',
    check: () => {
      const testFiles = [
        'tests/greeting.test.ts',
        'tests/string-utils.test.ts',
        'tests/setup.ts'
      ];
      
      const missingTests = testFiles.filter(file => 
        !fs.existsSync(path.join(process.cwd(), file))
      );
      
      if (missingTests.length > 0) {
        throw new Error(`Fichiers de test manquants: ${missingTests.join(', ')}`);
      }
      
      console.log('✅ Suite de tests complète');
      return true;
    }
  }
];

// Exécution des vérifications
async function runMigrationChecks() {
  console.log('Vérification de la migration BestCode...\n');
  
  let allChecksPass = true;
  
  for (const step of migrationSteps) {
    try {
      console.log(`🔍 ${step.name}...`);
      step.check();
      console.log('');
    } catch (error) {
      console.error(`❌ ${step.name}: ${error.message}\n`);
      allChecksPass = false;
    }
  }
  
  if (allChecksPass) {
    console.log('🎉 Migration BestCode réussie !');
    console.log('\n📋 Prochaines étapes recommandées:');
    console.log('   1. npm install          # Installer les dépendances TypeScript');
    console.log('   2. npm run build        # Compiler le projet');
    console.log('   3. npm test             # Lancer les tests');
    console.log('   4. npm run dev src/demo.ts  # Tester la démo');
    console.log('\n📚 Documentation: README-TypeScript.md');
    console.log('🔗 Guide complet: docs/nodejs-typescript-reference.md');
  } else {
    console.log('❌ Migration incomplète. Veuillez corriger les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Exécution
if (require.main === module) {
  runMigrationChecks().catch(error => {
    console.error('❌ Erreur lors de la vérification:', error.message);
    process.exit(1);
  });
}

module.exports = { runMigrationChecks };
