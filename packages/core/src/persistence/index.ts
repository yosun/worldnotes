/**
 * Persistence module - Scene serialization and deserialization
 *
 * @module @worldnotes/core/persistence
 */

export {
  serializeScene,
  serializeSceneToObject,
  serializeVector3,
  serializeTreat,
  CURRENT_VERSION,
  type SerializedSceneState,
  type SerializedVector3,
  type SerializedTreat,
} from './SceneSerializer';

export {
  deserializeScene,
  deserializeSceneFromObject,
  deserializeVector3,
  deserializeTreat,
  migrateScene,
} from './SceneDeserializer';

// Re-export SceneState for convenience
export type { SceneState } from '../types';
