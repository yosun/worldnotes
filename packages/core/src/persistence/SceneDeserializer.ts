/**
 * SceneDeserializer - Converts JSON data back to SceneState objects.
 *
 * Handles deserialization of:
 * - Vector3 positions and rotations
 * - Treat metadata
 * - Scene versioning and migration
 *
 * Includes validation to ensure data integrity.
 *
 * @module @worldnotes/core/persistence/SceneDeserializer
 */

import type { SceneState, Treat, TreatType, Vector3 } from '../types';
import type { SerializedSceneState, SerializedVector3, SerializedTreat } from './SceneSerializer';
import { CURRENT_VERSION } from './SceneSerializer';

/**
 * Valid treat types for validation
 */
const VALID_TREAT_TYPES: TreatType[] = ['geomarker', 'bottle', 'custom'];

/**
 * Deserialize a plain object to Vector3.
 *
 * @param data - Plain object with x, y, z properties
 * @returns Vector3 object
 */
export function deserializeVector3(data: SerializedVector3): Vector3 {
  return {
    x: Number(data.x),
    y: Number(data.y),
    z: Number(data.z),
  };
}

/**
 * Validate and deserialize treat type.
 * Unknown types default to 'custom'.
 *
 * @param type - Type string from serialized data
 * @returns Valid TreatType
 */
function deserializeTreatType(type: string): TreatType {
  if (VALID_TREAT_TYPES.includes(type as TreatType)) {
    return type as TreatType;
  }
  // Allow custom string types (TreatType includes `| string`)
  return type;
}

/**
 * Deserialize a plain object to Treat.
 *
 * @param data - Serialized treat data
 * @returns Treat object
 */
export function deserializeTreat(data: SerializedTreat): Treat {
  const result: Treat = {
    id: String(data.id),
    type: deserializeTreatType(data.type),
    glbUrl: String(data.glbUrl),
    position: deserializeVector3(data.position),
    rotation: deserializeVector3(data.rotation),
  };

  // Include optional fields only if defined
  if (data.message !== undefined) {
    result.message = String(data.message);
  }
  if (data.createdAt !== undefined) {
    result.createdAt = String(data.createdAt);
  }
  if (data.updatedAt !== undefined) {
    result.updatedAt = String(data.updatedAt);
  }

  return result;
}

/**
 * Deserialize a plain object to SceneState.
 * Useful when you already have the parsed object.
 *
 * @param data - Plain object representation of the scene
 * @returns Deserialized SceneState object
 * @throws Error if data is missing required fields
 */
export function deserializeSceneFromObject(data: SerializedSceneState): SceneState {
  // Validate required fields
  if (data.worldUrl === undefined || data.worldUrl === null) {
    throw new Error('SceneState missing required field: worldUrl');
  }

  const result: SceneState = {
    version: Number(data.version) || CURRENT_VERSION,
    worldUrl: String(data.worldUrl),
    treats: Array.isArray(data.treats) ? data.treats.map(deserializeTreat) : [],
    createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };

  // Include worldFlipY only if defined
  if (data.worldFlipY !== undefined) {
    result.worldFlipY = Boolean(data.worldFlipY);
  }

  return result;
}

/**
 * Deserialize a JSON string to SceneState.
 *
 * @param json - JSON string representation of the scene
 * @returns Deserialized SceneState object
 * @throws Error if JSON is invalid or missing required fields
 *
 * @example
 * const json = '{"version":1,"worldUrl":"https://example.com/world.spz",...}';
 * const state = deserializeScene(json);
 */
export function deserializeScene(json: string): SceneState {
  const data = JSON.parse(json) as SerializedSceneState;
  return deserializeSceneFromObject(data);
}

/**
 * Migrate scene state from one version to another.
 * Preserves all treat data during migration.
 *
 * @param state - Scene state to migrate
 * @param targetVersion - Target version number (defaults to CURRENT_VERSION)
 * @returns Migrated scene state
 * @throws Error if target version is lower than current version
 *
 * @example
 * const oldState = deserializeScene(json);
 * const migratedState = migrateScene(oldState, CURRENT_VERSION);
 */
export function migrateScene(state: SceneState, targetVersion: number = CURRENT_VERSION): SceneState {
  // Cannot downgrade versions
  if (targetVersion < state.version) {
    throw new Error(
      `Cannot migrate scene from version ${state.version} to lower version ${targetVersion}`
    );
  }

  // Already at target version
  if (state.version === targetVersion) {
    return state;
  }

  // Clone the state to avoid mutation
  let migratedState: SceneState = {
    ...state,
    treats: state.treats.map((treat) => ({ ...treat })),
  };

  // Apply migrations sequentially
  // Version 1 -> 2 migration (placeholder for future)
  // if (migratedState.version === 1 && targetVersion >= 2) {
  //   // Apply v1 -> v2 migrations here
  //   migratedState.version = 2;
  // }

  // Update version to target
  migratedState = {
    ...migratedState,
    version: targetVersion,
    updatedAt: new Date().toISOString(),
  };

  return migratedState;
}
