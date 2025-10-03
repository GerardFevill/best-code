# @relia-scope/hello-utils

[![npm version](https://badge.fury.io/js/%40relia-scope%2Fhello-utils.svg)](https://badge.fury.io/js/%40relia-scope%2Fhello-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

> Petite librairie utilitaire pour les salutations et fonctions d'aide

Une collection de fonctions utilitaires simples et efficaces pour gérer les salutations, la capitalisation et la génération de slugs.

## 🚀 Installation

```bash
npm install @relia-scope/hello-utils
```

## 📖 Utilisation

### Import ES6/CommonJS

```javascript
// ES6 Modules
import { hello, welcome, capitalize, slugify } from '@relia-scope/hello-utils';

// CommonJS
const { hello, welcome, capitalize, slugify } = require('@relia-scope/hello-utils');
```

### Exemples d'utilisation

#### Fonction `hello(name, greeting?)`

Génère un message de salutation personnalisé.

```javascript
const { hello } = require('@relia-scope/hello-utils');

console.log(hello('Relia'));
// Output: "Hello, Relia!"

console.log(hello('Monde', 'Bonjour'));
// Output: "Bonjour, Monde!"
```

#### Fonction `welcome(name)`

Génère un message de bienvenue avec l'heure actuelle.

```javascript
const { welcome } = require('@relia-scope/hello-utils');

console.log(welcome('Développeur'));
// Output: "Bienvenue Développeur! Il est actuellement 04/10/2025 à 00:37:59"
```

#### Fonction `capitalize(str)`

Capitalise la première lettre d'une chaîne.

```javascript
const { capitalize } = require('@relia-scope/hello-utils');

console.log(capitalize('hello world'));
// Output: "Hello world"

console.log(capitalize('JAVASCRIPT'));
// Output: "Javascript"
```

#### Fonction `slugify(text)`

Génère un slug URL-friendly à partir d'une chaîne.

```javascript
const { slugify } = require('@relia-scope/hello-utils');

console.log(slugify('Hello World! Comment ça va?'));
// Output: "hello-world-comment-ca-va"

console.log(slugify('Mon Super Titre_avec des espaces'));
// Output: "mon-super-titre-avec-des-espaces"
```

## 📋 API Reference

### `hello(name, greeting?): string`

- **name** `string` - Le nom de la personne à saluer (requis)
- **greeting** `string` - Le type de salutation (optionnel, défaut: "Hello")
- **Returns** `string` - Le message de salutation formaté
- **Throws** `Error` - Si le paramètre name n'est pas une chaîne non vide

### `welcome(name): string`

- **name** `string` - Le nom de la personne
- **Returns** `string` - Message de bienvenue avec timestamp

### `capitalize(str): string`

- **str** `string` - La chaîne à capitaliser
- **Returns** `string` - La chaîne avec la première lettre en majuscule

### `slugify(text): string`

- **text** `string` - Le texte à convertir en slug
- **Returns** `string` - Le slug généré (URL-friendly)

## 🧪 Test

Pour tester le package localement :

```bash
npm start
```

## 🛠️ Développement

### Prérequis

- Node.js >= 14.0.0
- npm >= 6.0.0

### Installation des dépendances

```bash
npm install
```

### Scripts disponibles

- `npm start` - Exécute le fichier principal avec des exemples
- `npm run build` - Pas de build nécessaire (vanilla JS)
- `npm test` - Lance les tests (à implémenter)

## 📄 License

Ce projet est sous licence [MIT](LICENSE).

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📞 Support

Si vous avez des questions ou des problèmes :

- 🐛 [Signaler un bug](https://github.com/relia/hello-utils/issues)
- 💡 [Demander une feature](https://github.com/relia/hello-utils/issues)
- 📧 Contact: relia@example.com

## 📈 Changelog

### v1.0.0
- ✨ Première version
- 🎉 Fonctions `hello`, `welcome`, `capitalize`, `slugify`
- 📚 Documentation complète
- 🚀 Prêt pour la publication NPM

---

Made with ❤️ by [Relia](https://github.com/relia)
