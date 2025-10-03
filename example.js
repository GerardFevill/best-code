/**
 * Exemple d'utilisation de @cosmospark/best-code
 * Ce fichier démontre comment utiliser toutes les fonctions du package
 */

const { hello, welcome, capitalize, slugify } = require('./index.js');

console.log('='.repeat(50));
console.log('  Exemples d\'utilisation de @cosmospark/best-code');
console.log('='.repeat(50));
console.log();

// Test de la fonction hello
console.log('🔹 Fonction hello():');
console.log('  hello("Alice"):', hello("Alice"));
console.log('  hello("Bob", "Salut"):', hello("Bob", "Salut"));
console.log('  hello("Charlie", "Hey"):', hello("Charlie", "Hey"));
console.log();

// Test de la fonction welcome
console.log('🔹 Fonction welcome():');
console.log('  welcome("Développeur"):', welcome("Développeur"));
console.log('  welcome("Utilisateur"):', welcome("Utilisateur"));
console.log();

// Test de la fonction capitalize
console.log('🔹 Fonction capitalize():');
console.log('  capitalize("hello world"):', capitalize("hello world"));
console.log('  capitalize("JAVASCRIPT"):', capitalize("JAVASCRIPT"));
console.log('  capitalize("tYpEsCrIpT"):', capitalize("tYpEsCrIpT"));
console.log();

// Test de la fonction slugify
console.log('🔹 Fonction slugify():');
console.log('  slugify("Hello World!"):', slugify("Hello World!"));
console.log('  slugify("Mon Super Article"):', slugify("Mon Super Article"));
console.log('  slugify("Ça marche très bien!"):', slugify("Ça marche très bien!"));
console.log('  slugify("Test_avec-des espaces"):', slugify("Test_avec-des espaces"));
console.log();

console.log('='.repeat(50));
console.log('  Tous les tests sont terminés ! ✅');
console.log('='.repeat(50));
