# Implementation Plan

## Phase 1: User-Testable MVP (Explore a World)

- [x] 1. Set up monorepo structure and dependencies
  - Initialize pnpm workspace with packages/skeleton and apps/splat-and-treat
  - Configure TypeScript with strict mode for type safety
  - Set up Vite, React 18, Tailwind CSS
  - Install SparkJS, Three.js, Zustand, @aws-sdk/client-s3
  - Install nipplejs for mobile virtual joystick
  - Install fast-check, Vitest for testing
  - Set up ESLint and Prettier for consistent code style
  - Create .env.example with all required environment variables
  - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Create World Selection Screen
  - [x] 2.1 Build world selector UI
    - Grid layout of world thumbnails
    - Parallax preview effect on hover (subtle 3D tilt)
    - "Create Empty World" card option
    - "Request from Slartibartfast" card (mailto:slartibartfast@magrathea.email with world description)
    - _Requirements: 1.1, 1.2, 1.8_
  - [x] 2.2 Implement world data structure
    - Define World interface (id, name, thumbnail, spzUrl, description)
    - Create worlds config with user-provided .spz URLs and thumbnails
    - _Requirements: 1.1_

- [ ] 3. Implement SceneManager and SparkJS integration
  - [ ] 3.1 Create SceneManager class
    - Use SparkJS Viewer class for .spz loading (see SparkJS examples)
    - Leverage SparkJS built-in camera controls
    - Use SparkJS collider initialization for raycasting support
    - Expose Three.js scene from SparkJS for GLB placement
    - _Requirements: 1.3, 1.4, 1.5_
  - [ ] 3.2 Implement error handling for world loading
    - Handle .spz load failures with error messages
    - Provide fallback world options
    - _Requirements: 1.6_

- [ ] 4. Implement FPS Navigation Controller
  - [ ] 4.1 Create NavigationController class
    - Desktop: WASD/arrow keys for movement, mouse drag for look
    - Mobile: Virtual joystick using nipplejs library
    - Mobile: Touch drag for camera look direction
    - Support pinch-to-zoom on mobile
    - Integrate with animation loop for smooth 60fps movement
    - _Requirements: 0.1.1, 0.1.2, 0.1.3, 0.1.4, 0.1.5, 0.1.6_
  - [ ] 4.2 Create mobile joystick overlay
    - Position joystick in bottom-left corner
    - Semi-transparent, non-intrusive design
    - _Requirements: 0.1.3_

- [ ] 5. Wire up basic app flow
  - [ ] 5.1 Create main App component
    - World selector → Scene view transition
    - Initialize SceneManager when world selected
    - Initialize NavigationController
    - _Requirements: 1.1, 1.3_
  - [ ] 5.2 Add back button to return to world selector
    - Clean up scene resources on exit
    - _Requirements: 1.1_

**🎮 CHECKPOINT: User can select a world and explore it with FPS controls!**

## Phase 2: Edit Mode and Treat Placement

- [ ] 6. Implement core types and interfaces
  - [ ] 6.1 Create shared type definitions
    - Define Treat, TreatType, TreatMetadata interfaces with clear JSDoc
    - Define Waypoint, WaypointPath, WaypointAction interfaces
    - Define SceneState, ShareableScene interfaces
    - Define RaycastHit interface
    - Export all types from a central types.ts file
    - _Requirements: 9.3, 9.4_
  - [ ]\* 6.2 Write property test for scene state round-trip
    - **Property 6: Scene state round-trip**
    - **Validates: Requirements 6.3, 6.4**

- [ ] 7. Implement Edit/Explore Mode Manager
  - [ ] 7.1 Create ModeManager
    - 'edit' and 'explore' states
    - Default to Explore mode on load
    - Emit events on mode change for UI updates
    - _Requirements: 0.1, 0.2, 0.3_
  - [ ] 7.2 Create mode toggle UI
    - Visible toggle button in UI corner
    - Show/hide editing panels based on mode
    - _Requirements: 0.4, 0.5, 0.6_

- [ ] 8. Implement RaycastSystem
  - [ ] 8.1 Create RaycastSystem class
    - Use SparkJS built-in raycasting
    - Wrap SparkJS raycast in raycastFromScreen() method
    - Extract hit position and surface normal from SparkJS hit result
    - _Requirements: 2.1, 2.2, 2.3_
  - [ ]\* 8.2 Write property test for treat placement position
    - **Property 1: Treat placement position accuracy**
    - **Validates: Requirements 2.2**
  - [ ]\* 8.3 Write property test for treat orientation
    - **Property 2: Treat orientation matches surface normal**
    - **Validates: Requirements 2.3**

- [ ] 9. Implement TreatManager
  - [ ] 9.1 Create TreatManager class
    - Use Three.js GLTFLoader for GLB loading
    - Implement selectTreat() to load GLB and prepare for placement
    - Implement placeTreat() to instantiate at raycast hit position
    - Use Three.js lookAt() or quaternion for surface normal alignment
    - Implement removeTreat() and getTreat()
    - _Requirements: 2.2, 2.3, 2.4, 3.2_
  - [ ] 9.2 Create basic treat selection panel
    - Custom GLB URL input with text attachment
    - Message in a Bottle preset button (https://s3.amazonaws.com/worldmatica/message_in_a_bottle.glb)
    - _Requirements: 3.1, 3.6_
  - [ ] 9.3 Implement treat click interaction
    - Handle onClick to display attached text messages
    - _Requirements: 3.4_
  - [ ]\* 9.4 Write property test for text metadata storage
    - **Property 4: Text metadata storage**
    - **Validates: Requirements 3.3**
  - [ ]\* 9.5 Write property test for text length constraint
    - **Property 5: Text length constraint**
    - **Validates: Requirements 3.5**

**🎨 CHECKPOINT: User can switch to Edit mode and place treats!**

## Phase 3: Save and Share

- [ ] 10. Implement scene persistence
  - [ ] 10.1 Create SceneSerializer and SceneDeserializer
    - Implement toJSON() for SceneState serialization
    - Implement fromJSON() for SceneState deserialization
    - Handle Vector3 and Euler serialization
    - _Requirements: 6.3, 6.4_
  - [ ]\* 10.2 Write property test for treat persistence
    - **Property 3: Placed treats persist to scene state**
    - **Validates: Requirements 2.4, 6.1**
  - [ ]\* 10.3 Write property test for treat restoration
    - **Property 7: Treat restoration completeness**
    - **Validates: Requirements 6.2**

- [ ] 11. Implement StorageService with S3 (client-side)
  - [ ] 11.1 Set up AWS Cognito Identity Pool
    - Create unauthenticated identity pool for anonymous users
    - Configure IAM role with scoped S3 permissions (scenes/ prefix only)
    - _Requirements: 6.1, 6.2_
  - [ ] 11.2 Create StorageService class using AWS SDK
    - Use @aws-sdk/client-s3 with Cognito credentials provider
    - Implement saveScene() - generate UUID, PutObject to S3
    - Implement loadScene() - GetObject from S3
    - Generate shareable URLs
    - _Requirements: 6.1, 6.2_

- [ ] 12. Create share functionality UI
  - [ ] 12.1 Add share button and modal
    - Save scene button
    - Display shareable link with copy button
    - _Requirements: 6.1, 6.2_
  - [ ] 12.2 Load scene from URL parameter
    - Parse ?scene=uuid from URL
    - Load and restore scene state
    - _Requirements: 6.2_

**🔗 CHECKPOINT: User can save their creation and share a link!**

## Phase 4: Enhanced Features

- [ ] 13. Implement GLB Treat Library
  - [ ] 13.1 Create TreatLibrary component
    - Display searchable grid of available treats
    - Implement search filtering by name and tags
    - Display thumbnails with name and category
    - _Requirements: 4.1, 4.2, 4.4_
  - [ ] 13.2 Implement treat selection from library
    - Load selected GLB and set as active placement object
    - _Requirements: 4.3_
  - [ ]\* 13.3 Write property test for search relevance
    - **Property 8: Library search relevance**
    - **Validates: Requirements 4.2**

- [ ] 14. Implement WaypointManager
  - [ ] 14.1 Create WaypointManager class
    - Implement placeWaypoint() using default geomarker GLB
    - Implement createPath() to link waypoints
    - Store waypoint order in paths
    - _Requirements: 5.1, 5.2, 5.7_
  - [ ] 14.2 Implement path navigation
    - Implement navigatePath() to animate camera along waypoints
    - Display visual indicators for connections
    - Support multiple named paths
    - _Requirements: 5.3, 5.4, 5.6_
  - [ ] 14.3 Create waypoint panel UI
    - Waypoint placement mode toggle
    - Path creation and naming
    - Navigation controls
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]\* 14.4 Write property test for path ordering
    - **Property 9: Path ordering preservation**
    - **Validates: Requirements 5.2**
  - [ ]\* 14.5 Write property test for multiple paths
    - **Property 10: Multiple paths coexistence**
    - **Validates: Requirements 5.6**

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Monetization (Stripe + AI3D)

- [ ] 16. Implement PaymentService with Stripe
  - [ ] 16.1 Create PaymentService class
    - Implement getPackages() to return token packages
    - Use Stripe.js client-side for checkout
    - Store token balance in localStorage
    - _Requirements: 7.1, 7.2, 7.5_
  - [ ] 16.2 Implement Stripe Checkout flow
    - Redirect to Stripe-hosted checkout page
    - Handle success/cancel redirects to update local balance
    - _Requirements: 7.2, 7.3, 7.4_
  - [ ] 16.3 Create token balance UI
    - Display current token balance in header
    - Token purchase button
    - _Requirements: 7.5_
  - [ ]\* 16.4 Write property test for payment success
    - **Property 11: Payment success increases balance**
    - **Validates: Requirements 7.3**
  - [ ]\* 16.5 Write property test for payment failure
    - **Property 12: Payment failure preserves balance**
    - **Validates: Requirements 7.4**

- [ ] 17. Implement AI3DService
  - [ ] 17.1 Create AI3DService class
    - Implement generate() - mock/placeholder or free tier API
    - Deduct tokens from localStorage balance
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  - [ ] 17.2 Create AI3D generation UI
    - Text prompt input
    - Loading state during generation
    - Add generated GLB to treat inventory
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]\* 17.3 Write property test for AI3D token deduction
    - **Property 13: AI3D deducts exactly 5 tokens**
    - **Validates: Requirements 8.2**
  - [ ]\* 17.4 Write property test for insufficient balance
    - **Property 14: Insufficient balance blocks AI3D**
    - **Validates: Requirements 8.4**
  - [ ]\* 17.5 Write property test for failed generation refund
    - **Property 15: Failed AI3D refunds tokens**
    - **Validates: Requirements 8.5**

## Phase 6: Second App + Polish

- [ ] 18. Build Application B: Second Demo App
  - [ ] 18.1 Create second application using skeleton
    - Choose theme (virtual gallery, product placement, or educational)
    - Customize config.ts for different world and treats
    - Demonstrate skeleton flexibility
    - _Requirements: 10.1, 10.2, 10.3_
  - [ ] 18.2 Document customization points
    - List which skeleton components were reused
    - Document configuration differences
    - _Requirements: 10.4_

- [ ] 19. Final polish and documentation
  - [ ] 19.1 Code quality and clarity
    - Keep functions small and single-purpose
    - Use descriptive variable and function names
    - Add JSDoc comments for all public APIs
    - Include inline comments explaining "why" for non-obvious code
    - _Requirements: 9.4_
  - [ ] 19.2 Create comprehensive README
    - Project overview and motivation
    - Quick start guide (clone, install, run)
    - Architecture diagram and explanation
    - How to customize for your own use case
    - Environment variables and AWS setup guide
    - Contributing guidelines, MIT License
    - _Requirements: 9.5, 10.4_
  - [ ] 19.3 Add code examples
    - Example: Adding a new treat type
    - Example: Creating a custom world
    - Example: Extending the skeleton for a new app
    - _Requirements: 9.5, 10.4_
  - [ ] 19.4 Polish .kiro/specs documentation
    - Ensure requirements.md is up-to-date with final implementation
    - Update design.md with any architecture changes
    - Add "How We Built This" section to README linking to specs
    - _Requirements: 9.4, 10.4_

- [ ] 20. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

---

## Phase 7: Advanced Features (Stretch Goals - After Core Complete)

- [ ] 21. Implement Vibe Code Custom Behaviors
  - [ ] 21.1 Create behavior code editor
    - Code input field with syntax highlighting
    - Validation for safe execution (no network, no infinite loops)
    - _Requirements: 11.1, 11.2_
  - [ ] 21.2 Implement sandboxed code execution
    - Execute behavior code in isolated context
    - Support triggers: onClick, onHover, onProximity, onTimer, onCollision
    - _Requirements: 11.3, 11.4, 11.5_
  - [ ] 21.3 Create behavior templates
    - Spin, bounce, glow, play sound presets
    - _Requirements: 11.6_

- [ ] 22. Implement Inter-Object Communication
  - [ ] 22.1 Add object ID assignment
    - Unique IDs for treats
    - Event emit/broadcast API
    - _Requirements: 12.1, 12.2, 12.3_
  - [ ] 22.2 Implement chain reactions
    - Physics-based collision triggers
    - Cascading event chains
    - _Requirements: 12.4, 12.5_
  - [ ] 22.3 Create Rube Goldberg templates
    - Domino effect, ball drop, lever activation
    - _Requirements: 12.6_

- [ ] 23. Implement Hacker-Creator Mode (LLM Vibe Engine)
  - [ ] 23.1 Create scene graph serializer for LLM
    - Serialize complete scene state
    - Include engine API documentation
    - _Requirements: 13.1, 13.5_
  - [ ] 23.2 Implement LLM integration
    - Send scene + prompt to LLM
    - Display code preview before execution
    - _Requirements: 13.2, 13.3_
  - [ ] 23.3 Implement undo and rollback
    - One-click undo for LLM changes
    - Auto-rollback on errors
    - _Requirements: 13.6, 13.7_
  - [ ] 23.4 Add token cost for LLM prompts
    - Deduct 2 tokens per prompt
    - _Requirements: 13.8_
