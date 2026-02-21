# elegance-parfumee

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Project Overview

`elegance-parfumee` is a Vue 3 application scaffolded with Vite. This project aims to provide a modern and efficient development environment for building web applications using Vue.js.

## Features

- **Vue 3**: Leverage the latest features of Vue.js for building interactive user interfaces.
- **Vite**: Fast development server and optimized build process.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
# Clone the repository
git clone <repository-url>

# Navigate into the project directory
cd elegance-parfumee

# Install dependencies
npm install
```

## Development

To start the development server, run:

```bash
npm run dev
```

This will start the application and you can view it in your browser at `http://localhost:3000`.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized build in the `dist` directory.

## Testing

To run tests, use:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Project Creation Documentation

### Steps Taken Today

1. **Project Initialization**: The project `elegance-parfumee` was initialized using Vue 3 and Vite.
2. **README Documentation**: The README file was updated to include:
   - Project overview and features.
   - Installation instructions for setting up the project.
   - Development and production build instructions.
   - Testing guidelines and contribution information.

### Additional Pages

- **HomeView.vue**: Main landing page of the application.
- **ProductsPage.vue**: Displays a list of products available for purchase.
- **CartSidebar.vue**: Sidebar component for managing the shopping cart.
- **Footer.vue**: Footer component for the application.
- **Header.vue**: Header component containing navigation links.

These components are designed to enhance user experience and provide a seamless shopping experience.

### Vue d'ensemble des Vues

- **AproposView.vue** : Page d'information sur le projet et son équipe.
- **CollectionView.vue** : Affiche une collection de produits ou d'articles.
- **Femme.vue** : Page dédiée aux produits féminins.
- **HomeView.vue** : Page d'accueil principale de l'application.
- **Homme.vue** : Page dédiée aux produits masculins.
- **LoginView.vue** : Page de connexion pour les utilisateurs.

Ces vues sont conçues pour offrir une navigation fluide et une expérience utilisateur agréable.



# 🌸 Élégance Parfumée

> Application e-commerce de parfumerie développée avec **Vue.js 3**, **Pinia** et **Tailwind CSS**.

---

## 📋 Présentation

**Élégance Parfumée** est une boutique en ligne spécialisée dans la vente de parfums haut de gamme. Elle propose une expérience utilisateur moderne et fluide grâce à une architecture **SPA (Single Page Application)**.

Le projet a été migré d'une version HTML/CSS/JS vanilla vers **Vue.js 3** afin d'améliorer la maintenabilité, la réactivité et la scalabilité de l'application.

---

## 🚀 Technologies utilisées

| Technologie | Version | Rôle |
|-------------|---------|------|
| Vue.js | 3.x | Framework JavaScript frontend |
| Vue Router | 4.x | Gestion de la navigation |
| Pinia | 2.x | Gestion de l'état global |
| Tailwind CSS | 3.x | Framework CSS utilitaire |
| Font Awesome | 6.4.0 | Icônes |
| Vite | 5.x | Bundler et serveur de développement |

---

## ✨ Fonctionnalités

- 🏠 **Page d'accueil** avec hero section, catégories et best-sellers
- 👨 **Page Homme** — produits filtrés par genre via l'API
- 👩 **Page Femme** — produits filtrés par genre via l'API
- 🗂️ **Page Collections** — tous les produits disponibles
- ℹ️ **Page À propos** — présentation de la boutique
- 🛒 **Panier dynamique** — ajout, suppression, modification des quantités
- 💾 **Persistance du panier** — sauvegarde dans le localStorage
- 📦 **Modal détails produit** — vue détaillée de chaque parfum
- 📱 **Design responsive** — adapté mobile, tablette et desktop
- 🔐 **Authentification** — connexion/déconnexion avec token JWT

---

## 📁 Structure du projet

```
elegance-parfumee/
├── public/
├── src/
│   ├── assets/
│   │   └── main.css          # Styles globaux + Tailwind
│   ├── components/
│   │   ├── Header.vue        # Barre de navigation
│   │   ├── Footer.vue        # Pied de page
│   │   ├── ProductCard.vue   # Carte produit réutilisable
│   │   ├── ProductsPage.vue  # Page produits générique
│   │   └── CartSidebar.vue   # Sidebar panier
│   ├── views/
│   │   ├── HomeView.vue      # Page d'accueil
│   │   ├── HommeView.vue     # Page parfums homme
│   │   ├── FemmeView.vue     # Page parfums femme
│   │   ├── CollectionsView.vue # Toutes les collections
│   │   └── AProposView.vue   # Page à propos
│   ├── stores/
│   │   └── cartStore.js      # Store Pinia — gestion du panier
│   ├── router/
│   │   └── index.js          # Configuration Vue Router
│   ├── App.vue               # Composant racine
│   └── main.js               # Point d'entrée
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## ⚙️ Installation et démarrage

### Prérequis

- **Node.js** v18 ou supérieur
- **npm** v9 ou supérieur

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/ton-username/elegance-parfumee.git

# 2. Accéder au dossier
cd elegance-parfumee

# 3. Installer les dépendances
npm install

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

### Build pour la production

```bash
npm run build
```

---

## 🌐 API Backend

L'application consomme une API REST hébergée sur **Render**.

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/products/get_product` | GET | Tous les produits |
| `/api/products/genre/Homme` | GET | Produits homme |
| `/api/products/genre/Femme` | GET | Produits femme |
| `/api/cart/add` | POST | Ajouter au panier |
| `/api/cart/sync` | POST | Synchroniser le panier |
| `/api/cart/remove/:id` | DELETE | Supprimer du panier |

**Base URL :** `https://luxeparfum-backend.onrender.com`

---

## 🗺️ Routes de l'application

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomeView | Page d'accueil |
| `/homme` | HommeView | Parfums homme |
| `/femme` | FemmeView | Parfums femme |
| `/collections` | CollectionsView | Toutes les collections |
| `/apropos` | AProposView | À propos |

---

## 🧠 Concepts Vue.js utilisés

- **Composants** — architecture modulaire et réutilisable
- **Props & Emits** — communication entre composants
- **v-for, v-if, v-else** — rendu conditionnel et listes
- **v-model** — liaison bidirectionnelle
- **computed** — propriétés calculées réactives
- **mounted()** — cycle de vie des composants
- **Vue Router** — navigation SPA sans rechargement
- **Pinia** — gestion d'état global du panier
- **:class & :style** — styles dynamiques

---

## 👨‍💻 Auteur

**Élégance Parfumée** — Projet e-commerce  
📍 Cocody, Abidjan, Côte d'Ivoire  
📧 contact@luxeparfum.ci  
📞 +225 07 07 07 07 07

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

*© 2024 Élégance Parfumée. Tous droits réservés.*