/**
 * Core type definitions for Splat and Treat skeleton.
 * These types define the data structures used throughout the application.
 *
 * NOTE: Types are framework-agnostic (no Three.js imports) since the 3D viewer
 * uses vanilla JS with SparkJS loaded via CDN importmap.
 */

/**
 * Application mode - either editing or exploring the world
 */
export type AppMode = 'edit' | 'explore';

/**
 * Type of treat that can be placed in the world
 */
export type TreatType = 'custom' | 'library' | 'waypoint' | 'ai-generated' | 'message-bottle';

/**
 * 3D vector representation (x, y, z coordinates)
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Euler rotation representation (x, y, z angles with optional order)
 */
export interface Euler {
  x: number;
  y: number;
  z: number;
  order?: string;
}

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
 * RaycastSystem interface for performing raycasts against splat geometry.
 * Wraps SparkJS built-in raycasting functionality.
 */
export interface RaycastSystem {
  /**
   * Perform raycast from screen coordinates (normalized -1 to 1).
   * @param x - Normalized x coordinate (-1 = left, 1 = right)
   * @param y - Normalized y coordinate (-1 = bottom, 1 = top)
   * @returns Hit result or null if no intersection
   */
  raycastFromScreen(x: number, y: number): RaycastHit | null;

  /**
   * Perform raycast from world ray.
   * @param origin - Ray origin in world space
   * @param direction - Ray direction (normalized)
   * @returns Hit result or null if no intersection
   */
  raycastFromRay(origin: Vector3, direction: Vector3): RaycastHit | null;

  /**
   * Perform raycast from a mouse/touch event.
   * Convenience method that converts client coordinates to normalized coordinates.
   * @param clientX - Client X coordinate from event
   * @param clientY - Client Y coordinate from event
   * @param canvas - The canvas element for coordinate conversion
   * @returns Hit result or null if no intersection
   */
  raycastFromEvent(clientX: number, clientY: number, canvas: HTMLCanvasElement): RaycastHit | null;
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
  treats: Treat[];
  /** All waypoints */
  waypoints: Waypoint[];
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
 * Starting camera position and rotation for a world
 */
export interface WorldStartPosition {
  /** Camera position (x, y, z) */
  position: Vector3;
  /** Camera rotation in radians (pitch, yaw) */
  rotation?: { x: number; y: number };
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
  /** Optional starting camera position */
  startPosition?: WorldStartPosition;
}

/**
 * Callback for mode change events
 */
export type ModeChangeCallback = (mode: AppMode) => void;

/**
 * Mode manager interface for switching between Edit and Explore modes.
 * Manages application state and emits events on mode changes.
 */
export interface ModeManager {
  /** Get the current application mode */
  getMode(): AppMode;
  /** Set the application mode */
  setMode(mode: AppMode): void;
  /** Toggle between edit and explore modes */
  toggle(): void;
  /** Subscribe to mode change events. Returns unsubscribe function. */
  onModeChange(callback: ModeChangeCallback): () => void;
  /** Check if currently in edit mode */
  isEditMode(): boolean;
  /** Check if currently in explore mode */
  isExploreMode(): boolean;
}
