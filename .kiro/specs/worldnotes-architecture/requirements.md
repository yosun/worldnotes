# Requirements Document

## Introduction

This specification defines the refactoring of the Splat-n-Treat prototype into a generalized WorldNotes architecture that cleanly separates into two deployable applications: an Editor (full create/edit/save/share experience) and a Viewer (read-only embeddable world experience). Both applications share a common core module containing splat rendering, input controls, treat management, and persistence utilities. The architecture targets static site deployment (S3 + CloudFront) with no backend server required.

## Glossary

- **WorldNotes Core**: Shared module containing splat loading, rendering, input controls, treat schema, serialization, and S3/Cognito integration utilities
- **Editor App**: Full-featured application (Repo A) with treat placement UI, editing flow, share functionality, and camera calibration
- **Viewer App**: Read-only application (Repo B) that loads and displays shared scenes without editing capabilities
- **Treat**: A 3D object (.glb format) placed within a splat world, with optional attached message and metadata
- **Scene Config**: JSON file stored in S3 containing world URL, placed treats, waypoints, and paths
- **SparkJS**: Rendering library for Gaussian splat (.spz) visualization
- **Cognito**: AWS service providing temporary credentials for anonymous S3 access
- **Camera Calibration**: UI for viewing and adjusting camera position, rotation, and direction values

## Requirements

### Requirement 1: Core Module Architecture

**User Story:** As a developer, I want a shared core module that encapsulates all 3D rendering and scene management logic, so that both Editor and Viewer apps can reuse the same foundation without code duplication.

#### Acceptance Criteria

1. THE Core Module SHALL expose an `initWorld(container, config)` function that returns a world handle with scene manipulation methods
2. THE Core Module SHALL provide methods for treat management: `addTreat(treatData)`, `updateTreat(treatId, patch)`, `removeTreat(treatId)`, `getTreats()`
3. THE Core Module SHALL provide methods for camera control: `setCameraPose(pose)`, `getCameraPose()`
4. THE Core Module SHALL emit events for user interactions: `onTreatClicked`, `onMessageZoneEntered`
5. THE Core Module SHALL NOT contain any DOM panel, modal, or CSS-specific code
6. THE Core Module SHALL accept configuration via a config object rather than hardcoded environment variables
7. WHEN the Core Module is imported THEN the importing application SHALL be able to use it without modification for either editing or viewing scenarios

### Requirement 2: Treat Data Model

**User Story:** As a developer, I want a well-defined treat schema, so that treats can be consistently created, serialized, and restored across both applications.

#### Acceptance Criteria

1. THE Treat Schema SHALL include: `id`, `type`, `glbUrl`, `message` (optional), `position` (vec3), `rotation` (vec3 or yaw/pitch/roll)
2. THE Treat Schema SHALL support optional fields: `createdAt`, `updatedAt`
3. THE Treat Schema SHALL support types: `geomarker`, `bottle`, and custom types
4. WHEN a treat is serialized THEN the System SHALL produce valid JSON that can be deserialized to an equivalent treat object
5. WHEN a treat is deserialized THEN the System SHALL restore all fields including position, rotation, and metadata

### Requirement 3: Editor Application Features

**User Story:** As a user of the Editor app, I want full treat placement and editing capabilities, so that I can create and customize 3D scenes.

#### Acceptance Criteria

1. WHEN the Editor loads THEN the System SHALL display the treat placement side panel with quick presets (Geomarker Pin, Message in a Bottle)
2. THE Editor SHALL provide input fields for custom GLB URL and message text
3. THE Editor SHALL provide position offset inputs for fine-tuning treat placement
4. THE Editor SHALL display a list of placed treats with edit and delete actions
5. WHEN a user clicks "Edit Treat" THEN the System SHALL display a modal with message editing, drag-to-move toggle, reset, copy, save, and delete options
6. THE Editor SHALL include camera calibration UI showing current position, rotation, and direction with copy and reset buttons
7. THE Editor SHALL support WASD movement, ESC to toggle cursor/look, click to place in placement mode, and drag-to-move during edit

### Requirement 4: Share Flow

**User Story:** As a user of the Editor app, I want to share my created scene, so that others can view it in the Viewer app.

#### Acceptance Criteria

1. WHEN a user clicks "Share" THEN the System SHALL serialize the current scene state to JSON
2. WHEN sharing THEN the System SHALL save the scene config JSON to S3 using Cognito credentials
3. WHEN the save succeeds THEN the System SHALL generate a shareable URL pointing to the Viewer app with the scene ID
4. THE shareable URL SHALL encode: world ID (splat URL), name, and scene config reference
5. WHEN a user copies the share URL THEN the System SHALL copy it to the clipboard and provide visual confirmation

### Requirement 5: Viewer Application Features

**User Story:** As a visitor using the Viewer app, I want to explore shared scenes without editing capabilities, so that I can experience 3D worlds created by others.

#### Acceptance Criteria

1. WHEN the Viewer loads with URL parameters THEN the System SHALL parse world URL and scene config URL from the parameters
2. WHEN the Viewer initializes THEN the System SHALL load the .spz world using the Core Module
3. WHEN the Viewer initializes THEN the System SHALL load treat config JSON from S3 (public read)
4. THE Viewer SHALL render all treats from the loaded scene config
5. THE Viewer SHALL support basic interactions: walk (WASD), look (mouse), hover on treats, E or click to read messages
6. THE Viewer SHALL display minimal UI: world title and optional "X treats placed" badge
7. THE Viewer SHALL NOT include any editing UI, treat creation panels, or S3 write operations
8. THE Viewer MAY display a subtle "Powered by WorldNotes" attribution

### Requirement 6: Input Controls Preservation

**User Story:** As a user, I want consistent navigation controls across both applications, so that the experience feels familiar whether editing or viewing.

#### Acceptance Criteria

1. THE System SHALL support WASD keys for movement in both Editor and Viewer
2. THE System SHALL support ESC to toggle cursor/look mode
3. THE System SHALL support click to place treats when in placement mode (Editor only)
4. THE System SHALL support drag-to-move treats during edit (Editor only)
5. THE System SHALL support E or click to open nearby treat messages (both apps)

### Requirement 7: Configuration Management

**User Story:** As a developer, I want a clean configuration system, so that both applications can be configured for different environments without code changes.

#### Acceptance Criteria

1. THE System SHALL use a config file or .env mapping for: S3 bucket, Cognito Identity Pool ID, and AWS region
2. THE Editor and Viewer SHALL import configuration from a shared config shape
3. WHEN running locally THEN the System SHALL work with dummy/development configuration
4. WHEN deployed to production THEN the System SHALL use production configuration values
5. THE config shape SHALL be identical between Editor and Viewer to enable code sharing

### Requirement 8: Build and Deployment

**User Story:** As a developer, I want a simple build setup that produces deployable artifacts for both applications, so that I can deploy to S3 + CloudFront.

#### Acceptance Criteria

1. THE build system SHALL use Vite or esbuild compatible with SparkJS (avoiding WASM bundling issues)
2. THE build system SHALL produce `dist/editor` for the Editor app
3. THE build system SHALL produce `dist/viewer` for the Viewer app
4. THE System SHALL include documentation for local development and S3 + CloudFront deployment
5. WHEN building THEN the System SHALL bundle the Core Module into each application without requiring a separate deployment

### Requirement 9: Codebase Organization

**User Story:** As a developer, I want clear separation between core, editor, and viewer code, so that I can understand and maintain the codebase easily.

#### Acceptance Criteria

1. THE codebase SHALL organize code into: `core/` (shared), `editor/` (editor-only UI), `viewer/` (viewer-only UI)
2. THE System SHALL include an ARCHITECTURE.md documenting the structure and separation
3. THE Core Module SHALL be clearly identifiable as shared code between both applications
4. WHEN extending the system THEN developers SHALL be able to add new treat types without modifying core logic
5. THE System SHALL prefer small, well-named functions over complex implementations
6. THE System SHALL include comments where behavior is non-obvious (raycasting, camera math)

### Requirement 10: Scene Persistence Round-Trip

**User Story:** As a user, I want my scenes to be saved and loaded accurately, so that shared scenes appear exactly as I created them.

#### Acceptance Criteria

1. WHEN a scene is serialized THEN the System SHALL produce JSON containing all treats with their positions, rotations, and metadata
2. WHEN a scene is deserialized THEN the System SHALL restore all treats to their exact saved positions and rotations
3. THE serialization format SHALL be versioned to support future schema changes
4. WHEN loading a scene with an older version THEN the System SHALL migrate it to the current format

