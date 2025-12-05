# WorldNotes

Place 3D objects and messages in Gaussian Splat worlds. Share your creations with anyone.

## What is WorldNotes?

WorldNotes lets you explore photorealistic 3D environments (Gaussian Splats) and place interactive "treats" — 3D objects with optional messages — that others can discover. Think of it as leaving notes in a 3D world.

**Two apps, one core:**
- **Editor** — Create and edit scenes, place treats, share with a URL
- **Viewer** — Explore shared scenes, read messages (no editing)

Both apps share `@worldnotes/core` for rendering, treat management, and persistence.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run the editor
pnpm --filter worldnotes-editor dev

# Run the viewer  
pnpm --filter worldnotes-viewer dev

# Run tests
pnpm test
```

## Project Structure

```
worldnotes/
├── packages/core/          # @worldnotes/core - Shared module
│   ├── src/
│   │   ├── types.ts        # Treat, SceneState, CameraPose types
│   │   ├── persistence/    # SceneSerializer, SceneDeserializer
│   │   └── services/       # StorageClient (S3 + Cognito)
│
├── apps/editor/            # Full editing experience
│   └── src/main.ts         # Editor entry point
│
├── apps/viewer/            # Read-only viewer
│   └── src/main.ts         # Viewer entry point
│
└── ARCHITECTURE.md         # Detailed architecture docs
```

## Core Concepts

### Treats
A treat is a 3D object (.glb) placed in a splat world with an optional message:

```typescript
interface Treat {
  id: string;
  type: 'geomarker' | 'bottle' | 'custom';
  glbUrl: string;
  message?: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}
```

### Scene State
Scenes are serialized to JSON and stored in S3:

```typescript
interface SceneState {
  version: number;
  worldUrl: string;
  treats: Treat[];
  createdAt: string;
  updatedAt: string;
}
```

### Share Flow
1. User places treats in the Editor
2. Click "Share" → scene saved to S3
3. Get a Viewer URL: `https://viewer.worldnotes.app/?scene=abc123`
4. Anyone with the link can explore the scene

## Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | WASD | Virtual joystick |
| Look | Mouse drag | Touch drag |
| Toggle cursor | ESC | — |
| Read message | E or Click | Tap |
| Place treat (Editor) | Click | Tap |

## Tech Stack

- **3D Rendering**: SparkJS + Three.js (CDN importmap)
- **Language**: TypeScript
- **Build**: Vite
- **Testing**: Vitest + fast-check (property-based)
- **Storage**: AWS S3 + Cognito (client-side)
- **Hosting**: S3 + CloudFront (static sites)

## Environment Variables

Create a `.env` file:

```env
VITE_AWS_REGION=us-east-1
VITE_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:xxx
VITE_AWS_S3_BUCKET=worldnotes-scenes
VITE_APP_URL=https://editor.worldnotes.app
VITE_VIEWER_URL=https://viewer.worldnotes.app
```

## Deployment

Both apps deploy as static sites to S3 + CloudFront:

```bash
# Build all
pnpm build

# Deploy editor
aws s3 sync apps/editor/dist s3://your-editor-bucket

# Deploy viewer
aws s3 sync apps/viewer/dist s3://your-viewer-bucket
```

## Development

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Lint
pnpm lint

# Format
pnpm format
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation on:
- Core/Editor/Viewer separation
- Data flow diagrams
- SparkJS integration patterns
- Storage client design

## License

MIT
