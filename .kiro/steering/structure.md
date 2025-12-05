# Project Structure

## Monorepo Layout

```
├── apps/
│   └── splat-and-treat/
│       ├── src/                    # React UI (world selector, menus)
│       │   ├── components/
│       │   ├── App.tsx
│       │   ├── config.ts           # World/treat configuration
│       │   └── main.tsx
│       └── public/
│           ├── viewer.html         # ⭐ MAIN 3D VIEWER (vanilla JS + SparkJS)
│           └── *.html              # Other static pages
│
├── packages/
│   └── skeleton/                   # Shared types (@splat-and-treat/skeleton)
│       └── src/
│           ├── core/               # Types, interfaces
│           └── index.ts
│
└── common/                         # Shared utilities
```

## Architecture: Hybrid Approach

### 3D Viewer (`public/viewer.html`)
- **Vanilla JavaScript** with ES modules
- Loads Three.js and SparkJS via CDN importmap
- Receives world URL via query params: `?url=...&name=...`
- FPS navigation (WASD + mouse look)
- NO bundler involvement - bypasses WASM issues

### React UI (`src/`)
- World selection screen with thumbnails
- Menus, settings, token purchase UI
- Redirects to `viewer.html` when user selects a world
- Does NOT import SparkJS

### Data Flow
```
React WorldSelector → window.location → viewer.html?url=X&name=Y → SparkJS renders
```

## SparkJS Integration Rules
1. **Never import SparkJS in React/TypeScript** - causes WASM bundler errors
2. **Use importmap in HTML** - loads from CDN, no bundling
3. **SPZ orientation**: `splatMesh.rotation.x = Math.PI` (often upside down)
4. **Render loop**: `renderer.render(scene, camera)` directly

## Key Files
- `public/viewer.html` - The actual 3D splat viewer
- `src/config.ts` - World definitions (id, name, spzUrl, thumbnail)
- `src/components/WorldSelector.tsx` - React UI for choosing worlds

## Import Conventions
- Skeleton types: `import type { World } from '@splat-and-treat/skeleton'`
- Config: `import { worlds } from '../config'`
