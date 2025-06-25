# Art Gallery Explorer

An interactive web gallery that showcases renowned art pieces from the Rijksmuseum collection along with captivating facts and descriptions.

## Project Overview

Art Gallery Explorer fetches artwork images and data from the Rijksmuseum Search API and displays them in a visually appealing gallery format. The application provides detailed information about each artwork and enables users to explore the world of art.

## Features

- Browse through high-quality art images from the Rijksmuseum collection
- View detailed descriptions and facts about art pieces
- Responsive design for optimal viewing on various devices
- Interactive UI elements for enhanced user experience
- [Additional features implemented...]

## Technologies Used

- [Vite](https://vitejs.dev/guide/) - Frontend build tool
- [HeroUI](https://heroui.com) - UI component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Tailwind Variants](https://tailwind-variants.org) - For component variants
- [TypeScript](https://www.typescriptlang.org) - Type-safe JavaScript
- [Framer Motion](https://www.framer.com/motion) - Animation library
- Rijksmuseum API - Source for artwork data

## API Integration

This project integrates with:

- **Rijksmuseum Search API**: Provides access to the museum's collection, including high-resolution images and detailed information about artworks
- API formatting follows the [Linked Art Search specification](https://linked.art/api/1.0/search/#search-response-format)

## Project Tasks

### 1. Configuration du projet ✅

- Créer le projet avec Vite et configurer TypeScript
- Installer les dépendances (HeroUI, Tailwind CSS, Tailwind Variants, Framer Motion)
- Configurer Tailwind CSS
- Mettre en place la structure de base du projet

### 2. API et types ✅

- Créer le fichier d'interface pour les types d'œuvres d'art (`types/artwork.ts`)
- Implémenter le module d'intégration API Rijksmuseum (`api/rijksmuseum.ts`)
- Créer des fonctions utilitaires pour traiter les réponses API

### 3. Fonctionnalités principales

- Créer le composant ArtworkCard pour afficher une œuvre d'art
- Développer le composant Gallery pour la grille d'œuvres d'art
- Implémenter le composant ArtworkModal pour la vue détaillée
- Créer les animations avec Framer Motion

### 4. Intégration et état de l'application

- Configurer le flux de données dans le composant App.tsx
- Implémenter la gestion d'état pour les œuvres d'art
- Gérer les erreurs API et les états de chargement
- Connecter tous les composants ensemble

### 5. Déploiement

- Configurer le build de production
- Préparer la documentation
- Déployer sur une plateforme d'hébergement

## Setup and Installation

### Clone the repository

```bash
git clone [https://github.com/joachimageron/Art-Gallery-Explorer]
cd art-gallery-explorer
```

### Install dependencies

```bash
bun install
```

### Run the development server

```bash
bun dev
```

### Building for production

```bash
bun run build
```

## Project Structure

```
src/
├── api/
│   └── rijksmuseum.ts       # API functions for Rijksmuseum
├── components/
│   ├── ArtworkCard.tsx      # Individual artwork display
│   ├── ArtworkModal.tsx     # Modal for detailed artwork view
│   ├── Gallery.tsx          # Main gallery grid component
│   ├── Header.tsx           # App header with title
│   ├── Footer.tsx           # App footer
│   └── Loader.tsx           # Loading indicator
├── types/
│   └── artwork.ts           # TypeScript interfaces for artwork data
├── App.tsx                  # Main application component
├── main.tsx                 # Entry point
├── index.css                # Global styles
└── utils.ts                 # Helper functions
```

## Implementation Details

### Research and Planning

Before diving into development, I conducted thorough research to understand the project requirements:

1. Explored various art gallery website examples beyond those suggested in the assignment to gather inspiration for UI/UX design patterns
2. Studied the Rijksmuseum API documentation to understand:
   - Available endpoints and their functionality
   - Authentication requirements and API key setup
   - Response structure and data format
   - Image resolution options and constraints
3. Tested API calls using Postman to verify responses and plan the data processing approach
4. Examined similar projects to identify best practices for presenting art collections digitally

This research phase helped establish a clear vision for the application architecture and user experience before beginning implementation.

### Development Approach

[To be completed with implementation details]

## Future Enhancements

- Search functionality for finding specific art pieces or artists
- User authentication to save favorite artworks
- Additional filtering options for exploring the collection
- [To be completed with other planned enhancements]
