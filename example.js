/**
 * Exemple d'utilisation de @cosmospark/best-code
 */

const { hello, welcome, capitalize, slugify } = require('./index.js');

console.log('=== Test @cosmospark/best-code ===');
console.log();

// Tests des fonctions
console.log('hello("Alice"):', hello("Alice"));
console.log('hello("Bob", "Salut"):', hello("Bob", "Salut"));
console.log();

console.log('welcome("Développeur"):', welcome("Développeur"));
console.log();

console.log('capitalize("hello world"):', capitalize("hello world"));
console.log('capitalize("JAVASCRIPT"):', capitalize("JAVASCRIPT"));
console.log();

console.log('slugify("Hello World!"):', slugify("Hello World!"));
console.log('slugify("Mon Super Article"):', slugify("Mon Super Article"));
console.log();

console.log('✅ Tous les tests OK !');
