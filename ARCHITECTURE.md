# WorldNotes Architecture

## Overview

WorldNotes is a 3D world exploration and annotation system built on Gaussian Splatting (SPZ) environments. The architecture separates concerns into three main components:

- **Core Module** (`@worldnotes/core`): Shared functionality for both applications
- **Editor App** (`worldnotes-editor`): Full-featured scene creation and editing
- **Viewer App** (`worldnotes-viewer`): Read-only scene viewing and exploration

## Project Structure

```
├── packages/
│   └── core/                      # @worldnotes/core - Shared module
│       ├── src/
│       │   ├── types.ts           # TypeScript interfaces
│       │   ├── persistence/       # Scene serialization
│       │   └── services/          # Storage client (S3 + Cognito)
│       ├── package.json
│       ├── tsconfig.json
│       └── vitest.config.ts
│
├── apps/
│   ├── editor/                    # worldnotes-editor app
│   │   ├── public/
│   │   │   └── index.html         # Entry HTML with importmap
│   │   ├── src/
│   │   │   └── main.ts            # Editor entry point
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── viewer/                    # worldnotes-viewer app
│       ├── public/
│       │   └── index.html         # Entry HTML with importmap
│       ├── src/
│       │   └── main.ts            # Viewer entry point
│       ├── vite.config.ts
│       └── package.json
│
└── ARCHITECTURE.md                # This file
```

## Core Module (`@worldnotes/core`)

The core module provides shared functionality:

### Types (`src/types.ts`)
- `Vector3` - 3D position/rotation
- `CameraPose` - Camera position and rotation
- `Treat` / `TreatData` - 3D object with optional message
- `TreatType` - Built-in types (geomarker, bottle) or custom
- `AppMode` - 'explore' or 'edit'

### Persistence (`src/persistence/`)
- `SceneSerializer` - Serialize scene state to JSON
- `SceneDeserializer` - Parse JSON to scene state
- `SceneState` - Complete scene data structure

### Services (`src/services/`)
- `StorageClient` - S3 + Cognito integration for scene persistence
- `StorageConfig` - AWS configuration

## SparkJS Integration

**CRITICAL**: SparkJS embeds WASM as base64 data URLs which is incompatible with bundlers.

Both Editor and Viewer use:
- Vanilla JavaScript with ES modules
- CDN importmap for Three.js and SparkJS
- No bundler involvement for 3D code

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js",
    "@sparkjsdev/spark": "https://cdn.jsdelivr.net/npm/@sparkjsdev/spark@0.1.10/dist/spark.module.js"
  }
}
</script>
```

## Data Flow

### Editor: Create and Share
```
User places treats → Core.addTreat() → User clicks Share
→ Core.getSceneState() → StorageClient.saveScene() → S3
→ Generate shareable URL → Copy to clipboard
```

### Viewer: Load and Explore
```
Open share URL → Parse params (world, scene)
→ StorageClient.loadScene() → Core.loadSceneState()
→ Render treats → User explores with WASD/mouse
```

## Build Outputs

- `apps/editor/dist/editor/` - Editor static files
- `apps/viewer/dist/viewer/` - Viewer static files

Both are deployable to S3 + CloudFront as static sites.

## Development

```bash
# Install dependencies
pnpm install

# Build core module
pnpm --filter @worldnotes/core build

# Run editor dev server (port 5174)
pnpm --filter worldnotes-editor dev

# Run viewer dev server (port 5175)
pnpm --filter worldnotes-viewer dev

# Build all
pnpm build
```

## Testing

The core module uses Vitest with fast-check for property-based testing:

```bash
pnpm --filter @worldnotes/core test
```

Property tests validate:
- Treat serialization round-trip
- Camera pose round-trip
- Scene state persistence
- Share URL generation
