/**
 * SceneManager - Orchestrates 3D scene management with SparkJS and Three.js
 * 
 * Handles SPZ world loading via SparkJS SplatLoader, camera controls,
 * and exposes the Three.js scene for GLB object placement.
 * 
 * Requirements: 1.3, 1.4, 1.5
 */

import { SparkRenderer, SplatLoader, SparkControls } from '@sparkjsdev/spark';
import * as THREE from 'three';

/**
 * Configuration options for SceneManager initialization
 */
export interface SceneManagerConfig {
  /** Canvas element for rendering */
  canvas: HTMLCanvasElement;
  /** Optional callback when scene is ready */
  onReady?: () => void;
  /** Optional callback for load progress */
  onProgress?: (progress: number) => void;
  /** Optional callback for errors */
  onError?: (error: Error) => void;
}

/**
 * Error types for scene loading failures
 */
export type SceneLoadError = 
  | { type: 'network'; message: string; url: string }
  | { type: 'parse'; message: string; url: string }
  | { type: 'timeout'; message: string; url: string }
  | { type: 'unknown'; message: string };

/**
 * Result of a world load operation
 */
export type LoadWorldResult = 
  | { success: true }
  | { success: false; error: SceneLoadError };

/**
 * SceneManager class for managing SparkJS splat worlds and Three.js integration
 */
export class SceneManager {
  private canvas: HTMLCanvasElement;
  private config: SceneManagerConfig;
  private isInitialized = false;
  private currentWorldUrl: string | null = null;
  private controlsEnabled = true;

  // Three.js core
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  
  // SparkJS
  private sparkRenderer: SparkRenderer | null = null;
  private controls: SparkControls | null = null;
  private splatLoader: SplatLoader | null = null;
  
  // Animation
  private animationFrameId: number | null = null;
  private clock: THREE.Clock;

  constructor(config: SceneManagerConfig) {
    this.canvas = config.canvas;
    this.config = config;
    this.clock = new THREE.Clock();
  }

  /**
   * Initialize the Three.js scene and SparkJS renderer
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x1a1a2e);

      // Create camera
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
      this.camera.position.set(0, 1.6, 5);

      // Create WebGL renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: false, // SparkJS recommends antialias: false for performance
      });
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create SparkRenderer for Gaussian splat rendering
      this.sparkRenderer = new SparkRenderer({
        renderer: this.renderer,
      });
      this.scene.add(this.sparkRenderer);

      // Create SparkControls for camera movement
      this.controls = new SparkControls({ canvas: this.canvas });

      // Create SplatLoader for loading SPZ files
      this.splatLoader = new SplatLoader();

      // Add basic lighting for GLB objects
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 5);
      this.scene.add(directionalLight);

      this.isInitialized = true;
      this.config.onReady?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.config.onError?.(err);
      throw err;
    }
  }

  /**
   * Load a splat world from an SPZ URL
   * @param spzUrl - URL to the .spz file
   * @param timeoutMs - Optional timeout in milliseconds (default: 10000)
   */
  async loadWorld(spzUrl: string, timeoutMs = 10000): Promise<LoadWorldResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.splatLoader || !this.sparkRenderer || !this.scene) {
      return {
        success: false,
        error: { type: 'unknown', message: 'Failed to initialize scene components' }
      };
    }

    // Handle empty world case
    if (!spzUrl) {
      this.currentWorldUrl = null;
      return { success: true };
    }

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Load timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      // Load the SPZ file
      const loadPromise = new Promise<void>((resolve, reject) => {
        this.splatLoader!.load(
          spzUrl,
          (packedSplats) => {
            try {
              // Parse the loaded splats into a SplatMesh
              const splatMesh = this.splatLoader!.parse(packedSplats);
              this.scene!.add(splatMesh);
              resolve();
            } catch (parseError) {
              reject(parseError);
            }
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total) * 100;
              this.config.onProgress?.(percent);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });

      // Race between load and timeout
      await Promise.race([loadPromise, timeoutPromise]);

      this.currentWorldUrl = spzUrl;
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      let sceneError: SceneLoadError;
      
      if (errorMessage.includes('timeout')) {
        sceneError = { type: 'timeout', message: errorMessage, url: spzUrl };
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('404') || errorMessage.includes('Failed to fetch')) {
        sceneError = { type: 'network', message: errorMessage, url: spzUrl };
      } else if (errorMessage.includes('parse') || errorMessage.includes('invalid')) {
        sceneError = { type: 'parse', message: errorMessage, url: spzUrl };
      } else {
        sceneError = { type: 'unknown', message: errorMessage };
      }

      this.config.onError?.(new Error(errorMessage));
      return { success: false, error: sceneError };
    }
  }

  /**
   * Get the Three.js scene for object placement
   */
  getScene(): THREE.Scene | null {
    return this.scene;
  }

  /**
   * Get the camera for navigation
   */
  getCamera(): THREE.PerspectiveCamera | null {
    return this.camera;
  }

  /**
   * Get the WebGL renderer
   */
  getRenderer(): THREE.WebGLRenderer | null {
    return this.renderer;
  }

  /**
   * Get the SparkRenderer instance for advanced splat operations
   */
  getSparkRenderer(): SparkRenderer | null {
    return this.sparkRenderer;
  }

  /**
   * Get the SparkControls instance
   */
  getControls(): SparkControls | null {
    return this.controls;
  }

  /**
   * Enable or disable camera controls
   */
  setControlsEnabled(enabled: boolean): void {
    this.controlsEnabled = enabled;
    if (this.controls) {
      this.controls.fpsMovement.enable = enabled;
      this.controls.pointerControls.enable = enabled;
    }
  }

  /**
   * Check if controls are enabled
   */
  areControlsEnabled(): boolean {
    return this.controlsEnabled;
  }

  /**
   * Get the currently loaded world URL
   */
  getCurrentWorldUrl(): string | null {
    return this.currentWorldUrl;
  }

  /**
   * Check if the manager is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.scene !== null;
  }

  /**
   * Resize the renderer to match canvas size
   */
  resize(): void {
    if (!this.renderer || !this.camera || !this.canvas) return;
    
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Start the render loop
   */
  startRenderLoop(): void {
    if (!this.scene || !this.camera || !this.renderer) return;
    
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      
      // Get delta time for future use (animations, physics)
      this.clock.getDelta();
      
      // Update controls
      if (this.controls && this.camera && this.controlsEnabled) {
        this.controls.update(this.camera);
      }
      
      // Update SparkRenderer
      if (this.sparkRenderer && this.scene) {
        this.sparkRenderer.update({ scene: this.scene });
      }
      
      // Render the scene
      this.renderer!.render(this.scene!, this.camera!);
    };
    
    this.clock.start();
    animate();
  }

  /**
   * Stop the render loop
   */
  stopRenderLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.stopRenderLoop();
    
    // Dispose SparkRenderer
    if (this.sparkRenderer) {
      this.scene?.remove(this.sparkRenderer);
      this.sparkRenderer = null;
    }
    
    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    // Clear scene
    if (this.scene) {
      this.scene.clear();
      this.scene = null;
    }
    
    this.camera = null;
    this.controls = null;
    this.splatLoader = null;
    this.isInitialized = false;
    this.currentWorldUrl = null;
  }
}
