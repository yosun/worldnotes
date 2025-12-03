/**
 * SceneView Component - Renders the 3D splat world with error handling
 * 
 * Handles world loading, error display, and fallback options.
 * Requirements: 1.3, 1.4, 1.5, 1.6
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { World } from '@splat-and-treat/skeleton';
import { SceneManager, type SceneLoadError } from '@splat-and-treat/skeleton';
import { worlds, SPECIAL_WORLD_IDS } from '../config';

interface SceneViewProps {
  /** The world to load and display */
  world: World;
  /** Callback when user wants to go back to world selector */
  onBack: () => void;
  /** Callback when user selects a fallback world */
  onSelectFallback: (world: World) => void;
}

/**
 * Loading state for the scene
 */
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'ready' }
  | { status: 'error'; error: SceneLoadError };

/**
 * Get user-friendly error message from SceneLoadError
 */
function getErrorMessage(error: SceneLoadError): string {
  switch (error.type) {
    case 'network':
      return `Unable to load world. Please check your internet connection and try again.`;
    case 'parse':
      return `The world file appears to be corrupted. Please try a different world.`;
    case 'timeout':
      return `Loading took too long. The world file may be too large or your connection may be slow.`;
    case 'unknown':
    default:
      return `An unexpected error occurred while loading the world.`;
  }
}

/**
 * Get fallback worlds (excluding the current one and special worlds)
 */
function getFallbackWorlds(currentWorldId: string): World[] {
  return worlds.filter(
    (w) => 
      w.id !== currentWorldId && 
      w.id !== SPECIAL_WORLD_IDS.EMPTY && 
      w.id !== SPECIAL_WORLD_IDS.REQUEST &&
      w.spzUrl // Must have a valid SPZ URL
  );
}

export function SceneView({ world, onBack, onSelectFallback }: SceneViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ status: 'idle' });

  // Initialize and load the world
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create SceneManager
    const sceneManager = new SceneManager({
      canvas,
      onReady: () => {
        console.log('SceneManager ready');
      },
      onProgress: (progress) => {
        setLoadingState({ status: 'loading', progress });
      },
      onError: (error) => {
        console.error('SceneManager error:', error);
      },
    });

    sceneManagerRef.current = sceneManager;

    // Initialize and load world
    const loadWorld = async () => {
      setLoadingState({ status: 'loading', progress: 0 });

      try {
        await sceneManager.initialize();

        // Handle empty world (no SPZ to load)
        if (world.id === SPECIAL_WORLD_IDS.EMPTY || !world.spzUrl) {
          sceneManager.startRenderLoop();
          setLoadingState({ status: 'ready' });
          return;
        }

        // Load the SPZ world
        const result = await sceneManager.loadWorld(world.spzUrl);

        if (result.success) {
          sceneManager.startRenderLoop();
          setLoadingState({ status: 'ready' });
        } else {
          setLoadingState({ status: 'error', error: result.error });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setLoadingState({
          status: 'error',
          error: { type: 'unknown', message: errorMessage },
        });
      }
    };

    loadWorld();

    // Handle window resize
    const handleResize = () => {
      sceneManager.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      sceneManager.dispose();
      sceneManagerRef.current = null;
    };
  }, [world]);

  // Retry loading the current world
  const handleRetry = useCallback(async () => {
    const sceneManager = sceneManagerRef.current;
    if (!sceneManager || !world.spzUrl) return;

    setLoadingState({ status: 'loading', progress: 0 });

    const result = await sceneManager.loadWorld(world.spzUrl);

    if (result.success) {
      sceneManager.startRenderLoop();
      setLoadingState({ status: 'ready' });
    } else {
      setLoadingState({ status: 'error', error: result.error });
    }
  }, [world.spzUrl]);

  const fallbackWorlds = getFallbackWorlds(world.id);

  return (
    <div className="relative w-full h-full bg-halloween-black">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: loadingState.status === 'error' ? 'none' : 'block' }}
      />

      {/* Back button - always visible */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-halloween-purple/80 hover:bg-halloween-purple text-white rounded-lg transition-colors flex items-center gap-2 backdrop-blur-sm"
        >
          <span>←</span>
          <span>Back to Worlds</span>
        </button>
      </div>

      {/* Loading overlay */}
      {loadingState.status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-halloween-black/80 z-10">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-halloween-orange border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-halloween-orange mb-2">
              Loading {world.name}...
            </h2>
            <p className="text-gray-400">
              {loadingState.progress > 0
                ? `${Math.round(loadingState.progress)}%`
                : 'Initializing...'}
            </p>
          </div>
        </div>
      )}

      {/* Error overlay with fallback options */}
      {loadingState.status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-halloween-black z-10 p-8">
          <div className="max-w-2xl w-full">
            {/* Error message */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">😱</div>
              <h2 className="text-3xl font-bold text-halloween-orange mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-400 mb-2">
                {getErrorMessage(loadingState.error)}
              </p>
              {loadingState.error.type !== 'unknown' && 'url' in loadingState.error && (
                <p className="text-gray-600 text-sm">
                  Failed to load: {loadingState.error.url}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-halloween-orange hover:bg-halloween-orange/80 text-white font-semibold rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-halloween-purple hover:bg-halloween-purple/80 text-white font-semibold rounded-lg transition-colors"
              >
                Choose Different World
              </button>
            </div>

            {/* Fallback world suggestions */}
            {fallbackWorlds.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white text-center mb-4">
                  Or try one of these worlds:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fallbackWorlds.slice(0, 3).map((fallbackWorld) => (
                    <button
                      key={fallbackWorld.id}
                      onClick={() => onSelectFallback(fallbackWorld)}
                      className="p-4 bg-halloween-black/50 border border-halloween-orange/30 hover:border-halloween-orange rounded-lg text-left transition-colors"
                    >
                      <h4 className="font-semibold text-halloween-orange mb-1">
                        {fallbackWorld.name}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {fallbackWorld.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* World info overlay (when ready) */}
      {loadingState.status === 'ready' && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="px-4 py-2 bg-halloween-black/60 backdrop-blur-sm rounded-lg">
            <h3 className="text-lg font-semibold text-halloween-orange">
              {world.name}
            </h3>
            <p className="text-sm text-gray-400">
              Use WASD to move • Mouse to look around
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SceneView;
