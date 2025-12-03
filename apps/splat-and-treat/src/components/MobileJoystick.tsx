/**
 * MobileJoystick Component - Virtual joystick for mobile navigation
 * 
 * Uses nipplejs library to create a semi-transparent joystick
 * positioned in the bottom-left corner for mobile FPS movement.
 * 
 * Requirements: 0.1.3
 */

import { useEffect, useRef, useCallback } from 'react';
import nipplejs, { type JoystickManager, type JoystickOutputData } from 'nipplejs';

interface MobileJoystickProps {
  /** Callback when joystick moves, provides normalized x,y values (-1 to 1) */
  onMove: (x: number, y: number) => void;
  /** Whether the joystick is enabled */
  enabled?: boolean;
}

/**
 * MobileJoystick - Virtual joystick overlay for mobile devices
 * 
 * Positioned in the bottom-left corner with semi-transparent styling.
 * Only renders on touch-capable devices.
 */
export function MobileJoystick({ onMove, enabled = true }: MobileJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<JoystickManager | null>(null);
  const onMoveRef = useRef(onMove);
  
  // Keep onMove ref updated
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  // Handle joystick move event
  const handleMove = useCallback((_evt: unknown, data: JoystickOutputData) => {
    if (!enabled) return;
    
    // Normalize the vector to -1 to 1 range
    const x = data.vector?.x ?? 0;
    const y = data.vector?.y ?? 0;
    
    onMoveRef.current(x, y);
  }, [enabled]);

  // Handle joystick end event
  const handleEnd = useCallback(() => {
    onMoveRef.current(0, 0);
  }, []);

  // Initialize nipplejs
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create joystick
    const joystick = nipplejs.create({
      zone: container,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120,
      restOpacity: 0.5,
      fadeTime: 100,
    });

    joystickRef.current = joystick;

    // Attach event listeners
    joystick.on('move', handleMove);
    joystick.on('end', handleEnd);

    return () => {
      joystick.off('move', handleMove);
      joystick.off('end', handleEnd);
      joystick.destroy();
      joystickRef.current = null;
    };
  }, [handleMove, handleEnd]);

  // Check if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Don't render on non-touch devices
  if (!isTouchDevice) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute bottom-8 left-8 z-30 w-32 h-32 rounded-full"
      style={{
        // Semi-transparent background
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        // Prevent text selection
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // Prevent touch callout on iOS
        WebkitTouchCallout: 'none',
        // Ensure touch events work
        touchAction: 'none',
      }}
      aria-label="Movement joystick"
      role="application"
    />
  );
}

export default MobileJoystick;
