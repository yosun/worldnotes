/**
 * Unit tests for SceneSerializer and SceneDeserializer
 */

import { describe, it, expect } from 'vitest';
import { toJSON, toObject, serializeVector3, serializeEuler } from './SceneSerializer';
import { fromJSON, fromObject, deserializeVector3, deserializeEuler } from './SceneDeserializer';
import type { SceneState, Treat, Waypoint, WaypointPath } from '../core/types';

describe('SceneSerializer', () => {
  describe('serializeVector3', () => {
    it('should serialize Vector3 to plain object', () => {
      const vec = { x: 1.5, y: 2.5, z: 3.5 };
      const result = serializeVector3(vec);
      expect(result).toEqual({ x: 1.5, y: 2.5, z: 3.5 });
    });
  });

  describe('serializeEuler', () => {
    it('should serialize Euler without order', () => {
      const euler = { x: 0.1, y: 0.2, z: 0.3 };
      const result = serializeEuler(euler);
      expect(result).toEqual({ x: 0.1, y: 0.2, z: 0.3 });
    });

    it('should serialize Euler with order', () => {
      const euler = { x: 0.1, y: 0.2, z: 0.3, order: 'XYZ' };
      const result = serializeEuler(euler);
      expect(result).toEqual({ x: 0.1, y: 0.2, z: 0.3, order: 'XYZ' });
    });
  });

  describe('toJSON', () => {
    it('should serialize complete SceneState to JSON string', () => {
      const state: SceneState = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [
          {
            id: 'treat-1',
            type: 'custom',
            glbUrl: 'https://example.com/model.glb',
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            metadata: { text: 'Hello' },
          },
        ],
        waypoints: [],
        paths: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const json = toJSON(state);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.worldUrl).toBe('https://example.com/world.spz');
      expect(parsed.treats).toHaveLength(1);
      expect(parsed.treats[0].id).toBe('treat-1');
    });
  });

  describe('toObject', () => {
    it('should serialize SceneState to plain object', () => {
      const state: SceneState = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        waypoints: [
          {
            id: 'wp-1',
            position: { x: 5, y: 0, z: 5 },
            pathId: 'path-1',
            order: 0,
          },
        ],
        paths: [
          {
            id: 'path-1',
            name: 'Tour',
            waypointIds: ['wp-1'],
          },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const obj = toObject(state);

      expect(obj.waypoints).toHaveLength(1);
      expect(obj.waypoints[0].pathId).toBe('path-1');
      expect(obj.paths).toHaveLength(1);
      expect(obj.paths[0].waypointIds).toEqual(['wp-1']);
    });
  });
});

describe('SceneDeserializer', () => {
  describe('deserializeVector3', () => {
    it('should deserialize plain object to Vector3', () => {
      const data = { x: 1.5, y: 2.5, z: 3.5 };
      const result = deserializeVector3(data);
      expect(result).toEqual({ x: 1.5, y: 2.5, z: 3.5 });
    });

    it('should convert string numbers to numbers', () => {
      const data = { x: '1.5' as unknown as number, y: '2.5' as unknown as number, z: '3.5' as unknown as number };
      const result = deserializeVector3(data);
      expect(result).toEqual({ x: 1.5, y: 2.5, z: 3.5 });
    });
  });

  describe('deserializeEuler', () => {
    it('should deserialize Euler without order', () => {
      const data = { x: 0.1, y: 0.2, z: 0.3 };
      const result = deserializeEuler(data);
      expect(result).toEqual({ x: 0.1, y: 0.2, z: 0.3 });
    });

    it('should deserialize Euler with order', () => {
      const data = { x: 0.1, y: 0.2, z: 0.3, order: 'XYZ' };
      const result = deserializeEuler(data);
      expect(result).toEqual({ x: 0.1, y: 0.2, z: 0.3, order: 'XYZ' });
    });
  });

  describe('fromJSON', () => {
    it('should deserialize JSON string to SceneState', () => {
      const json = JSON.stringify({
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [
          {
            id: 'treat-1',
            type: 'custom',
            glbUrl: 'https://example.com/model.glb',
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            metadata: { text: 'Hello' },
          },
        ],
        waypoints: [],
        paths: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      });

      const state = fromJSON(json);

      expect(state.version).toBe(1);
      expect(state.worldUrl).toBe('https://example.com/world.spz');
      expect(state.treats).toHaveLength(1);
      expect(state.treats[0].type).toBe('custom');
    });

    it('should throw on invalid JSON', () => {
      expect(() => fromJSON('not valid json')).toThrow();
    });
  });

  describe('fromObject', () => {
    it('should handle missing optional fields', () => {
      const data = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        waypoints: [],
        paths: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const state = fromObject(data);

      expect(state.treats).toEqual([]);
      expect(state.waypoints).toEqual([]);
      expect(state.paths).toEqual([]);
    });

    it('should throw when worldUrl is missing', () => {
      const data = {
        version: 1,
        treats: [],
        waypoints: [],
        paths: [],
      } as unknown as Parameters<typeof fromObject>[0];

      expect(() => fromObject(data)).toThrow('SceneState missing required field: worldUrl');
    });

    it('should default unknown treat types to custom', () => {
      const data = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [
          {
            id: 'treat-1',
            type: 'unknown-type',
            glbUrl: 'https://example.com/model.glb',
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            metadata: {},
          },
        ],
        waypoints: [],
        paths: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const state = fromObject(data);
      expect(state.treats[0].type).toBe('custom');
    });
  });
});

describe('Round-trip serialization', () => {
  it('should preserve SceneState through serialize/deserialize cycle', () => {
    const original: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [
        {
          id: 'treat-1',
          type: 'message-bottle',
          glbUrl: 'https://s3.amazonaws.com/worldmatica/message_in_a_bottle.glb',
          position: { x: 10.5, y: -2.3, z: 7.8 },
          rotation: { x: 0.1, y: 0.2, z: 0.3, order: 'XYZ' },
          scale: { x: 1.5, y: 1.5, z: 1.5 },
          metadata: { text: 'Hello world!', objectId: 'obj-123' },
        },
      ],
      waypoints: [
        {
          id: 'wp-1',
          position: { x: 5, y: 0, z: 5 },
          pathId: 'path-1',
          order: 0,
          triggerAction: { type: 'text', payload: 'Welcome!' },
        },
      ],
      paths: [
        {
          id: 'path-1',
          name: 'Tour',
          waypointIds: ['wp-1'],
        },
      ],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T12:00:00Z',
    };

    const json = toJSON(original);
    const restored = fromJSON(json);

    expect(restored).toEqual(original);
  });
});
