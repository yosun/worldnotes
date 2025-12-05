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
  // Check URL for direct viewer access or shared scene
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get('url');
    const name = params.get('name');
    const sceneId = params.get('scene');
    
    // If scene ID present, redirect to viewer with scene parameter
    // The viewer will load the scene from S3 and restore treats
    if (sceneId) {
      window.location.href = `/viewer.html?scene=${encodeURIComponent(sceneId)}&name=${encodeURIComponent(name || 'Shared Scene')}`;
      return;
    }
    
    // If URL params present, redirect to viewer
    if (url) {
      window.location.href = `/viewer.html?url=${encodeURIComponent(url)}&name=${encodeURIComponent(name || 'World')}`;
    }
  }, []);

  const handleWorldSelect = useCallback((world: World) => {
    // Empty world - redirect to viewer with no URL (shows grid)
    if (world.id === SPECIAL_WORLD_IDS.EMPTY) {
      let emptyUrl = `/viewer.html?name=${encodeURIComponent(world.name)}`;
      if (world.defaultTreat) {
        emptyUrl += `&defaultTreat=${encodeURIComponent(world.defaultTreat)}`;
      }
      window.location.href = emptyUrl;
      return;
    }

    // Regular world with SPZ URL - redirect to vanilla viewer
    if (world.spzUrl) {
      const url = encodeURIComponent(world.spzUrl);
      const name = encodeURIComponent(world.name);
      let viewerUrl = `/viewer.html?url=${url}&name=${name}`;

      // Pass thumbnail for loading screen
      if (world.thumbnail) {
        viewerUrl += `&thumb=${encodeURIComponent(world.thumbnail)}`;
      }

      // Pass startPosition if defined
      if (world.startPosition) {
        const { position, rotation } = world.startPosition;
        viewerUrl += `&px=${position.x}&py=${position.y}&pz=${position.z}`;
        if (rotation) {
          viewerUrl += `&rx=${rotation.x}&ry=${rotation.y}`;
        }
      }

      // Pass world's default treat filename
      if (world.defaultTreat) {
        viewerUrl += `&defaultTreat=${encodeURIComponent(world.defaultTreat)}`;
      }

      // Pass flip setting (default true for most SPZ files)
      if (world.flipY === false) {
        viewerUrl += '&flip=0';
      }

      window.location.href = viewerUrl;
    }
  }, []);

  return <WorldSelector onWorldSelect={handleWorldSelect} />;
}

export default App;
