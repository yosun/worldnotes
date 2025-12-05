/**
 * ModeManager - Manages Edit/Explore mode state for the application.
 *
 * Default mode is 'explore' on load.
 * Emits events when mode changes for UI updates.
 *
 * @example
 * ```typescript
 * const modeManager = createModeManager();
 *
 * // Subscribe to mode changes
 * modeManager.onModeChange((mode) => {
 *   console.log('Mode changed to:', mode);
 * });
 *
 * // Toggle mode
 * modeManager.toggle();
 *
 * // Check current mode
 * if (modeManager.isEditMode()) {
 *   // Show editing UI
 * }
 * ```
 */

import type { AppMode, ModeChangeCallback, ModeManager } from '../core/types';

/**
 * Creates a new ModeManager instance.
 * Defaults to 'explore' mode on initialization.
 *
 * @returns ModeManager instance
 */
export function createModeManager(): ModeManager {
  let currentMode: AppMode = 'explore';
  const listeners: Set<ModeChangeCallback> = new Set();

  /**
   * Notify all listeners of mode change
   */
  function notifyListeners(): void {
    listeners.forEach((callback) => {
      try {
        callback(currentMode);
      } catch (error) {
        console.error('ModeManager: Error in mode change callback:', error);
      }
    });
  }

  return {
    getMode(): AppMode {
      return currentMode;
    },

    setMode(mode: AppMode): void {
      if (mode !== currentMode) {
        currentMode = mode;
        notifyListeners();
      }
    },

    toggle(): void {
      currentMode = currentMode === 'explore' ? 'edit' : 'explore';
      notifyListeners();
    },

    onModeChange(callback: ModeChangeCallback): () => void {
      listeners.add(callback);
      // Return unsubscribe function
      return () => {
        listeners.delete(callback);
      };
    },

    isEditMode(): boolean {
      return currentMode === 'edit';
    },

    isExploreMode(): boolean {
      return currentMode === 'explore';
    },
  };
}
