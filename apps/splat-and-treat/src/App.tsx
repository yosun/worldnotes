import { useState, useCallback } from 'react';
import type { World } from '@splat-and-treat/skeleton';
import { WorldSelector } from './components/WorldSelector';
import { SceneView } from './components/SceneView';
import { SPECIAL_WORLD_IDS } from './config';

/**
 * Application view states
 */
type AppView = 'world-select' | 'scene';

/**
 * Main application component for Splat and Treat.
 * Handles world selection and scene rendering.
 */
function App() {
  const [view, setView] = useState<AppView>('world-select');
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);

  const handleWorldSelect = useCallback((world: World) => {
    // Empty world is valid - user starts with blank canvas
    if (world.id === SPECIAL_WORLD_IDS.EMPTY) {
      setSelectedWorld(world);
      setView('scene');
      return;
    }

    // Regular world with SPZ URL
    if (world.spzUrl) {
      setSelectedWorld(world);
      setView('scene');
    }
  }, []);

  const handleBackToSelector = useCallback(() => {
    setSelectedWorld(null);
    setView('world-select');
  }, []);

  const handleSelectFallback = useCallback((world: World) => {
    // Switch to a fallback world when current one fails to load
    setSelectedWorld(world);
  }, []);

  // World selection screen
  if (view === 'world-select') {
    return <WorldSelector onWorldSelect={handleWorldSelect} />;
  }

  // Scene view with SceneManager
  if (selectedWorld) {
    return (
      <SceneView
        world={selectedWorld}
        onBack={handleBackToSelector}
        onSelectFallback={handleSelectFallback}
      />
    );
  }

  // Fallback - should not reach here
  return <WorldSelector onWorldSelect={handleWorldSelect} />;
}

export default App;
