/**
 * @relia-scope/hello-utils
 * Petite librairie utilitaire pour les salutations et fonctions d'aide
 */

/**
 * Génère un message de salutation personnalisé
 * @param {string} name - Le nom de la personne à saluer
 * @param {string} [greeting='Hello'] - Le type de salutation
 * @returns {string} Le message de salutation formaté
 */
function hello(name, greeting = 'Hello') {
  if (!name || typeof name !== 'string') {
    throw new Error('Le paramètre "name" doit être une chaîne non vide');
  }
  
  return `${greeting}, ${name}!`;
}

/**
 * Génère un message de bienvenue avec l'heure actuelle
 * @param {string} name - Le nom de la personne
 * @returns {string} Message de bienvenue avec timestamp
 */
function welcome(name) {
  const now = new Date().toLocaleString('fr-FR');
  return `Bienvenue ${name}! Il est actuellement ${now}`;
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param {string} str - La chaîne à capitaliser
 * @returns {string} La chaîne avec la première lettre en majuscule
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') {
    return str;
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Génère un slug URL-friendly à partir d'une chaîne
 * @param {string} text - Le texte à convertir en slug
 * @returns {string} Le slug généré
 */
function slugify(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplace espaces et underscores par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

// Export des fonctions
module.exports = {
  hello,
  welcome,
  capitalize,
  slugify
};

// Export par défaut pour ES6
module.exports.default = {
  hello,
  welcome,
  capitalize,
  slugify
};

// Exemple d'utilisation si le fichier est exécuté directement
if (require.main === module) {
  console.log('🚀 Test de @relia-scope/hello-utils');
  console.log('');
  console.log(hello('Relia'));
  console.log(hello('Monde', 'Bonjour'));
  console.log(welcome('Développeur'));
  console.log('Capitalize:', capitalize('hello world'));
  console.log('Slugify:', slugify('Hello World! Comment ça va?'));
}
