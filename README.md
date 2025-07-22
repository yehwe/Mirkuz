# Mirkuz Frontend

A modern React TypeScript application built with Vite and Material-UI.

## Project Structure

```
Mirkuz-FE/
├── Mirkuz/
│   ├── src/
│   │   ├── Api/          # API integration and services
│   │   ├── Assets/       # Static assets (images, fonts, etc.)
│   │   ├── Components/   # Reusable UI components
│   │   ├── Pages/        # Page components
│   │   ├── App.tsx       # Main application component
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Global styles
│   ├── public/           # Public static files
│   ├── dist/             # Build output directory
│   ├── index.html        # HTML entry point
│   ├── vite.config.ts    # Vite configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── package.json      # Project dependencies
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Vite for fast development and building
- Material-UI for component library

## Project Organization

- `src/Api`: API integration and service layer
- `src/Components`: Reusable UI components
- `src/Pages`: Page-level components
- `src/Assets`: Static assets like images and fonts

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build
