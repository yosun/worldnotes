import { useState, useCallback } from 'react';
import type { World } from '@splat-and-treat/skeleton';
import { WorldSelector } from './components/WorldSelector';
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

  // World selection screen
  if (view === 'world-select') {
    return <WorldSelector onWorldSelect={handleWorldSelect} />;
  }

  // Scene view (placeholder until SceneManager is implemented in Task 3)
  return (
    <div className="w-full h-full flex flex-col bg-halloween-black">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={handleBackToSelector}
          className="px-4 py-2 bg-halloween-purple/80 hover:bg-halloween-purple text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Worlds</span>
        </button>
      </div>

      {/* Scene placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-halloween-orange mb-4">
            {selectedWorld?.name || 'Unknown World'}
          </h2>
          <p className="text-gray-400 mb-2">{selectedWorld?.description}</p>
          <p className="text-gray-500 text-sm">
            Scene rendering will be implemented in Task 3 (SceneManager)
          </p>
          {selectedWorld?.spzUrl && (
            <p className="text-gray-600 text-xs mt-4">
              SPZ URL: {selectedWorld.spzUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
