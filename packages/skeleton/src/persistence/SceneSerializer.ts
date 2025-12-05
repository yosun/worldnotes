/**
 * SceneSerializer - Converts SceneState objects to JSON format for storage.
 *
 * Handles serialization of:
 * - Vector3 positions and scales
 * - Euler rotations
 * - Treat metadata
 * - Waypoints and paths
 *
 * @module persistence/SceneSerializer
 */

import type { SceneState, Treat, Waypoint, WaypointPath, Vector3, Euler } from '../core/types';

/**
 * JSON-serializable representation of Vector3
 */
export interface SerializedVector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * JSON-serializable representation of Euler
 */
export interface SerializedEuler {
  x: number;
  y: number;
  z: number;
  order?: string;
}

/**
 * JSON-serializable representation of a Treat
 */
export interface SerializedTreat {
  id: string;
  type: string;
  glbUrl: string;
  position: SerializedVector3;
  rotation: SerializedEuler;
  scale: SerializedVector3;
  metadata: {
    text?: string;
    behaviorCode?: string;
    objectId?: string;
  };
}

/**
 * JSON-serializable representation of SceneState
 */
export interface SerializedSceneState {
  version: number;
  worldUrl: string;
  treats: SerializedTreat[];
  waypoints: Array<{
    id: string;
    position: SerializedVector3;
    pathId?: string;
    order?: number;
    triggerAction?: {
      type: 'audio' | 'text' | 'activate';
      payload: string;
    };
  }>;
  paths: Array<{
    id: string;
    name: string;
    waypointIds: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Serialize a Vector3 to a plain object
 */
export function serializeVector3(vec: Vector3): SerializedVector3 {
  return {
    x: vec.x,
    y: vec.y,
    z: vec.z,
  };
}

/**
 * Serialize an Euler to a plain object
 */
export function serializeEuler(euler: Euler): SerializedEuler {
  const result: SerializedEuler = {
    x: euler.x,
    y: euler.y,
    z: euler.z,
  };
  if (euler.order !== undefined) {
    result.order = euler.order;
  }
  return result;
}

/**
 * Serialize a Treat to a plain object
 */
export function serializeTreat(treat: Treat): SerializedTreat {
  return {
    id: treat.id,
    type: treat.type,
    glbUrl: treat.glbUrl,
    position: serializeVector3(treat.position),
    rotation: serializeEuler(treat.rotation),
    scale: serializeVector3(treat.scale),
    metadata: { ...treat.metadata },
  };
}

/**
 * Serialize a Waypoint to a plain object
 */
export function serializeWaypoint(waypoint: Waypoint): SerializedSceneState['waypoints'][0] {
  const result: SerializedSceneState['waypoints'][0] = {
    id: waypoint.id,
    position: serializeVector3(waypoint.position),
  };
  if (waypoint.pathId !== undefined) {
    result.pathId = waypoint.pathId;
  }
  if (waypoint.order !== undefined) {
    result.order = waypoint.order;
  }
  if (waypoint.triggerAction !== undefined) {
    result.triggerAction = { ...waypoint.triggerAction };
  }
  return result;
}

/**
 * Serialize a WaypointPath to a plain object
 */
export function serializeWaypointPath(path: WaypointPath): SerializedSceneState['paths'][0] {
  return {
    id: path.id,
    name: path.name,
    waypointIds: [...path.waypointIds],
  };
}

/**
 * Serialize a complete SceneState to JSON string.
 *
 * @param state - The SceneState to serialize
 * @returns JSON string representation of the scene
 */
export function toJSON(state: SceneState): string {
  const serialized: SerializedSceneState = {
    version: state.version,
    worldUrl: state.worldUrl,
    treats: state.treats.map(serializeTreat),
    waypoints: state.waypoints.map(serializeWaypoint),
    paths: state.paths.map(serializeWaypointPath),
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  };
  return JSON.stringify(serialized);
}

/**
 * Serialize a SceneState to a plain object (without JSON.stringify).
 * Useful when you need the object form for further processing.
 *
 * @param state - The SceneState to serialize
 * @returns Plain object representation of the scene
 */
export function toObject(state: SceneState): SerializedSceneState {
  return {
    version: state.version,
    worldUrl: state.worldUrl,
    treats: state.treats.map(serializeTreat),
    waypoints: state.waypoints.map(serializeWaypoint),
    paths: state.paths.map(serializeWaypointPath),
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
  };
}
