/**
 * World Selection Screen Component
 * Displays a grid of available worlds with parallax hover effects.
 * Requirements: 1.1, 1.2, 1.8
 */

import { useState, useCallback, type MouseEvent } from 'react';
import type { World } from '@splat-and-treat/skeleton';
import { worlds, SPECIAL_WORLD_IDS, SLARTIBARTFAST_EMAIL } from '../config';

interface WorldCardProps {
  world: World;
  onSelect: (world: World) => void;
}

/**
 * Individual world card with parallax tilt effect on hover
 */
function WorldCard({ world, onSelect }: WorldCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate tilt angles (max 10 degrees)
    const tiltX = ((y - centerY) / centerY) * -10;
    const tiltY = ((x - centerX) / centerX) * 10;

    setTilt({ x: tiltX, y: tiltY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleClick = useCallback(() => {
    // Handle special world types
    if (world.id === SPECIAL_WORLD_IDS.REQUEST) {
      const subject = encodeURIComponent('Custom World Request');
      const body = encodeURIComponent(
        'Hello Slartibartfast,\n\nI would like to request a custom world with the following description:\n\n[Describe your dream world here]\n\nThank you!'
      );
      window.location.href = `mailto:${SLARTIBARTFAST_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }
    onSelect(world);
  }, [world, onSelect]);

  const isSpecialCard =
    world.id === SPECIAL_WORLD_IDS.EMPTY || world.id === SPECIAL_WORLD_IDS.REQUEST;

  return (
    <div
      className="relative cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'none' : 'transform 0.3s ease-out',
      }}
    >
      <div
        className={`
          relative overflow-hidden rounded-xl border-2 
          ${isSpecialCard ? 'border-halloween-purple border-dashed' : 'border-halloween-orange/30'}
          ${isHovered ? 'border-halloween-orange shadow-lg shadow-halloween-orange/20' : ''}
          bg-halloween-black/80 backdrop-blur-sm
          transition-colors duration-200
        `}
      >
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-halloween-purple/20 to-halloween-black overflow-hidden">
          {world.thumbnail && !isSpecialCard ? (
            <img
              src={world.thumbnail}
              alt={world.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient on image load error
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {world.id === SPECIAL_WORLD_IDS.EMPTY && (
                <span className="text-6xl">✨</span>
              )}
              {world.id === SPECIAL_WORLD_IDS.REQUEST && (
                <span className="text-6xl">🌍</span>
              )}
              {!isSpecialCard && <span className="text-6xl">🎃</span>}
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={`
              absolute inset-0 bg-gradient-to-t from-halloween-black via-transparent to-transparent
              transition-opacity duration-200
              ${isHovered ? 'opacity-80' : 'opacity-60'}
            `}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-halloween-orange mb-1">{world.name}</h3>
          <p className="text-sm text-gray-400 line-clamp-2">{world.description}</p>
        </div>

        {/* Hover shine effect */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255, 107, 0, 0.1) 0%, transparent 50%)`,
            }}
          />
        )}
      </div>
    </div>
  );
}


interface WorldSelectorProps {
  onWorldSelect: (world: World) => void;
}

/**
 * World Selection Screen
 * Displays a grid of available worlds with parallax hover effects.
 */
export function WorldSelector({ onWorldSelect }: WorldSelectorProps) {
  // Separate regular worlds from special cards
  const regularWorlds = worlds.filter(
    (w) => w.id !== SPECIAL_WORLD_IDS.EMPTY && w.id !== SPECIAL_WORLD_IDS.REQUEST
  );
  const emptyWorld = worlds.find((w) => w.id === SPECIAL_WORLD_IDS.EMPTY);
  const requestWorld = worlds.find((w) => w.id === SPECIAL_WORLD_IDS.REQUEST);

  return (
    <div className="min-h-screen bg-halloween-black p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-halloween-orange mb-4">
          🎃 Splat and Treat 🎃
        </h1>
        <p className="text-xl text-gray-400">
          Choose a world to explore and decorate with treats!
        </p>
      </div>

      {/* World Grid */}
      <div className="max-w-6xl mx-auto">
        {/* Regular worlds */}
        {regularWorlds.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-white mb-6">Available Worlds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {regularWorlds.map((world) => (
                <WorldCard key={world.id} world={world} onSelect={onWorldSelect} />
              ))}
            </div>
          </>
        )}

        {/* Special options */}
        <h2 className="text-2xl font-semibold text-white mb-6">Create Your Own</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {emptyWorld && <WorldCard world={emptyWorld} onSelect={onWorldSelect} />}
          {requestWorld && <WorldCard world={requestWorld} onSelect={onWorldSelect} />}
        </div>
      </div>

      {/* Footer hint */}
      <div className="text-center mt-12 text-gray-500 text-sm">
        <p>Hover over a world to preview • Click to enter</p>
      </div>
    </div>
  );
}

export default WorldSelector;
