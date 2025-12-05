import { describe, it, expect, vi } from 'vitest';
import { createModeManager } from './ModeManager';

describe('ModeManager', () => {
  it('defaults to explore mode', () => {
    const manager = createModeManager();
    expect(manager.getMode()).toBe('explore');
    expect(manager.isExploreMode()).toBe(true);
    expect(manager.isEditMode()).toBe(false);
  });

  it('can set mode to edit', () => {
    const manager = createModeManager();
    manager.setMode('edit');
    expect(manager.getMode()).toBe('edit');
    expect(manager.isEditMode()).toBe(true);
    expect(manager.isExploreMode()).toBe(false);
  });

  it('can toggle between modes', () => {
    const manager = createModeManager();
    expect(manager.getMode()).toBe('explore');

    manager.toggle();
    expect(manager.getMode()).toBe('edit');

    manager.toggle();
    expect(manager.getMode()).toBe('explore');
  });

  it('emits events on mode change via setMode', () => {
    const manager = createModeManager();
    const callback = vi.fn();

    manager.onModeChange(callback);
    manager.setMode('edit');

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('edit');
  });

  it('emits events on mode change via toggle', () => {
    const manager = createModeManager();
    const callback = vi.fn();

    manager.onModeChange(callback);
    manager.toggle();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('edit');
  });

  it('does not emit event when setting same mode', () => {
    const manager = createModeManager();
    const callback = vi.fn();

    manager.onModeChange(callback);
    manager.setMode('explore'); // Already in explore mode

    expect(callback).not.toHaveBeenCalled();
  });

  it('supports multiple listeners', () => {
    const manager = createModeManager();
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    manager.onModeChange(callback1);
    manager.onModeChange(callback2);
    manager.setMode('edit');

    expect(callback1).toHaveBeenCalledWith('edit');
    expect(callback2).toHaveBeenCalledWith('edit');
  });

  it('can unsubscribe from mode changes', () => {
    const manager = createModeManager();
    const callback = vi.fn();

    const unsubscribe = manager.onModeChange(callback);
    manager.setMode('edit');
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    manager.setMode('explore');
    expect(callback).toHaveBeenCalledTimes(1); // Still 1, not called again
  });

  it('handles callback errors gracefully', () => {
    const manager = createModeManager();
    const errorCallback = vi.fn(() => {
      throw new Error('Test error');
    });
    const normalCallback = vi.fn();

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    manager.onModeChange(errorCallback);
    manager.onModeChange(normalCallback);

    // Should not throw, and should still call other callbacks
    expect(() => manager.setMode('edit')).not.toThrow();
    expect(normalCallback).toHaveBeenCalledWith('edit');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
