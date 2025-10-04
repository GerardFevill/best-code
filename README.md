# @cosmospark/best-code

[![npm version](https://badge.fury.io/js/%40cosmospark%2Fbest-code.svg)](https://badge.fury.io/js/%40cosmospark%2Fbest-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Auto Deploy](https://img.shields.io/badge/deploy-automated-success)](https://github.com/GerardFevill/best-code/actions)

> BestCode gives developers and AI assistants the tools to write clean, secure, and maintainable code by default. It enforces best practices, encourages atomic and meaningful commits, and prevents chaotic or bloated pushes. With BestCode, you focus on building valuable features — while it ensures technical excellence behind the scenes.

A collection of utility functions with intelligent development tools and automated deployment pipeline.

## 🚀 Features

- **🎯 Core Functions**: `hello`, `welcome`, `capitalize`, `slugify`
- **🤖 Smart Commits**: Intelligent commit message generation
- **📈 Auto Versioning**: Semantic versioning based on changes
- **🔄 CI/CD Pipeline**: Automated testing and NPM publishing
- **🛠️ Dev Tools**: Professional development workflow

## 📁 Project Structure

```
├── index.js              # 🎯 Core utility functions
├── tools/                # 🛠️ Development automation
│   ├── commit-push.bat   # Smart commit with change detection
│   ├── quick-commit.bat  # Quick commit with auto-messages
│   └── setup-git.bat     # Git repository initialization
├── .github/workflows/    # 🚀 CI/CD automation
│   └── publish.yml       # Auto-versioning and NPM publishing
├── package.json          # 📦 Package configuration
└── README.md            # 📚 This documentation
```

## 🚀 Installation

```bash
npm install @cosmospark/best-code
```

## 📖 Usage

### Core Functions

```javascript
// ES6 Modules
import { hello, welcome, capitalize, slugify } from '@cosmospark/best-code';

// CommonJS
const { hello, welcome, capitalize, slugify } = require('@cosmospark/best-code');
```

#### `hello(name, greeting?)` - Smart Greetings
```javascript
console.log(hello('Alice'));           // "Hello, Alice!"
console.log(hello('Bob', 'Hey'));      // "Hey, Bob!"
```

#### `welcome(name)` - Timestamped Welcome
```javascript
console.log(welcome('Developer'));     
// "Bienvenue Developer! Il est actuellement 04/10/2025 à 01:23:45"
```

#### `capitalize(str)` - Smart Capitalization
```javascript
console.log(capitalize('hello world')); // "Hello world"
console.log(capitalize('JAVASCRIPT'));  // "Javascript"
```

#### `slugify(text)` - URL-Friendly Slugs
```javascript
console.log(slugify('Hello World!'));   // "hello-world"
console.log(slugify('My Super Title')); // "my-super-title"
```

## 🛠️ Development Tools

### Smart Commit System

```bash
# Interactive commit with intelligent message detection
npm run commit

# Quick commit with auto-generated messages
npm run push

# Git repository setup
npm run setup
```

### Automated Workflow

The package includes intelligent commit message generation based on file changes:

- **📦 Package changes** → `feat: update package configuration`
- **📚 Documentation** → `docs: update documentation`
- **💻 Code changes** → `feat: update core functionality`
- **🔧 Tools changes** → `chore: update development tools`
- **📈 Version changes** → `release: bump version`

## 🚀 CI/CD Pipeline

### Automated Versioning

The package uses semantic versioning with intelligent detection:

- **🔧 PATCH** (1.0.0 → 1.0.1): Bug fixes, documentation, tools
- **✨ MINOR** (1.0.0 → 1.1.0): New features, core functionality updates  
- **💥 MAJOR** (1.0.0 → 2.0.0): Breaking changes (manual trigger)

### GitHub Actions Workflow

Every push to `main` triggers:

1. **🔍 Change Detection** - Analyzes modified files
2. **📈 Version Increment** - Auto-bumps version based on changes
3. **🧪 Testing** - Runs package tests
4. **📤 NPM Publishing** - Publishes to npm registry
5. **🏷️ Git Tagging** - Creates version tags

## 📋 API Reference

### `hello(name, greeting?): string`
- **name** `string` - Person's name (required)
- **greeting** `string` - Greeting type (optional, default: "Hello")
- **Returns** `string` - Formatted greeting message
- **Throws** `Error` - If name is not a non-empty string

### `welcome(name): string`
- **name** `string` - Person's name
- **Returns** `string` - Welcome message with timestamp

### `capitalize(str): string`
- **str** `string` - String to capitalize
- **Returns** `string` - String with first letter capitalized

### `slugify(text): string`
- **text** `string` - Text to convert to slug
- **Returns** `string` - URL-friendly slug

## 🧪 Testing & Development

```bash
# Test the package
npm test

# Run examples
npm start

# Development workflow
npm run commit    # Smart commit
npm run push      # Quick commit
npm run setup     # Git setup
```

## 🏗️ Architecture

### Best Practices Enforced

- **🎯 Atomic Commits**: Each commit focuses on a single change
- **📝 Meaningful Messages**: Auto-generated based on actual changes
- **📈 Semantic Versioning**: Automatic version management
- **🔄 Continuous Integration**: Automated testing and deployment
- **🛡️ Quality Gates**: Pre-publish validation and testing

### Development Philosophy

BestCode embodies the principle that **good tooling enables good code**. By automating the mundane aspects of development workflow, developers can focus on creating value while maintaining high standards.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Use** the smart commit tools (`npm run commit`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

The automated tools will ensure your commits follow best practices!

## 📞 Support

- 🐛 [Report Issues](https://github.com/GerardFevill/best-code/issues)
- 💡 [Request Features](https://github.com/GerardFevill/best-code/issues)
- 📧 Contact: gerard.nouglozeh@protonmail.com
- 🚀 [GitHub Actions](https://github.com/GerardFevill/best-code/actions)

## 📈 Changelog

### v1.0.1 - Current
- 🤖 Smart commit message generation
- 📈 Automated semantic versioning
- 🚀 CI/CD pipeline with GitHub Actions
- 🛠️ Professional development tools

### v1.0.0 - Initial Release
- ✨ Core utility functions
- 📚 Complete documentation
- 🎯 NPM package ready

---

**Made with ❤️ and best practices by [GerardFevill](https://github.com/GerardFevill)**

*BestCode: Where clean code meets intelligent automation* 🚀
