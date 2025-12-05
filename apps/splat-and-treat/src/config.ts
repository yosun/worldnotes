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
 * 
 * To add a real world:
 * 1. Host your .spz file somewhere accessible (S3, CDN, etc.)
 * 2. Add an entry with the spzUrl pointing to your file
 * 3. Optionally add a thumbnail image
 * 
 * Example SPZ files from SparkJS demos:
 * - https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-mini.spz
 * - https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bicycle/bicycle-7k-mini.spz
 */
export const worlds: World[] = [
 
  {
    id: 'scary_tree_stage_cobwebs',
    name: 'Gnarly Fainting Fright',
    thumbnail: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/scary_tree_stage_cobwebs.png',
    spzUrl: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/scary_tree_stage_cobwebs.spz',
    description: 'A Scary Tree with Cobwebs all over Vintage Fainting Lounger Couches',
    startPosition: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
    },
  },{
    id: 'Shining-inspired-hotel',
    name: 'Scary Hotel Lobby',
    thumbnail: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/Shining-inspired-hotel.png',
    spzUrl: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/Shining-inspired-hotel.spz',
    description: 'A Shining-inspired hotel ... or does it feel like a corporate hotel that really needs a refresh?',
    startPosition: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
    },
  },{
    id: 'haunted-theatre-stage',
    name: 'Haunted Theatre Stage',
    thumbnail: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/haunted-theatre-stage.png',
    spzUrl: 'https://s3.amazonaws.com/worldmatica/splat_n_treat/haunted-theatre-stage.spz',
    description: 'Angels and Minsters of Grace, Defend us! Behold - thy haunted theatre stage!',
    startPosition: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
    },
  } ,
  {
    id: SPECIAL_WORLD_IDS.EMPTY,
    name: 'Create Empty World',
    thumbnail: '',
    spzUrl: '',
    description: 'Start with a blank canvas and build your own world',
  },
  {
    id: SPECIAL_WORLD_IDS.REQUEST,
    name: 'Request from Slartibartfast',
    thumbnail: '',
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
