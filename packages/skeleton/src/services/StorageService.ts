/**
 * StorageService - Client-side S3 storage for scene persistence.
 *
 * Uses AWS Cognito Identity Pool for anonymous credentials (no login required).
 * Scenes are stored as JSON files in S3 with UUID-based keys.
 *
 * @module services/StorageService
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import type { SceneState, ShareableScene } from '../core/types';
import { toJSON } from '../persistence/SceneSerializer';
import { fromJSON } from '../persistence/SceneDeserializer';

/**
 * Configuration for StorageService
 */
export interface StorageServiceConfig {
  /** AWS region (e.g., 'us-east-1') */
  region: string;
  /** Cognito Identity Pool ID */
  identityPoolId: string;
  /** S3 bucket name */
  bucketName: string;
  /** Base URL for shareable links (e.g., 'https://splatandtreat.com') */
  appUrl: string;
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * StorageService class for saving and loading scenes to/from S3.
 *
 * Example usage:
 * ```typescript
 * const storage = new StorageService({
 *   region: 'us-east-1',
 *   identityPoolId: 'us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
 *   bucketName: 'splat-and-treat-scenes',
 *   appUrl: 'https://splatandtreat.com'
 * });
 *
 * // Save a scene
 * const { sceneId, shareUrl } = await storage.saveScene(sceneState);
 *
 * // Load a scene
 * const loadedState = await storage.loadScene(sceneId);
 * ```
 */
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private appUrl: string;

  constructor(config: StorageServiceConfig) {
    this.bucketName = config.bucketName;
    this.appUrl = config.appUrl.replace(/\/$/, ''); // Remove trailing slash

    this.s3Client = new S3Client({
      region: config.region,
      credentials: fromCognitoIdentityPool({
        identityPoolId: config.identityPoolId,
        clientConfig: { region: config.region },
      }),
    });
  }


  /**
   * Generate the S3 key for a scene
   */
  private getS3Key(sceneId: string): string {
    return `scenes/${sceneId}.json`;
  }

  /**
   * Generate a shareable URL for a scene
   */
  getShareUrl(sceneId: string): string {
    return `${this.appUrl}?scene=${encodeURIComponent(sceneId)}`;
  }

  /**
   * Save a scene state to S3 and return shareable information.
   *
   * @param state - The SceneState to save
   * @param existingSceneId - Optional existing scene ID to update
   * @returns ShareableScene with sceneId, shareUrl, and s3Key
   * @throws Error if save fails
   */
  async saveScene(state: SceneState, existingSceneId?: string): Promise<ShareableScene> {
    const sceneId = existingSceneId || generateUUID();
    const s3Key = this.getS3Key(sceneId);

    // Update timestamps
    const stateToSave: SceneState = {
      ...state,
      updatedAt: new Date().toISOString(),
      createdAt: existingSceneId ? state.createdAt : new Date().toISOString(),
    };

    const jsonBody = toJSON(stateToSave);

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: jsonBody,
        ContentType: 'application/json',
      })
    );

    return {
      sceneId,
      shareUrl: this.getShareUrl(sceneId),
      s3Key,
    };
  }

  /**
   * Load a scene state from S3 by scene ID.
   *
   * @param sceneId - The scene ID to load
   * @returns SceneState or null if not found
   * @throws Error if load fails (other than not found)
   */
  async loadScene(sceneId: string): Promise<SceneState | null> {
    const s3Key = this.getS3Key(sceneId);

    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
        })
      );

      if (!response.Body) {
        return null;
      }

      // Convert stream to string
      const bodyString = await response.Body.transformToString();
      return fromJSON(bodyString);
    } catch (error: unknown) {
      // Check if it's a "not found" error
      if (error instanceof Error && error.name === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update an existing scene in S3.
   *
   * @param sceneId - The scene ID to update
   * @param state - The new SceneState
   * @throws Error if update fails
   */
  async updateScene(sceneId: string, state: SceneState): Promise<void> {
    await this.saveScene(state, sceneId);
  }

  /**
   * Delete a scene from S3.
   * Note: This requires additional IAM permissions (s3:DeleteObject).
   *
   * @param sceneId - The scene ID to delete
   * @throws Error if delete fails
   */
  async deleteScene(sceneId: string): Promise<void> {
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const s3Key = this.getS3Key(sceneId);

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      })
    );
  }
}

/**
 * Create a StorageService instance from environment variables.
 * Expects VITE_AWS_REGION, VITE_AWS_COGNITO_IDENTITY_POOL_ID,
 * VITE_AWS_S3_BUCKET, and VITE_APP_URL to be defined.
 *
 * @returns StorageService instance
 * @throws Error if required environment variables are missing
 */
export function createStorageServiceFromEnv(): StorageService {
  const region = import.meta.env?.VITE_AWS_REGION;
  const identityPoolId = import.meta.env?.VITE_AWS_COGNITO_IDENTITY_POOL_ID;
  const bucketName = import.meta.env?.VITE_AWS_S3_BUCKET;
  const appUrl = import.meta.env?.VITE_APP_URL;

  if (!region) {
    throw new Error('Missing required environment variable: VITE_AWS_REGION');
  }
  if (!identityPoolId) {
    throw new Error('Missing required environment variable: VITE_AWS_COGNITO_IDENTITY_POOL_ID');
  }
  if (!bucketName) {
    throw new Error('Missing required environment variable: VITE_AWS_S3_BUCKET');
  }
  if (!appUrl) {
    throw new Error('Missing required environment variable: VITE_APP_URL');
  }

  return new StorageService({
    region,
    identityPoolId,
    bucketName,
    appUrl,
  });
}
