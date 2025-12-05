# Splat and Treat - Product Overview

## What It Is
Splat and Treat is a 3D world exploration and decoration application that combines Gaussian Splatting (SPZ) environments with GLB object placement. Users select a 3D splat world and place "treats" (3D objects) within it.

## Core Concept
- **Splat Worlds**: 3D environments rendered using SparkJS Gaussian splatting (.spz files)
- **Treats**: GLB 3D objects users can place in worlds (library items, AI-generated, or message bottles)
- **Skeleton Framework**: Reusable foundation code for combining .spz and .glb in various applications

## Key Features
- World selection with parallax hover effects
- FPS-style navigation (WASD + mouse look, mobile joystick)
- Empty world creation for blank canvas experiences
- Token-based economy for AI-generated 3D objects (Stripe integration planned)
- Scene persistence and sharing capabilities

## Design Philosophy
Keep the codebase elegant and clean for human editability. This is a skeletal code template meant to be versatile for many different 3D use cases combining splat environments with GLB objects.
