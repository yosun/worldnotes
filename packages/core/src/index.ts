/**
 * @worldnotes/core - Shared module for WorldNotes applications
 *
 * This module provides the core functionality for both Editor and Viewer apps:
 * - Treat management (CRUD operations)
 * - Scene serialization/deserialization
 * - Camera control
 * - Storage client (S3 + Cognito)
 * - Input handling
 */

// Types
export * from './types';

// Persistence
export * from './persistence';

// Services
export * from './services';
