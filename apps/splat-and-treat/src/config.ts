/**
 * Application configuration for Splat and Treat.
 * Customize worlds, treats, and default settings here.
 */

import type { World, TokenPackage } from '@splat-and-treat/skeleton';

/**
 * Special world IDs for non-standard world cards
 */
export const SPECIAL_WORLD_IDS = {
  EMPTY: 'empty',
  REQUEST: 'request-slartibartfast',
} as const;

/**
 * Email for requesting custom worlds from Slartibartfast
 */
export const SLARTIBARTFAST_EMAIL = 'slartibartfast@magrathea.email';

/**
 * Available worlds for selection.
 * Add your own .spz worlds by adding entries to this array.
 */
export const worlds: World[] = [
  {
    id: 'haunted-mansion',
    name: 'Haunted Mansion',
    thumbnail: '/thumbnails/haunted-mansion.png',
    spzUrl: 'https://example.com/worlds/haunted-mansion.spz',
    description: 'A spooky Victorian mansion with creaky floors and mysterious shadows',
  },
  {
    id: 'pumpkin-patch',
    name: 'Pumpkin Patch',
    thumbnail: '/thumbnails/pumpkin-patch.png',
    spzUrl: 'https://example.com/worlds/pumpkin-patch.spz',
    description: 'A moonlit field of pumpkins ready for Halloween night',
  },
  {
    id: 'graveyard',
    name: 'Spooky Graveyard',
    thumbnail: '/thumbnails/graveyard.png',
    spzUrl: 'https://example.com/worlds/graveyard.spz',
    description: 'An ancient cemetery with fog rolling between the tombstones',
  },
  {
    id: SPECIAL_WORLD_IDS.EMPTY,
    name: 'Create Empty World',
    thumbnail: '/thumbnails/empty.png',
    spzUrl: '',
    description: 'Start with a blank canvas and build your own world',
  },
  {
    id: SPECIAL_WORLD_IDS.REQUEST,
    name: 'Request from Slartibartfast',
    thumbnail: '/thumbnails/slartibartfast.png',
    spzUrl: '',
    description: 'Describe your dream world and our master world-builder will create it for you',
  },
];

/**
 * Default GLB treats available in the library
 */
export const defaultTreats = [
  {
    id: 'message-bottle',
    name: 'Message in a Bottle',
    glbUrl: 'https://s3.amazonaws.com/worldmatica/message_in_a_bottle.glb',
    thumbnail: '/thumbnails/message-bottle.png',
    tags: ['message', 'bottle', 'communication'],
  },
];

/**
 * Default waypoint marker GLB
 */
export const waypointMarkerUrl = 'https://s3.amazonaws.com/worldmatica/geomarker_animated.glb';

/**
 * Token packages available for purchase
 */
export const tokenPackages: TokenPackage[] = [
  {
    id: 'starter',
    tokens: 10,
    priceUsd: 4.99,
    stripePriceId: 'price_starter',
  },
  {
    id: 'standard',
    tokens: 50,
    priceUsd: 19.99,
    stripePriceId: 'price_standard',
  },
  {
    id: 'premium',
    tokens: 150,
    priceUsd: 49.99,
    stripePriceId: 'price_premium',
  },
];

/**
 * AI3D generation cost in tokens
 */
export const AI3D_TOKEN_COST = 5;

/**
 * Maximum text length for treat messages
 */
export const MAX_TEXT_LENGTH = 280;
