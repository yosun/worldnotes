/**
 * Core type definitions for Splat and Treat skeleton.
 * These types define the data structures used throughout the application.
 */

import type { Vector3, Euler } from 'three';

/**
 * Application mode - either editing or exploring the world
 */
export type AppMode = 'edit' | 'explore';

/**
 * Type of treat that can be placed in the world
 */
export type TreatType = 'custom' | 'library' | 'waypoint' | 'ai-generated' | 'message-bottle';

/**
 * Metadata attached to a treat
 */
export interface TreatMetadata {
  /** Attached message (max 280 characters) */
  text?: string;
  /** Vibe code for custom behaviors (advanced feature) */
  behaviorCode?: string;
  /** Unique ID for inter-object communication */
  objectId?: string;
}

/**
 * A 3D treat placed in the world
 */
export interface Treat {
  /** Unique identifier */
  id: string;
  /** Type of treat */
  type: TreatType;
  /** URL to the GLB model */
  glbUrl: string;
  /** Position in world space */
  position: Vector3;
  /** Rotation in world space */
  rotation: Euler;
  /** Scale of the treat */
  scale: Vector3;
  /** Additional metadata */
  metadata: TreatMetadata;
}

/**
 * Serializable version of Vector3 for JSON storage
 */
export interface SerializableVector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Serializable version of Euler for JSON storage
 */
export interface SerializableEuler {
  x: number;
  y: number;
  z: number;
  order?: string;
}

/**
 * Serializable version of Treat for JSON storage
 */
export interface SerializableTreat {
  id: string;
  type: TreatType;
  glbUrl: string;
  position: SerializableVector3;
  rotation: SerializableEuler;
  scale: SerializableVector3;
  metadata: TreatMetadata;
}

/**
 * Action triggered when a waypoint is reached
 */
export interface WaypointAction {
  /** Type of action */
  type: 'audio' | 'text' | 'activate';
  /** Action payload (URL, text content, or treat ID) */
  payload: string;
}

/**
 * A navigation waypoint in the world
 */
export interface Waypoint {
  /** Unique identifier */
  id: string;
  /** Position in world space */
  position: Vector3;
  /** ID of the path this waypoint belongs to */
  pathId?: string;
  /** Order within the path */
  order?: number;
  /** Action to trigger when reached */
  triggerAction?: WaypointAction;
}

/**
 * Serializable version of Waypoint for JSON storage
 */
export interface SerializableWaypoint {
  id: string;
  position: SerializableVector3;
  pathId?: string;
  order?: number;
  triggerAction?: WaypointAction;
}

/**
 * A path connecting multiple waypoints
 */
export interface WaypointPath {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Ordered list of waypoint IDs */
  waypointIds: string[];
}

/**
 * Result of a raycast operation
 */
export interface RaycastHit {
  /** Hit position in world space */
  position: Vector3;
  /** Surface normal at hit point */
  normal: Vector3;
  /** Distance from ray origin */
  distance: number;
}

/**
 * Complete scene state for persistence
 */
export interface SceneState {
  /** Schema version for migrations */
  version: number;
  /** URL of the splat world */
  worldUrl: string;
  /** All placed treats */
  treats: SerializableTreat[];
  /** All waypoints */
  waypoints: SerializableWaypoint[];
  /** All waypoint paths */
  paths: WaypointPath[];
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Shareable scene reference
 */
export interface ShareableScene {
  /** Unique scene identifier */
  sceneId: string;
  /** Full shareable URL */
  shareUrl: string;
  /** S3 object key */
  s3Key: string;
}

/**
 * Token package for purchase
 */
export interface TokenPackage {
  /** Package identifier */
  id: string;
  /** Number of tokens */
  tokens: number;
  /** Price in USD */
  priceUsd: number;
  /** Stripe price ID */
  stripePriceId: string;
}

/**
 * World configuration for selection screen
 */
export interface World {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Thumbnail image URL */
  thumbnail: string;
  /** SPZ file URL */
  spzUrl: string;
  /** Description text */
  description: string;
}
