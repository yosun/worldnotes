# Tech Stack & Build System

## Package Manager & Monorepo
- **pnpm** with workspaces
- Workspace packages: `packages/*`, `apps/*`
- Node.js >= 18.0.0

## Core Technologies
- **Vanilla JavaScript** with ES Modules for 3D viewer (SparkJS compatibility)
- **Three.js** (v0.178) for 3D rendering - loaded via CDN importmap
- **SparkJS** (@sparkjsdev/spark v0.1.10) for Gaussian splatting (.spz files) - loaded via CDN
- **React 18** for UI components (world selector, menus) - optional
- **Tailwind CSS** for styling

## CRITICAL: SparkJS Integration
SparkJS embeds WASM as base64 data URLs which is **incompatible with Vite/webpack bundlers**. 

**DO NOT** try to:
- Import SparkJS in bundled React/Vite code
- Use React Three Fiber with SparkJS
- Add SparkJS to optimizeDeps.exclude (still breaks)

**DO** use:
- Vanilla JS with importmap loading from CDN
- Separate HTML pages for 3D viewing (`public/viewer.html`)
- React only for non-3D UI (world selection, menus)

## SparkJS Pattern (from official examples)

Implement official raycast example
https://github.com/sparkjsdev/spark/blob/main/examples/raycasting/index.html

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js",
    "@sparkjsdev/spark": "https://cdn.jsdelivr.net/npm/@sparkjsdev/spark@0.1.10/dist/spark.module.js"
  }
}
</script>
<script type="module">
  import * as THREE from "three";
  import { SplatMesh } from "@sparkjsdev/spark";
  
  const splatMesh = new SplatMesh({ url: 'world.spz' });
  splatMesh.rotation.x = Math.PI; // SPZ files are often upside down
  scene.add(splatMesh);
  
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
</script>
```

## Build Tools
- **Vite** for dev server (serves static files, React UI)
- **Vitest** for testing
- **ESLint** + **Prettier** for code quality

## Common Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Build all packages
pnpm test             # Run tests
pnpm lint             # ESLint check
pnpm format           # Prettier format
```

## Code Style (Prettier)
- Semicolons: yes
- Single quotes: yes
- Tab width: 2
- Trailing commas: es5
- Print width: 100
