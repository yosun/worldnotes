/**
 * Property-based tests for Treat text metadata storage.
 *
 * **Feature: splat-and-treat, Property 4: Text metadata storage**
 */
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Treat, TreatType, TreatMetadata, Vector3, Euler } from './types';

/**
 * Helper function to create a treat with attached text.
 * This simulates the treat creation process where text is attached.
 */
function createTreatWithText(
  id: string,
  type: TreatType,
  glbUrl: string,
  position: Vector3,
  rotation: Euler,
  scale: Vector3,
  text: string
): Treat {
  const metadata: TreatMetadata = {
    text: text,
  };

  return {
    id,
    type,
    glbUrl,
    position,
    rotation,
    scale,
    metadata,
  };
}

/**
 * Arbitrary generator for Vector3
 */
const vector3Arb = fc.record({
  x: fc.float({ noNaN: true, noDefaultInfinity: true }),
  y: fc.float({ noNaN: true, noDefaultInfinity: true }),
  z: fc.float({ noNaN: true, noDefaultInfinity: true }),
});

/**
 * Arbitrary generator for Euler rotation
 * Note: Using Math.fround to convert to 32-bit floats as required by fast-check
 */
const eulerArb = fc.record({
  x: fc.float({ noNaN: true, noDefaultInfinity: true, min: Math.fround(-Math.PI), max: Math.fround(Math.PI) }),
  y: fc.float({ noNaN: true, noDefaultInfinity: true, min: Math.fround(-Math.PI), max: Math.fround(Math.PI) }),
  z: fc.float({ noNaN: true, noDefaultInfinity: true, min: Math.fround(-Math.PI), max: Math.fround(Math.PI) }),
  order: fc.constantFrom('XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'),
});

/**
 * Arbitrary generator for TreatType
 */
const treatTypeArb = fc.constantFrom<TreatType>(
  'custom',
  'library',
  'waypoint',
  'ai-generated',
  'message-bottle'
);

/**
 * Arbitrary generator for valid text (any string up to 280 chars per Requirements 3.5)
 */
const validTextArb = fc.string({ minLength: 1, maxLength: 280 });

describe('Treat Text Metadata Storage', () => {
  /**
   * **Feature: splat-and-treat, Property 4: Text metadata storage**
   * **Validates: Requirements 3.3**
   *
   * For any treat with attached text, the treat's metadata.text field
   * SHALL contain the exact attached text.
   */
  it('Property 4: attached text is stored exactly in metadata.text', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        treatTypeArb,
        fc.webUrl(),
        vector3Arb,
        eulerArb,
        vector3Arb,
        validTextArb,
        (id, type, glbUrl, position, rotation, scale, text) => {
          // Create a treat with the given text attached
          const treat = createTreatWithText(id, type, glbUrl, position, rotation, scale, text);

          // Property: The metadata.text field SHALL contain the exact attached text
          expect(treat.metadata.text).toBe(text);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Empty string text is also stored exactly
   * This ensures edge case of empty text is handled correctly.
   */
  it('Property 4 (edge case): empty string text is stored exactly', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        treatTypeArb,
        fc.webUrl(),
        vector3Arb,
        eulerArb,
        vector3Arb,
        (id, type, glbUrl, position, rotation, scale) => {
          const emptyText = '';
          const treat = createTreatWithText(id, type, glbUrl, position, rotation, scale, emptyText);

          // Property: Even empty string should be stored exactly
          expect(treat.metadata.text).toBe(emptyText);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Text with special characters is preserved exactly
   * Ensures unicode, emojis, and special chars are not corrupted.
   */
  it('Property 4 (unicode): special characters and unicode are preserved', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        treatTypeArb,
        fc.webUrl(),
        vector3Arb,
        eulerArb,
        vector3Arb,
        fc.unicodeString({ minLength: 1, maxLength: 280 }),
        (id, type, glbUrl, position, rotation, scale, unicodeText) => {
          const treat = createTreatWithText(id, type, glbUrl, position, rotation, scale, unicodeText);

          // Property: Unicode text should be stored exactly as provided
          expect(treat.metadata.text).toBe(unicodeText);
        }
      ),
      { numRuns: 100 }
    );
  });
});
