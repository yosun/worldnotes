import { describe, it, expect } from 'vitest';
import type { TreatType, AppMode } from './types';

describe('Core Types', () => {
  it('should allow valid TreatType values', () => {
    const types: TreatType[] = ['custom', 'library', 'waypoint', 'ai-generated', 'message-bottle'];
    expect(types).toHaveLength(5);
  });

  it('should allow valid AppMode values', () => {
    const modes: AppMode[] = ['edit', 'explore'];
    expect(modes).toHaveLength(2);
  });
});
