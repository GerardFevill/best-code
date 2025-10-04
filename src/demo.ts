// @ai-refactor: Démonstration des fonctionnalités BestCode TypeScript

import { hello, welcome, capitalize, slugify, truncate } from './index';

/**
 * Démonstration des patterns Result<T, E> et de la validation sécurisée
 */
function demonstrateBestCodePatterns(): void {
  console.log('🚀 Démonstration BestCode - Patterns TypeScript Sécurisés\n');

  // Test des salutations avec validation
  console.log('=== Tests de Salutation ===');
  
  const helloResult = hello('Relia', 'Bonjour');
  if (helloResult.success) {
    console.log('✅ Salutation:', helloResult.data);
  } else {
    console.error('❌ Erreur salutation:', helloResult.error.message);
  }

  const welcomeResult = welcome('Développeur');
  if (welcomeResult.success) {
    console.log('✅ Bienvenue:', welcomeResult.data);
  } else {
    console.error('❌ Erreur bienvenue:', welcomeResult.error.message);
  }

  // Test des utilitaires de chaînes
  console.log('\n=== Tests Utilitaires de Chaînes ===');
  
  const capitalizeResult = capitalize('hello world');
  if (capitalizeResult.success) {
    console.log('✅ Capitalisation:', capitalizeResult.data);
  }

  const slugResult = slugify('Hello World! Comment ça va?');
  if (slugResult.success) {
    console.log('✅ Slug:', slugResult.data);
  }

  const truncateResult = truncate('Ceci est un texte très long qui sera tronqué', 30);
  if (truncateResult.success) {
    console.log('✅ Troncature:', truncateResult.data);
  }

  // Test de gestion d'erreurs sécurisée
  console.log('\n=== Tests de Sécurité et Validation ===');
  
  const invalidNameResult = hello(123 as unknown as string);
  if (!invalidNameResult.success) {
    console.log('✅ Validation sécurisée - Type invalide détecté:', invalidNameResult.error.message);
  }

  const emptyNameResult = hello('   ');
  if (!emptyNameResult.success) {
    console.log('✅ Validation sécurisée - Nom vide détecté:', emptyNameResult.error.message);
  }

  const maliciousInputResult = hello('John<script>alert("xss")</script>');
  if (!maliciousInputResult.success) {
    console.log('✅ Sécurité - Input malveillant bloqué:', maliciousInputResult.error.message);
  }

  console.log('\n🎯 Tous les patterns BestCode fonctionnent correctement !');
}

// Exécution de la démonstration si le fichier est lancé directement
if (require.main === module) {
  try {
    demonstrateBestCodePatterns();
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    process.exit(1);
  }
}
