/**
 * SceneDeserializer - Converts JSON data back to SceneState objects.
 *
 * Handles deserialization of:
 * - Vector3 positions and scales
 * - Euler rotations
 * - Treat metadata
 * - Waypoints and paths
 *
 * Includes validation to ensure data integrity.
 *
 * @module persistence/SceneDeserializer
 */

import type {
  SceneState,
  Treat,
  TreatType,
  Waypoint,
  WaypointPath,
  Vector3,
  Euler,
  TreatMetadata,
  WaypointAction,
} from '../core/types';
import type { SerializedSceneState, SerializedVector3, SerializedEuler } from './SceneSerializer';

/**
 * Valid treat types for validation
 */
const VALID_TREAT_TYPES: TreatType[] = [
  'custom',
  'library',
  'waypoint',
  'ai-generated',
  'message-bottle',
];

/**
 * Valid waypoint action types
 */
const VALID_ACTION_TYPES: WaypointAction['type'][] = ['audio', 'text', 'activate'];

/**
 * Deserialize a plain object to Vector3
 */
export function deserializeVector3(data: SerializedVector3): Vector3 {
  return {
    x: Number(data.x),
    y: Number(data.y),
    z: Number(data.z),
  };
}

/**
 * Deserialize a plain object to Euler
 */
export function deserializeEuler(data: SerializedEuler): Euler {
  const result: Euler = {
    x: Number(data.x),
    y: Number(data.y),
    z: Number(data.z),
  };
  if (data.order !== undefined) {
    result.order = String(data.order);
  }
  return result;
}

/**
 * Validate and deserialize treat type
 */
function deserializeTreatType(type: string): TreatType {
  if (VALID_TREAT_TYPES.includes(type as TreatType)) {
    return type as TreatType;
  }
  // Default to 'custom' for unknown types
  return 'custom';
}

/**
 * Deserialize treat metadata
 */
function deserializeTreatMetadata(
  data: { text?: string; behaviorCode?: string; objectId?: string } | undefined
): TreatMetadata {
  if (!data) {
    return {};
  }
  const result: TreatMetadata = {};
  if (data.text !== undefined) {
    result.text = String(data.text);
  }
  if (data.behaviorCode !== undefined) {
    result.behaviorCode = String(data.behaviorCode);
  }
  if (data.objectId !== undefined) {
    result.objectId = String(data.objectId);
  }
  return result;
}

/**
 * Deserialize a plain object to Treat
 */
export function deserializeTreat(data: SerializedSceneState['treats'][0]): Treat {
  return {
    id: String(data.id),
    type: deserializeTreatType(data.type),
    glbUrl: String(data.glbUrl),
    position: deserializeVector3(data.position),
    rotation: deserializeEuler(data.rotation),
    scale: deserializeVector3(data.scale),
    metadata: deserializeTreatMetadata(data.metadata),
  };
}

/**
 * Deserialize waypoint action
 */
function deserializeWaypointAction(
  data: { type: string; payload: string } | undefined
): WaypointAction | undefined {
  if (!data) {
    return undefined;
  }
  const actionType = VALID_ACTION_TYPES.includes(data.type as WaypointAction['type'])
    ? (data.type as WaypointAction['type'])
    : 'text';
  return {
    type: actionType,
    payload: String(data.payload),
  };
}

/**
 * Deserialize a plain object to Waypoint
 */
export function deserializeWaypoint(data: SerializedSceneState['waypoints'][0]): Waypoint {
  const result: Waypoint = {
    id: String(data.id),
    position: deserializeVector3(data.position),
  };
  if (data.pathId !== undefined) {
    result.pathId = String(data.pathId);
  }
  if (data.order !== undefined) {
    result.order = Number(data.order);
  }
  if (data.triggerAction !== undefined) {
    result.triggerAction = deserializeWaypointAction(data.triggerAction);
  }
  return result;
}

/**
 * Deserialize a plain object to WaypointPath
 */
export function deserializeWaypointPath(data: SerializedSceneState['paths'][0]): WaypointPath {
  return {
    id: String(data.id),
    name: String(data.name),
    waypointIds: Array.isArray(data.waypointIds) ? data.waypointIds.map(String) : [],
  };
}

/**
 * Deserialize a JSON string to SceneState.
 *
 * @param json - JSON string representation of the scene
 * @returns Deserialized SceneState object
 * @throws Error if JSON is invalid or missing required fields
 */
export function fromJSON(json: string): SceneState {
  const data = JSON.parse(json) as SerializedSceneState;
  return fromObject(data);
}

/**
 * Deserialize a plain object to SceneState.
 * Useful when you already have the parsed object.
 *
 * @param data - Plain object representation of the scene
 * @returns Deserialized SceneState object
 * @throws Error if data is missing required fields
 */
export function fromObject(data: SerializedSceneState): SceneState {
  // Validate required fields
  if (data.worldUrl === undefined) {
    throw new Error('SceneState missing required field: worldUrl');
  }

  return {
    version: Number(data.version) || 1,
    worldUrl: String(data.worldUrl),
    worldFlipY: data.worldFlipY !== undefined ? Boolean(data.worldFlipY) : undefined,
    treats: Array.isArray(data.treats) ? data.treats.map(deserializeTreat) : [],
    waypoints: Array.isArray(data.waypoints) ? data.waypoints.map(deserializeWaypoint) : [],
    paths: Array.isArray(data.paths) ? data.paths.map(deserializeWaypointPath) : [],
    createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
    updatedAt: data.updatedAt ? String(data.updatedAt) : new Date().toISOString(),
  };
}
