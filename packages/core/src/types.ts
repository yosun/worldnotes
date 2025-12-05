/**
 * Core types for WorldNotes
 *
 * This module defines all TypeScript interfaces and types used throughout
 * the WorldNotes architecture. These types are framework-agnostic and can
 * be used by both the Editor and Viewer applications.
 *
 * @module @worldnotes/core/types
 */

// ============================================================================
// Basic Types
// ============================================================================

/**
 * 3D vector representing position, rotation, or scale in world space.
 *
 * @example
 * const position: Vector3 = { x: 1.5, y: 0.2, z: -3.0 };
 */
export interface Vector3 {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Z coordinate */
  z: number;
}

/**
 * Camera position and rotation for scene navigation.
 * Rotation uses pitch (x) and yaw (y) in radians.
 *
 * @example
 * const pose: CameraPose = {
 *   position: { x: 0, y: 1.6, z: 5 },
 *   rotation: { x: 0, y: Math.PI }
 * };
 */
export interface CameraPose {
  /** Camera position in world space */
  position: Vector3;
  /** Camera rotation: x = pitch, y = yaw (in radians) */
  rotation: { x: number; y: number };
}

/**
 * Application mode - determines available interactions.
 * - 'explore': Navigation and message reading only
 * - 'edit': Full editing capabilities including treat placement
 */
export type AppMode = 'explore' | 'edit';

// ============================================================================
// Treat Types
// ============================================================================

/**
 * Type of treat - built-in presets or custom.
 * - 'geomarker': Location pin marker
 * - 'bottle': Message in a bottle
 * - 'custom': User-provided GLB model
 */
export type TreatType = 'geomarker' | 'bottle' | 'custom' | string;


/**
 * Data required to create a new treat.
 * This is the input format for addTreat() operations.
 *
 * @example
 * const treatData: TreatData = {
 *   type: 'bottle',
 *   glbUrl: 'https://example.com/bottle.glb',
 *   message: 'Hello from WorldNotes!',
 *   position: { x: 1.5, y: 0.2, z: -3.0 },
 *   rotation: { x: 0, y: 1.57, z: 0 }
 * };
 */
export interface TreatData {
  /** Type of treat (geomarker, bottle, custom, or custom string) */
  type: TreatType;
  /** URL to the GLB 3D model file */
  glbUrl: string;
  /** Optional message attached to the treat (max 280 characters recommended) */
  message?: string;
  /** Position in world space */
  position: Vector3;
  /** Rotation as Euler angles (x, y, z) in radians */
  rotation: Vector3;
}

/**
 * A treat with full metadata including system-generated fields.
 * Extends TreatData with id and timestamps.
 *
 * @example
 * const treat: Treat = {
 *   id: 'treat-uuid-1',
 *   type: 'bottle',
 *   glbUrl: 'https://example.com/bottle.glb',
 *   message: 'Hello!',
 *   position: { x: 1.5, y: 0.2, z: -3.0 },
 *   rotation: { x: 0, y: 1.57, z: 0 },
 *   createdAt: '2025-12-05T10:00:00Z',
 *   updatedAt: '2025-12-05T10:00:00Z'
 * };
 */
export interface Treat extends TreatData {
  /** Unique identifier for the treat */
  id: string;
  /** ISO 8601 timestamp when the treat was created */
  createdAt?: string;
  /** ISO 8601 timestamp when the treat was last updated */
  updatedAt?: string;
}

// ============================================================================
// Scene State Types
// ============================================================================

/**
 * Complete scene state for persistence and sharing.
 * Contains all data needed to reconstruct a scene.
 *
 * @example
 * const state: SceneState = {
 *   version: 1,
 *   worldUrl: 'https://example.com/world.spz',
 *   worldFlipY: true,
 *   treats: [],
 *   createdAt: '2025-12-05T10:00:00Z',
 *   updatedAt: '2025-12-05T10:00:00Z'
 * };
 */
export interface SceneState {
  /** Schema version for migrations (current: 1) */
  version: number;
  /** URL of the SPZ splat world file */
  worldUrl: string;
  /** Whether to flip the world on Y axis (default: true for most SPZ files) */
  worldFlipY?: boolean;
  /** All treats placed in the scene */
  treats: Treat[];
  /** ISO 8601 timestamp when the scene was created */
  createdAt: string;
  /** ISO 8601 timestamp when the scene was last updated */
  updatedAt: string;
}

/**
 * Reference to a shared scene stored in S3.
 * Returned after successfully saving a scene.
 *
 * @example
 * const shared: ShareableScene = {
 *   sceneId: 'abc123',
 *   shareUrl: 'https://viewer.worldnotes.app/?scene=abc123',
 *   s3Key: 'scenes/abc123.json'
 * };
 */
export interface ShareableScene {
  /** Unique scene identifier */
  sceneId: string;
  /** Full shareable URL pointing to the Viewer app */
  shareUrl: string;
  /** S3 object key where the scene is stored */
  s3Key: string;
}


// ============================================================================
// Configuration Types
// ============================================================================

/**
 * AWS S3 and Cognito configuration for scene storage.
 *
 * @example
 * const storage: StorageConfig = {
 *   region: 'us-east-1',
 *   identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
 *   bucketName: 'worldnotes-scenes',
 *   appUrl: 'https://editor.worldnotes.app'
 * };
 */
export interface StorageConfig {
  /** AWS region (e.g., 'us-east-1') */
  region: string;
  /** Cognito Identity Pool ID for anonymous access */
  identityPoolId: string;
  /** S3 bucket name for scene storage */
  bucketName: string;
  /** Base URL of the Editor application */
  appUrl: string;
  /** Base URL of the Viewer application (optional, defaults to appUrl) */
  viewerUrl?: string;
}

/**
 * Configuration for initializing a WorldNotes world.
 *
 * @example
 * const config: WorldNotesConfig = {
 *   container: document.getElementById('canvas-container')!,
 *   worldUrl: 'https://example.com/world.spz',
 *   flipY: true,
 *   editMode: true,
 *   storage: {
 *     region: 'us-east-1',
 *     identityPoolId: 'us-east-1:xxx',
 *     bucketName: 'my-bucket',
 *     appUrl: 'https://editor.example.com'
 *   }
 * };
 */
export interface WorldNotesConfig {
  /** Container element for the 3D canvas */
  container: HTMLElement;
  /** URL to the SPZ splat world file */
  worldUrl: string;
  /** Whether to flip Y axis (default: true for most SPZ files) */
  flipY?: boolean;
  /** Initial camera pose when loading the world */
  initialPose?: CameraPose;
  /** S3/Cognito configuration for scene persistence */
  storage?: StorageConfig;
  /** Enable editing features (default: false for viewer) */
  editMode?: boolean;
}

// ============================================================================
// World Handle Interface
// ============================================================================

/**
 * Result of a raycast operation against the splat geometry.
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
 * Handle returned by initWorld() for scene manipulation.
 * Provides all methods needed to interact with the 3D world.
 *
 * @example
 * const world = await initWorld(config);
 *
 * // Add a treat
 * const treatId = world.addTreat({
 *   type: 'bottle',
 *   glbUrl: 'https://example.com/bottle.glb',
 *   position: { x: 0, y: 0, z: 0 },
 *   rotation: { x: 0, y: 0, z: 0 }
 * });
 *
 * // Listen for clicks
 * world.onTreatClicked((id) => console.log('Clicked:', id));
 *
 * // Clean up
 * world.dispose();
 */
export interface WorldHandle {
  // -------------------------------------------------------------------------
  // Treat Management
  // -------------------------------------------------------------------------

  /**
   * Add a new treat to the scene.
   * @param treatData - Data for the new treat
   * @returns The unique ID of the created treat
   */
  addTreat(treatData: TreatData): string;

  /**
   * Update an existing treat's properties.
   * @param treatId - ID of the treat to update
   * @param patch - Partial treat data to merge
   */
  updateTreat(treatId: string, patch: Partial<TreatData>): void;

  /**
   * Remove a treat from the scene.
   * @param treatId - ID of the treat to remove
   */
  removeTreat(treatId: string): void;

  /**
   * Get all treats in the scene.
   * @returns Array of all treats
   */
  getTreats(): Treat[];

  /**
   * Get a single treat by ID.
   * @param treatId - ID of the treat to retrieve
   * @returns The treat or null if not found
   */
  getTreat(treatId: string): Treat | null;

  // -------------------------------------------------------------------------
  // Camera Control
  // -------------------------------------------------------------------------

  /**
   * Set the camera position and rotation.
   * @param pose - New camera pose
   */
  setCameraPose(pose: CameraPose): void;

  /**
   * Get the current camera position and rotation.
   * @returns Current camera pose
   */
  getCameraPose(): CameraPose;

  // -------------------------------------------------------------------------
  // Scene State
  // -------------------------------------------------------------------------

  /**
   * Get the current scene state for persistence.
   * @returns Complete scene state
   */
  getSceneState(): SceneState;

  /**
   * Load treats from a scene state.
   * Replaces all current treats with those from the state.
   * @param state - Scene state to load
   */
  loadSceneState(state: SceneState): void;

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------

  /**
   * Register a callback for treat click events.
   * @param callback - Function called with treat ID when clicked
   * @returns Unsubscribe function
   */
  onTreatClicked(callback: (treatId: string) => void): () => void;

  /**
   * Register a callback for message zone proximity events.
   * Called when the user enters the interaction zone of a treat with a message.
   * @param callback - Function called with treat ID when zone entered
   * @returns Unsubscribe function
   */
  onMessageZoneEntered(callback: (treatId: string) => void): () => void;

  /**
   * Register a callback for mode change events.
   * @param callback - Function called with new mode when changed
   * @returns Unsubscribe function
   */
  onModeChange(callback: (mode: AppMode) => void): () => void;

  // -------------------------------------------------------------------------
  // Mode Control (Editor only)
  // -------------------------------------------------------------------------

  /**
   * Set the application mode (Editor only).
   * @param mode - New mode to set
   */
  setMode?(mode: AppMode): void;

  /**
   * Get the current application mode (Editor only).
   * @returns Current mode
   */
  getMode?(): AppMode;

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  /**
   * Dispose of all resources and clean up event listeners.
   * Call this when unmounting the world.
   */
  dispose(): void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Callback type for mode change events.
 */
export type ModeChangeCallback = (mode: AppMode) => void;

/**
 * Callback type for treat click events.
 */
export type TreatClickCallback = (treatId: string) => void;

/**
 * Callback type for message zone events.
 */
export type MessageZoneCallback = (treatId: string) => void;
