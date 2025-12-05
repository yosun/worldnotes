# Implementation Plan

## Phase 1: Core Module Foundation

- [x] 1. Set up project structure for core/editor/viewer split
  - [x] 1.1 Create core/ directory with package.json and TypeScript config
    - Initialize as @worldnotes/core package
    - Configure TypeScript strict mode
    - Set up Vitest and fast-check for testing
    - _Requirements: 9.1, 9.3_
  - [x] 1.2 Create editor/ directory with Vite config
    - Set up vanilla JS + importmap approach for SparkJS compatibility
    - Configure build output to dist/editor
    - _Requirements: 8.1, 8.2_
  - [x] 1.3 Create viewer/ directory with Vite config
    - Set up vanilla JS + importmap approach
    - Configure build output to dist/viewer
    - _Requirements: 8.1, 8.3_
  - [x] 1.4 Create ARCHITECTURE.md documenting the structure
    - Document core/editor/viewer separation
    - Explain shared module approach
    - _Requirements: 9.2_

- [-] 2. Define core types and interfaces
  - [x] 2.1 Create types.ts with all interfaces
    - Define Vector3, CameraPose, TreatData, Treat, TreatType
    - Define SceneState, ShareableScene, WorldNotesConfig, WorldHandle
    - Define StorageConfig, AppMode
    - Include JSDoc documentation for all types
    - _Requirements: 2.1, 2.2, 2.3, 1.1_
  - [ ]\* 2.2 Write property test for treat serialization round-trip
    - **Property 3: Treat serialization round-trip**
    - **Validates: Requirements 2.4, 2.5**

- [x] 3. Implement SceneSerializer and SceneDeserializer
  - [x] 3.1 Create SceneSerializer with serializeScene()
    - Serialize SceneState to JSON string
    - Handle Vector3 and rotation serialization
    - Include version field in output
    - _Requirements: 10.1, 10.3_
  - [x] 3.2 Create SceneDeserializer with deserializeScene()
    - Parse JSON to SceneState
    - Validate required fields
    - Handle missing optional fields gracefully
    - _Requirements: 10.2_
  - [x] 3.3 Implement migrateScene() for version upgrades
    - Support migration from version 1 to current
    - Preserve all treat data during migration
    - _Requirements: 10.4_
  - [ ]\* 3.4 Write property test for scene state round-trip
    - **Property 7: Scene state round-trip with versioning**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Core API Implementation

- [ ] 5. Implement WorldNotesCore initWorld()
  - [ ] 5.1 Create WorldNotesCore.ts with initWorld function
    - Accept WorldNotesConfig parameter
    - Initialize SparkJS viewer with container and worldUrl
    - Return WorldHandle with all required methods
    - _Requirements: 1.1, 1.6_
  - [ ] 5.2 Implement treat management methods
    - addTreat() - create treat and add to scene
    - updateTreat() - update treat properties
    - removeTreat() - remove treat from scene
    - getTreats() - return all treats
    - getTreat() - return single treat by ID
    - _Requirements: 1.2_
  - [ ] 5.3 Implement camera control methods
    - setCameraPose() - set camera position and rotation
    - getCameraPose() - get current camera pose
    - _Requirements: 1.3_
  - [ ] 5.4 Implement scene state methods
    - getSceneState() - return current SceneState
    - loadSceneState() - load treats from SceneState
    - _Requirements: 1.1_
  - [ ] 5.5 Implement event registration
    - onTreatClicked() - register treat click handler
    - onMessageZoneEntered() - register proximity handler
    - onModeChange() - register mode change handler
    - _Requirements: 1.4_
  - [ ]\* 5.6 Write property test for core API completeness
    - **Property 1: Core API completeness**
    - **Validates: Requirements 1.1, 1.2, 1.6**
  - [ ]\* 5.7 Write property test for camera pose round-trip
    - **Property 2: Camera pose round-trip**
    - **Validates: Requirements 1.3**

- [ ] 6. Implement InputController
  - [ ] 6.1 Create InputController.ts
    - Handle WASD/arrow key movement
    - Handle mouse look (drag or pointer lock)
    - Handle ESC to toggle cursor/look mode
    - Support mobile touch for look direction
    - _Requirements: 6.1, 6.2_
  - [ ] 6.2 Implement mode-dependent input handling
    - In explore mode: movement, look, E/click for messages
    - In edit mode: movement, look, click to place, drag to move
    - _Requirements: 6.3, 6.4, 6.5_
  - [ ]\* 6.3 Write property test for input controls by mode
    - **Property 6: Input controls by mode**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 7. Implement StorageClient
  - [ ] 7.1 Create StorageClient.ts with S3 + Cognito integration
    - Use @aws-sdk/client-s3 with Cognito credentials
    - Implement saveScene() - save to S3, return ShareableScene
    - Implement loadScene() - load from S3 by scene ID
    - Implement getShareUrl() - generate URL without saving
    - _Requirements: 4.2, 5.3_
  - [ ]\* 7.2 Write property test for share URL generation
    - **Property 4: Share URL generation**
    - **Validates: Requirements 4.1, 4.3, 4.4**

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Editor Application

- [ ] 9. Create Editor entry point and main app
  - [ ] 9.1 Create editor/public/index.html
    - Set up importmap for Three.js and SparkJS CDN
    - Include container element for 3D canvas
    - Include panel containers for UI
    - _Requirements: 3.1_
  - [ ] 9.2 Create editor/src/main.ts
    - Parse URL parameters (world, scene)
    - Initialize WorldNotesCore with editMode: true
    - Load existing scene if scene ID provided
    - _Requirements: 3.1_
  - [ ] 9.3 Create EditorApp.ts
    - Manage editor state (selected treat, placement mode)
    - Wire up panel interactions to Core
    - Handle mode toggle between edit/explore
    - _Requirements: 3.7_

- [ ] 10. Implement Editor UI panels
  - [ ] 10.1 Create TreatPanel.ts
    - Quick preset buttons (Geomarker Pin, Message in a Bottle)
    - Custom GLB URL input field
    - Message text textarea with character count
    - Position offset inputs
    - "Load & Place" button
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ] 10.2 Create placed treats list
    - Display list of placed treats
    - Edit and delete buttons per treat
    - Click to select treat
    - _Requirements: 3.4_
  - [ ] 10.3 Create EditPanel.ts (treat editing modal)
    - Message editing textarea
    - Drag-to-move toggle button
    - Reset position button
    - Copy treat button
    - Save and Delete buttons
    - _Requirements: 3.5_
  - [ ] 10.4 Create CalibrationPanel.ts
    - Display current camera position (x, y, z)
    - Display current camera rotation
    - Copy values button
    - Reset to origin button
    - Apply values inputs
    - _Requirements: 3.6_

- [ ] 11. Implement Share functionality
  - [ ] 11.1 Create SharePanel.ts
    - Share button in header
    - Modal with saving status
    - Display shareable URL
    - Copy URL button with confirmation
    - _Requirements: 4.1, 4.3, 4.5_
  - [ ] 11.2 Wire share to StorageClient
    - Call saveScene() on share
    - Display generated URL
    - Handle save errors
    - _Requirements: 4.2_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Viewer Application

- [ ] 13. Create Viewer entry point and main app
  - [ ] 13.1 Create viewer/public/index.html
    - Set up importmap for Three.js and SparkJS CDN
    - Minimal UI structure (world title, badge)
    - Container for 3D canvas
    - _Requirements: 5.6_
  - [ ] 13.2 Create viewer/src/main.ts
    - Parse URL parameters (world, scene, name)
    - Initialize WorldNotesCore with editMode: false
    - Load scene from S3 using scene ID
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ] 13.3 Create ViewerApp.ts
    - Manage viewer state (no editing)
    - Handle treat interactions (click/E to read)
    - Display world title and treat count
    - _Requirements: 5.4, 5.5, 5.6_
  - [ ]\* 13.4 Write property test for viewer scene loading
    - **Property 5: Viewer scene loading**
    - **Validates: Requirements 5.1, 5.4**

- [ ] 14. Implement Viewer UI components
  - [ ] 14.1 Create MessageModal.ts
    - Display treat message in modal
    - Close button
    - Triggered by E key or click
    - _Requirements: 5.5_
  - [ ] 14.2 Create ProximityIndicator.ts
    - Show indicator when near a treat with message
    - "Press E to read" hint
    - _Requirements: 5.5_
  - [ ] 14.3 Create WorldBadge.ts
    - Display world title
    - Display "X treats placed" count
    - Optional "Powered by WorldNotes" attribution
    - _Requirements: 5.6, 5.8_

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Configuration and Build

- [ ] 16. Set up configuration management
  - [ ] 16.1 Create shared config type and loader
    - Define StorageConfig interface
    - Create loadConfig() function
    - Support .env variables for local dev
    - Support production config injection
    - _Requirements: 7.1, 7.3, 7.4_
  - [ ] 16.2 Create .env.example with all required variables
    - VITE_AWS_REGION
    - VITE_AWS_COGNITO_IDENTITY_POOL_ID
    - VITE_AWS_S3_BUCKET
    - VITE_APP_URL (editor URL)
    - VITE_VIEWER_URL (viewer URL)
    - _Requirements: 7.1_

- [ ] 17. Configure build outputs
  - [ ] 17.1 Configure editor Vite build
    - Output to dist/editor
    - Copy static assets
    - Generate production-ready bundle
    - _Requirements: 8.2_
  - [ ] 17.2 Configure viewer Vite build
    - Output to dist/viewer
    - Copy static assets
    - Generate production-ready bundle
    - _Requirements: 8.3_
  - [ ] 17.3 Create build scripts
    - pnpm build:core - build core module
    - pnpm build:editor - build editor app
    - pnpm build:viewer - build viewer app
    - pnpm build - build all
    - _Requirements: 8.5_

## Phase 6: Documentation and Polish

- [ ] 18. Create documentation
  - [ ] 18.1 Update ARCHITECTURE.md with final structure
    - Document core/editor/viewer separation
    - Explain data flow between components
    - Include diagrams
    - _Requirements: 9.2_
  - [ ] 18.2 Create README.md for each package
    - core/README.md - API documentation
    - editor/README.md - Editor usage and deployment
    - viewer/README.md - Viewer usage and deployment
    - _Requirements: 8.4_
  - [ ] 18.3 Create deployment guide
    - S3 bucket setup instructions
    - CloudFront distribution setup
    - Cognito Identity Pool setup
    - IAM role configuration
    - _Requirements: 8.4_

- [ ] 19. Code quality and cleanup
  - [ ] 19.1 Add JSDoc comments to all public APIs
    - Document all exported functions
    - Document all interfaces
    - Include usage examples
    - _Requirements: 9.5, 9.6_
  - [ ] 19.2 Ensure consistent code style
    - Run ESLint and fix issues
    - Run Prettier and format
    - _Requirements: 9.5_

- [ ] 20. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
