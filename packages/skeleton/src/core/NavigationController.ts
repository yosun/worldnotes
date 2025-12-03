/**
 * NavigationController - FPS-style navigation for desktop and mobile
 * 
 * Handles WASD/arrow keys for movement, mouse drag for look direction,
 * mobile virtual joystick, and touch controls.
 * 
 * Requirements: 0.1.1, 0.1.2, 0.1.3, 0.1.4, 0.1.5, 0.1.6
 */

import * as THREE from 'three';

/**
 * Configuration options for NavigationController
 */
export interface NavigationControllerConfig {
  /** Target element for input events */
  domElement: HTMLElement;
  /** Camera to control */
  camera: THREE.PerspectiveCamera;
  /** Movement speed in units per second */
  moveSpeed?: number;
  /** Look sensitivity (radians per pixel) */
  lookSensitivity?: number;
  /** Minimum vertical look angle (radians) */
  minPolarAngle?: number;
  /** Maximum vertical look angle (radians) */
  maxPolarAngle?: number;
  /** Minimum FOV for pinch zoom */
  minFov?: number;
  /** Maximum FOV for pinch zoom */
  maxFov?: number;
}

/**
 * Movement state tracking
 */
interface MovementState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

/**
 * Touch tracking for multi-touch gestures
 */
interface TouchState {
  lookTouchId: number | null;
  joystickActive: boolean;
  pinchStartDistance: number | null;
  pinchStartFov: number | null;
}

/**
 * NavigationController class for FPS-style camera movement
 */
export class NavigationController {
  private domElement: HTMLElement;
  private camera: THREE.PerspectiveCamera;
  private enabled = true;
  
  // Configuration
  private moveSpeed: number;
  private lookSensitivity: number;
  private minPolarAngle: number;
  private maxPolarAngle: number;
  private minFov: number;
  private maxFov: number;
  
  // Movement state
  private movement: MovementState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };
  
  // Look state
  private euler = new THREE.Euler(0, 0, 0, 'YXZ');
  private velocity = new THREE.Vector3();
  
  // Mouse state
  private isMouseDragging = false;
  private previousMouseX = 0;
  private previousMouseY = 0;
  
  // Touch state
  private touchState: TouchState = {
    lookTouchId: null,
    joystickActive: false,
    pinchStartDistance: null,
    pinchStartFov: null,
  };
  
  // Mobile joystick input (set externally by joystick component)
  private joystickVector = new THREE.Vector2(0, 0);
  
  // Bound event handlers for cleanup
  private boundHandlers: {
    onKeyDown: (e: KeyboardEvent) => void;
    onKeyUp: (e: KeyboardEvent) => void;
    onMouseDown: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
    onMouseUp: (e: MouseEvent) => void;
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: (e: TouchEvent) => void;
    onContextMenu: (e: Event) => void;
  };

  constructor(config: NavigationControllerConfig) {
    this.domElement = config.domElement;
    this.camera = config.camera;
    this.moveSpeed = config.moveSpeed ?? 5;
    this.lookSensitivity = config.lookSensitivity ?? 0.002;
    this.minPolarAngle = config.minPolarAngle ?? 0.1;
    this.maxPolarAngle = config.maxPolarAngle ?? Math.PI - 0.1;
    this.minFov = config.minFov ?? 30;
    this.maxFov = config.maxFov ?? 90;
    
    // Initialize euler from camera rotation
    this.euler.setFromQuaternion(this.camera.quaternion);
    
    // Bind event handlers
    this.boundHandlers = {
      onKeyDown: this.onKeyDown.bind(this),
      onKeyUp: this.onKeyUp.bind(this),
      onMouseDown: this.onMouseDown.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
      onMouseUp: this.onMouseUp.bind(this),
      onTouchStart: this.onTouchStart.bind(this),
      onTouchMove: this.onTouchMove.bind(this),
      onTouchEnd: this.onTouchEnd.bind(this),
      onContextMenu: (e: Event) => e.preventDefault(),
    };
    
    this.addEventListeners();
  }

  /**
   * Add all event listeners
   */
  private addEventListeners(): void {
    // Keyboard events (on window for global capture)
    window.addEventListener('keydown', this.boundHandlers.onKeyDown);
    window.addEventListener('keyup', this.boundHandlers.onKeyUp);
    
    // Mouse events
    this.domElement.addEventListener('mousedown', this.boundHandlers.onMouseDown);
    window.addEventListener('mousemove', this.boundHandlers.onMouseMove);
    window.addEventListener('mouseup', this.boundHandlers.onMouseUp);
    
    // Touch events
    this.domElement.addEventListener('touchstart', this.boundHandlers.onTouchStart, { passive: false });
    this.domElement.addEventListener('touchmove', this.boundHandlers.onTouchMove, { passive: false });
    this.domElement.addEventListener('touchend', this.boundHandlers.onTouchEnd);
    this.domElement.addEventListener('touchcancel', this.boundHandlers.onTouchEnd);
    
    // Prevent context menu on right-click
    this.domElement.addEventListener('contextmenu', this.boundHandlers.onContextMenu);
  }

  /**
   * Remove all event listeners
   */
  private removeEventListeners(): void {
    window.removeEventListener('keydown', this.boundHandlers.onKeyDown);
    window.removeEventListener('keyup', this.boundHandlers.onKeyUp);
    
    this.domElement.removeEventListener('mousedown', this.boundHandlers.onMouseDown);
    window.removeEventListener('mousemove', this.boundHandlers.onMouseMove);
    window.removeEventListener('mouseup', this.boundHandlers.onMouseUp);
    
    this.domElement.removeEventListener('touchstart', this.boundHandlers.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.boundHandlers.onTouchMove);
    this.domElement.removeEventListener('touchend', this.boundHandlers.onTouchEnd);
    this.domElement.removeEventListener('touchcancel', this.boundHandlers.onTouchEnd);
    
    this.domElement.removeEventListener('contextmenu', this.boundHandlers.onContextMenu);
  }

  /**
   * Handle keydown events for WASD/arrow movement
   */
  private onKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;
    
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.movement.forward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.movement.backward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.movement.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.movement.right = true;
        break;
    }
  }

  /**
   * Handle keyup events
   */
  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.movement.forward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.movement.backward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.movement.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.movement.right = false;
        break;
    }
  }

  /**
   * Handle mouse down for look drag
   */
  private onMouseDown(event: MouseEvent): void {
    if (!this.enabled) return;
    
    // Left or right mouse button for look
    if (event.button === 0 || event.button === 2) {
      this.isMouseDragging = true;
      this.previousMouseX = event.clientX;
      this.previousMouseY = event.clientY;
    }
  }

  /**
   * Handle mouse move for look direction
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.enabled || !this.isMouseDragging) return;
    
    const deltaX = event.clientX - this.previousMouseX;
    const deltaY = event.clientY - this.previousMouseY;
    
    this.previousMouseX = event.clientX;
    this.previousMouseY = event.clientY;
    
    this.updateLook(deltaX, deltaY);
  }

  /**
   * Handle mouse up
   */
  private onMouseUp(event: MouseEvent): void {
    if (event.button === 0 || event.button === 2) {
      this.isMouseDragging = false;
    }
  }

  /**
   * Handle touch start for mobile look and pinch zoom
   */
  private onTouchStart(event: TouchEvent): void {
    if (!this.enabled) return;
    
    const touches = event.touches;
    
    // Two finger pinch zoom
    if (touches.length === 2) {
      event.preventDefault();
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      this.touchState.pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
      this.touchState.pinchStartFov = this.camera.fov;
      return;
    }
    
    // Single touch for look (if not on joystick area)
    if (touches.length === 1 && !this.touchState.joystickActive) {
      const touch = touches[0];
      // Only use touch for look if it's on the right side of the screen
      // (left side is reserved for joystick)
      const rect = this.domElement.getBoundingClientRect();
      if (touch.clientX > rect.width * 0.3) {
        this.touchState.lookTouchId = touch.identifier;
        this.previousMouseX = touch.clientX;
        this.previousMouseY = touch.clientY;
      }
    }
  }

  /**
   * Handle touch move for look and pinch zoom
   */
  private onTouchMove(event: TouchEvent): void {
    if (!this.enabled) return;
    
    const touches = event.touches;
    
    // Handle pinch zoom
    if (touches.length === 2 && this.touchState.pinchStartDistance !== null) {
      event.preventDefault();
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const scale = this.touchState.pinchStartDistance / distance;
      const newFov = (this.touchState.pinchStartFov ?? 75) * scale;
      this.camera.fov = Math.max(this.minFov, Math.min(this.maxFov, newFov));
      this.camera.updateProjectionMatrix();
      return;
    }
    
    // Handle look touch
    if (this.touchState.lookTouchId !== null) {
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        if (touch.identifier === this.touchState.lookTouchId) {
          event.preventDefault();
          const deltaX = touch.clientX - this.previousMouseX;
          const deltaY = touch.clientY - this.previousMouseY;
          
          this.previousMouseX = touch.clientX;
          this.previousMouseY = touch.clientY;
          
          this.updateLook(deltaX, deltaY);
          break;
        }
      }
    }
  }

  /**
   * Handle touch end
   */
  private onTouchEnd(event: TouchEvent): void {
    // Reset pinch state if less than 2 touches
    if (event.touches.length < 2) {
      this.touchState.pinchStartDistance = null;
      this.touchState.pinchStartFov = null;
    }
    
    // Check if look touch ended
    if (this.touchState.lookTouchId !== null) {
      let found = false;
      for (let i = 0; i < event.touches.length; i++) {
        if (event.touches[i].identifier === this.touchState.lookTouchId) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.touchState.lookTouchId = null;
      }
    }
  }

  /**
   * Update camera look direction
   */
  private updateLook(deltaX: number, deltaY: number): void {
    // Horizontal rotation (yaw)
    this.euler.y -= deltaX * this.lookSensitivity;
    
    // Vertical rotation (pitch) with clamping
    this.euler.x -= deltaY * this.lookSensitivity;
    this.euler.x = Math.max(
      Math.PI / 2 - this.maxPolarAngle,
      Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x)
    );
    
    this.camera.quaternion.setFromEuler(this.euler);
  }

  /**
   * Set joystick input vector (called by mobile joystick component)
   * @param x - Horizontal input (-1 to 1)
   * @param y - Vertical input (-1 to 1)
   */
  setJoystickInput(x: number, y: number): void {
    this.joystickVector.set(x, y);
    this.touchState.joystickActive = x !== 0 || y !== 0;
  }

  /**
   * Enable or disable navigation
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      // Reset movement state when disabled
      this.movement.forward = false;
      this.movement.backward = false;
      this.movement.left = false;
      this.movement.right = false;
      this.joystickVector.set(0, 0);
      this.isMouseDragging = false;
    }
  }

  /**
   * Check if navigation is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Update camera position based on input (call in animation loop)
   * @param deltaTime - Time since last frame in seconds
   */
  update(deltaTime: number): void {
    if (!this.enabled) return;
    
    // Calculate movement direction
    const direction = new THREE.Vector3();
    
    // Keyboard input
    if (this.movement.forward) direction.z -= 1;
    if (this.movement.backward) direction.z += 1;
    if (this.movement.left) direction.x -= 1;
    if (this.movement.right) direction.x += 1;
    
    // Joystick input (additive)
    direction.x += this.joystickVector.x;
    direction.z -= this.joystickVector.y; // Joystick Y is inverted
    
    // Normalize if moving diagonally
    if (direction.length() > 1) {
      direction.normalize();
    }
    
    // Apply movement in camera's local space
    if (direction.length() > 0) {
      // Get camera's forward and right vectors (ignoring pitch for ground movement)
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);
      
      // Rotate by camera's yaw only
      const yawQuat = new THREE.Quaternion();
      yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.euler.y);
      
      forward.applyQuaternion(yawQuat);
      right.applyQuaternion(yawQuat);
      
      // Calculate velocity
      this.velocity.set(0, 0, 0);
      this.velocity.addScaledVector(right, direction.x);
      this.velocity.addScaledVector(forward, -direction.z);
      this.velocity.multiplyScalar(this.moveSpeed * deltaTime);
      
      // Apply to camera position
      this.camera.position.add(this.velocity);
    }
  }

  /**
   * Check if running on a mobile device
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || ('ontouchstart' in window);
  }

  /**
   * Get current movement velocity
   */
  getVelocity(): THREE.Vector3 {
    return this.velocity.clone();
  }

  /**
   * Set movement speed
   */
  setMoveSpeed(speed: number): void {
    this.moveSpeed = speed;
  }

  /**
   * Set look sensitivity
   */
  setLookSensitivity(sensitivity: number): void {
    this.lookSensitivity = sensitivity;
  }

  /**
   * Dispose of the controller and remove event listeners
   */
  dispose(): void {
    this.removeEventListeners();
    this.enabled = false;
  }
}
