import { describe, it, expect } from 'vitest';
import type { Vector3, Treat, TreatType } from './types';

describe('Core Types', () => {
  it('should allow creating a valid Vector3', () => {
    const vec: Vector3 = { x: 1, y: 2, z: 3 };
    expect(vec.x).toBe(1);
    expect(vec.y).toBe(2);
    expect(vec.z).toBe(3);
  });

  it('should allow creating a valid Treat', () => {
    const treat: Treat = {
      id: 'test-id',
      type: 'bottle',
      glbUrl: 'https://example.com/bottle.glb',
      message: 'Hello World',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    };
    expect(treat.id).toBe('test-id');
    expect(treat.type).toBe('bottle');
  });

  it('should support custom treat types', () => {
    const customType: TreatType = 'my-custom-type';
    expect(customType).toBe('my-custom-type');
  });
});
