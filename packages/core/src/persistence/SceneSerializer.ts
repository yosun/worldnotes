/**
 * SceneSerializer - Converts SceneState objects to JSON format for storage.
 *
 * Handles serialization of:
 * - Vector3 positions and rotations
 * - Treat metadata
 * - Scene versioning
 *
 * @module @worldnotes/core/persistence/SceneSerializer
 */

import type { SceneState, Treat, Vector3 } from '../types';

// Re-export SceneState for backwards compatibility
export type { SceneState } from '../types';

/** Current schema version */
export const CURRENT_VERSION = 1;

/**
 * JSON-serializable representation of Vector3
 */
export interface SerializedVector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * JSON-serializable representation of a Treat
 */
export interface SerializedTreat {
  id: string;
  type: string;
  glbUrl: string;
  message?: string;
  position: SerializedVector3;
  rotation: SerializedVector3;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * JSON-serializable representation of SceneState
 */
export interface SerializedSceneState {
  version: number;
  worldUrl: string;
  worldFlipY?: boolean;
  treats: SerializedTreat[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialize a Vector3 to a plain object.
 *
 * @param vec - The Vector3 to serialize
 * @returns Plain object with x, y, z properties
 */
export function serializeVector3(vec: Vector3): SerializedVector3 {
  return {
    x: vec.x,
    y: vec.y,
    z: vec.z,
  };
}

/**
 * Serialize a Treat to a plain object.
 *
 * @param treat - The Treat to serialize
 * @returns Plain object representation of the treat
 */
export function serializeTreat(treat: Treat): SerializedTreat {
  const result: SerializedTreat = {
    id: treat.id,
    type: treat.type,
    glbUrl: treat.glbUrl,
    position: serializeVector3(treat.position),
    rotation: serializeVector3(treat.rotation),
  };

  // Include optional fields only if defined
  if (treat.message !== undefined) {
    result.message = treat.message;
  }
  if (treat.createdAt !== undefined) {
    result.createdAt = treat.createdAt;
  }
  if (treat.updatedAt !== undefined) {
    result.updatedAt = treat.updatedAt;
  }

  return result;
}

/**
 * Serialize a SceneState to a plain object (without JSON.stringify).
 * Useful when you need the object form for further processing.
 *
 * @param state - The SceneState to serialize
 * @returns Plain object representation of the scene
 */
export function serializeSceneToObject(state: SceneState): SerializedSceneState {
  const result: SerializedSceneState = {
    version: state.version,
    worldUrl: state.worldUrl,
    treats: state.treats.map(serializeTreat),
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  };

  // Include worldFlipY only if defined
  if (state.worldFlipY !== undefined) {
    result.worldFlipY = state.worldFlipY;
  }

  return result;
}

/**
 * Serialize a complete SceneState to JSON string.
 *
 * @param state - The SceneState to serialize
 * @returns JSON string representation of the scene
 *
 * @example
 * const state: SceneState = {
 *   version: 1,
 *   worldUrl: 'https://example.com/world.spz',
 *   treats: [],
 *   createdAt: '2025-12-05T10:00:00Z',
 *   updatedAt: '2025-12-05T10:00:00Z'
 * };
 * const json = serializeScene(state);
 */
export function serializeScene(state: SceneState): string {
  const serialized = serializeSceneToObject(state);
  return JSON.stringify(serialized);
}
