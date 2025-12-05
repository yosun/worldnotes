/**
 * Scene persistence module - serialization and deserialization of SceneState.
 *
 * @module persistence
 */

export {
  toJSON,
  toObject,
  serializeVector3,
  serializeEuler,
  serializeTreat,
  serializeWaypoint,
  serializeWaypointPath,
  type SerializedVector3,
  type SerializedEuler,
  type SerializedTreat,
  type SerializedSceneState,
} from './SceneSerializer';

export {
  fromJSON,
  fromObject,
  deserializeVector3,
  deserializeEuler,
  deserializeTreat,
  deserializeWaypoint,
  deserializeWaypointPath,
} from './SceneDeserializer';
