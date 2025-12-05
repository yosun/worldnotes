/**
 * Storage client - S3 + Cognito integration
 * Placeholder for task 7
 */

import type { SceneState, ShareableScene } from '../types';

// Re-export types for backwards compatibility
export type { StorageConfig, ShareableScene } from '../types';

/**
 * Storage client interface
 */
export interface StorageClient {
  saveScene(state: SceneState, existingId?: string): Promise<ShareableScene>;
  loadScene(sceneId: string): Promise<SceneState | null>;
  getShareUrl(sceneId: string): string;
}
