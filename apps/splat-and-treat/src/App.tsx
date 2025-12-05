import { useCallback, useEffect } from 'react';
import type { World } from '@splat-and-treat/skeleton';
import { WorldSelector } from './components/WorldSelector';
import { SPECIAL_WORLD_IDS } from './config';

/**
 * Main application component for Splat and Treat.
 * Handles world selection and redirects to vanilla JS viewer.
 * 
 * NOTE: SparkJS is incompatible with Vite/React bundlers due to WASM embedding.
 * The 3D viewer is a separate vanilla JS page (public/viewer.html).
 */
function App() {
  // Check URL for direct viewer access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const name = params.get('name');
    
    // If URL params present, redirect to viewer
    if (url) {
      window.location.href = `/viewer.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name || 'World')}`;
    }
  }, []);

  const handleWorldSelect = useCallback((world: World) => {
    // Empty world - redirect to viewer with no URL (shows grid)
    if (world.id === SPECIAL_WORLD_IDS.EMPTY) {
      window.location.href = `/viewer.html?name=${encodeURIComponent(world.name)}`;
      return;
    }

    // Regular world with SPZ URL - redirect to vanilla viewer
    if (world.spzUrl) {
      const url = encodeURIComponent(world.spzUrl);
      const name = encodeURIComponent(world.name);
      window.location.href = `/viewer.html?url=${url}&name=${name}`;
    }
  }, []);

  return <WorldSelector onWorldSelect={handleWorldSelect} />;
}

export default App;
