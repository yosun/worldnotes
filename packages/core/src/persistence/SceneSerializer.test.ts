/**
 * Unit tests for SceneSerializer and SceneDeserializer
 */

import { describe, it, expect } from 'vitest';
import {
  serializeScene,
  serializeSceneToObject,
  serializeVector3,
  serializeTreat,
  CURRENT_VERSION,
} from './SceneSerializer';
import {
  deserializeScene,
  deserializeSceneFromObject,
  deserializeVector3,
  deserializeTreat,
  migrateScene,
} from './SceneDeserializer';
import type { SceneState, Treat, Vector3 } from '../types';

describe('SceneSerializer', () => {
  describe('serializeVector3', () => {
    it('should serialize Vector3 to plain object', () => {
      const vec: Vector3 = { x: 1.5, y: 2.5, z: 3.5 };
      const result = serializeVector3(vec);
      expect(result).toEqual({ x: 1.5, y: 2.5, z: 3.5 });
    });

    it('should handle negative values', () => {
      const vec: Vector3 = { x: -1.5, y: -2.5, z: -3.5 };
      const result = serializeVector3(vec);
      expect(result).toEqual({ x: -1.5, y: -2.5, z: -3.5 });
    });
  });

  describe('serializeTreat', () => {
    it('should serialize treat with all fields', () => {
      const treat: Treat = {
        id: 'treat-1',
        type: 'bottle',
        glbUrl: 'https://example.com/bottle.glb',
        message: 'Hello World',
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0, y: 1.57, z: 0 },
        createdAt: '2025-12-05T10:00:00Z',
        updatedAt: '2025-12-05T11:00:00Z',
      };
      const result = serializeTreat(treat);
      expect(result.id).toBe('treat-1');
      expect(result.type).toBe('bottle');
      expect(result.message).toBe('Hello World');
      expect(result.createdAt).toBe('2025-12-05T10:00:00Z');
    });

    it('should omit undefined optional fields', () => {
      const treat: Treat = {
        id: 'treat-1',
        type: 'geomarker',
        glbUrl: 'https://example.com/pin.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      };
      const result = serializeTreat(treat);
      expect(result.message).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });
  });

  describe('serializeScene', () => {
    it('should serialize complete SceneState to JSON string', () => {
      const state: SceneState = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        worldFlipY: true,
        treats: [
          {
            id: 'treat-1',
            type: 'bottle',
            glbUrl: 'https://example.com/bottle.glb',
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
          },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const json = serializeScene(state);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.worldUrl).toBe('https://example.com/world.spz');
      expect(parsed.worldFlipY).toBe(true);
      expect(parsed.treats).toHaveLength(1);
      expect(parsed.treats[0].id).toBe('treat-1');
    });

    it('should omit undefined worldFlipY', () => {
      const state: SceneState = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const json = serializeScene(state);
      const parsed = JSON.parse(json);

      expect(parsed.worldFlipY).toBeUndefined();
    });
  });

  describe('serializeSceneToObject', () => {
    it('should serialize SceneState to plain object', () => {
      const state: SceneState = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const obj = serializeSceneToObject(state);

      expect(obj.version).toBe(1);
      expect(obj.worldUrl).toBe('https://example.com/world.spz');
      expect(obj.treats).toEqual([]);
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
      const data = {
        x: '1.5' as unknown as number,
        y: '2.5' as unknown as number,
        z: '3.5' as unknown as number,
      };
      const result = deserializeVector3(data);
      expect(result).toEqual({ x: 1.5, y: 2.5, z: 3.5 });
    });
  });

  describe('deserializeTreat', () => {
    it('should deserialize treat with all fields', () => {
      const data = {
        id: 'treat-1',
        type: 'bottle',
        glbUrl: 'https://example.com/bottle.glb',
        message: 'Hello',
        position: { x: 1, y: 2, z: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };
      const result = deserializeTreat(data);
      expect(result.id).toBe('treat-1');
      expect(result.type).toBe('bottle');
      expect(result.message).toBe('Hello');
    });

    it('should handle missing optional fields', () => {
      const data = {
        id: 'treat-1',
        type: 'geomarker',
        glbUrl: 'https://example.com/pin.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      };
      const result = deserializeTreat(data);
      expect(result.message).toBeUndefined();
      expect(result.createdAt).toBeUndefined();
    });

    it('should allow custom treat types', () => {
      const data = {
        id: 'treat-1',
        type: 'my-custom-type',
        glbUrl: 'https://example.com/custom.glb',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
      };
      const result = deserializeTreat(data);
      expect(result.type).toBe('my-custom-type');
    });
  });

  describe('deserializeScene', () => {
    it('should deserialize JSON string to SceneState', () => {
      const json = JSON.stringify({
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        worldFlipY: true,
        treats: [
          {
            id: 'treat-1',
            type: 'bottle',
            glbUrl: 'https://example.com/bottle.glb',
            position: { x: 1, y: 2, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
          },
        ],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      });

      const state = deserializeScene(json);

      expect(state.version).toBe(1);
      expect(state.worldUrl).toBe('https://example.com/world.spz');
      expect(state.worldFlipY).toBe(true);
      expect(state.treats).toHaveLength(1);
    });

    it('should throw on invalid JSON', () => {
      expect(() => deserializeScene('not valid json')).toThrow();
    });
  });

  describe('deserializeSceneFromObject', () => {
    it('should handle missing optional fields', () => {
      const data = {
        version: 1,
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const state = deserializeSceneFromObject(data);

      expect(state.treats).toEqual([]);
      expect(state.worldFlipY).toBeUndefined();
    });

    it('should throw when worldUrl is missing', () => {
      const data = {
        version: 1,
        treats: [],
      } as unknown as Parameters<typeof deserializeSceneFromObject>[0];

      expect(() => deserializeSceneFromObject(data)).toThrow(
        'SceneState missing required field: worldUrl'
      );
    });

    it('should default version to CURRENT_VERSION if missing', () => {
      const data = {
        worldUrl: 'https://example.com/world.spz',
        treats: [],
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      } as unknown as Parameters<typeof deserializeSceneFromObject>[0];

      const state = deserializeSceneFromObject(data);
      expect(state.version).toBe(CURRENT_VERSION);
    });
  });
});

describe('migrateScene', () => {
  it('should return same state if already at target version', () => {
    const state: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const migrated = migrateScene(state, 1);
    expect(migrated.version).toBe(1);
  });

  it('should throw when trying to downgrade version', () => {
    const state: SceneState = {
      version: 2,
      worldUrl: 'https://example.com/world.spz',
      treats: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    expect(() => migrateScene(state, 1)).toThrow(
      'Cannot migrate scene from version 2 to lower version 1'
    );
  });

  it('should preserve treats during migration', () => {
    const state: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [
        {
          id: 'treat-1',
          type: 'bottle',
          glbUrl: 'https://example.com/bottle.glb',
          message: 'Hello',
          position: { x: 1, y: 2, z: 3 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const migrated = migrateScene(state, 2);
    expect(migrated.version).toBe(2);
    expect(migrated.treats).toHaveLength(1);
    expect(migrated.treats[0].message).toBe('Hello');
  });

  it('should not mutate original state', () => {
    const state: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [
        {
          id: 'treat-1',
          type: 'bottle',
          glbUrl: 'https://example.com/bottle.glb',
          position: { x: 1, y: 2, z: 3 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      ],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const migrated = migrateScene(state, 2);
    expect(state.version).toBe(1);
    expect(migrated.version).toBe(2);
  });
});

describe('Round-trip serialization', () => {
  it('should preserve SceneState through serialize/deserialize cycle', () => {
    const original: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      worldFlipY: true,
      treats: [
        {
          id: 'treat-1',
          type: 'bottle',
          glbUrl: 'https://s3.amazonaws.com/worldmatica/message_in_a_bottle.glb',
          message: 'Hello world!',
          position: { x: 10.5, y: -2.3, z: 7.8 },
          rotation: { x: 0.1, y: 0.2, z: 0.3 },
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-02T12:00:00Z',
        },
      ],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T12:00:00Z',
    };

    const json = serializeScene(original);
    const restored = deserializeScene(json);

    expect(restored).toEqual(original);
  });

  it('should preserve worldFlipY=false through serialize/deserialize cycle', () => {
    const original: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      worldFlipY: false,
      treats: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const json = serializeScene(original);
    const restored = deserializeScene(json);

    expect(restored.worldFlipY).toBe(false);
  });

  it('should handle undefined worldFlipY', () => {
    const original: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const json = serializeScene(original);
    const restored = deserializeScene(json);

    expect(restored.worldFlipY).toBeUndefined();
  });

  it('should preserve multiple treats', () => {
    const original: SceneState = {
      version: 1,
      worldUrl: 'https://example.com/world.spz',
      treats: [
        {
          id: 'treat-1',
          type: 'geomarker',
          glbUrl: 'https://example.com/pin.glb',
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
        },
        {
          id: 'treat-2',
          type: 'bottle',
          glbUrl: 'https://example.com/bottle.glb',
          message: 'Secret message',
          position: { x: 5, y: 1, z: -3 },
          rotation: { x: 0, y: 3.14, z: 0 },
        },
        {
          id: 'treat-3',
          type: 'custom',
          glbUrl: 'https://example.com/custom.glb',
          position: { x: -10, y: 0, z: 10 },
          rotation: { x: 0.5, y: 0.5, z: 0.5 },
        },
      ],
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
    };

    const json = serializeScene(original);
    const restored = deserializeScene(json);

    expect(restored.treats).toHaveLength(3);
    expect(restored.treats[0].type).toBe('geomarker');
    expect(restored.treats[1].message).toBe('Secret message');
    expect(restored.treats[2].type).toBe('custom');
  });
});
