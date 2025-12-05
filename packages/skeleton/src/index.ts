/**
 * @splat-and-treat/skeleton
 *
 * Shared types and utilities for Splat and Treat applications.
 *
 * NOTE: 3D rendering (SparkJS) is handled in vanilla JS (public/viewer.html)
 * due to WASM bundler incompatibility. This package provides types only.
 */

// Core types
export * from './core/types';

// Mode management
export { createModeManager } from './mode/ModeManager';
