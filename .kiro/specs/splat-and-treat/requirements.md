# Requirements Document

## Introduction

Splat and Treat is a web-based 3D application that allows users to explore Gaussian splat (.spz) worlds and place 3D treats (.glb objects) within them. The application serves as a skeleton code template demonstrating the integration of SparkJS for splat rendering with collider-based raycasting, Stripe payments for token-based transactions, and AI-powered 3D object generation. This project targets the Kiroween hackathon's "Skeleton Crew" category by providing a lean, flexible foundation that can power multiple distinct applications.

## Glossary

- **Splat World**: A 3D environment rendered using Gaussian splatting technology via SparkJS (.spz format)
- **Treat**: A 3D object (.glb format) that users can place within a Splat World
- **SparkJS**: The rendering library (https://github.com/sparkjsdev/spark) used for Gaussian splat visualization and collider support
- **Splat Collider**: A collision detection system enabling raycasting against Gaussian splat geometry
- **Token**: Virtual currency purchased via Stripe, used to unlock premium features like AI 3D generation
- **AI3D**: AI-generated 3D objects created from user text prompts (costs 5 tokens)
- **GLB**: Binary glTF format for 3D models
- **SPZ**: Gaussian splat file format supported by SparkJS
- **Waypoint**: A navigation marker that can be linked into paths for guided tours
- **Vibe Code**: User-written JavaScript behaviors attached to treats for interactivity
- **Hacker-Creator Mode**: Advanced mode where LLM generates scene manipulation code from natural language
- **Edit Mode**: Application mode for placing and modifying treats
- **Explore Mode**: Application mode for navigating and viewing the world without editing
- **FPS Navigation**: First-person shooter style camera movement using WASD/arrow keys and touch controls

## Requirements

### Requirement 0: Edit and Explore Modes

**User Story:** As a user, I want to switch between Edit mode and Explore mode, so that I can either modify the world or simply navigate and view it.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL default to Explore mode
2. WHEN a user toggles to Edit mode THEN the System SHALL enable treat placement, waypoint creation, and scene modification controls
3. WHEN a user toggles to Explore mode THEN the System SHALL disable editing controls and enable free navigation
4. WHILE in Edit mode THEN the System SHALL display the treat selection panel and editing tools
5. WHILE in Explore mode THEN the System SHALL hide editing UI and show a minimal navigation interface
6. THE System SHALL provide a clearly visible toggle button to switch between modes

### Requirement 0.1: FPS Navigation Controls

**User Story:** As a user, I want to navigate the 3D world using familiar FPS-style controls on both desktop and mobile, so that I can explore freely and intuitively.

#### Acceptance Criteria

1. WHEN on desktop THEN the System SHALL support WASD or arrow keys for movement (forward, backward, strafe left/right)
2. WHEN on desktop THEN the System SHALL support mouse drag or right-click drag for camera look direction
3. WHEN on mobile THEN the System SHALL display a virtual joystick for movement
4. WHEN on mobile THEN the System SHALL support touch drag on the screen for camera look direction
5. THE System SHALL support pinch-to-zoom on mobile for adjusting field of view
6. THE System SHALL maintain smooth 60fps navigation on modern devices

### Requirement 1: World Selection and Loading

**User Story:** As a user, I want to select from existing worlds or request a custom world, so that I can find or create the perfect environment for my treats.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL display a world selection screen with thumbnails of available worlds
2. WHEN a user hovers over a world thumbnail THEN the System SHALL display a parallax preview effect
3. WHEN a user selects a Splat World THEN the System SHALL load and render the .spz file using SparkJS within 10 seconds
4. WHEN a Splat World is loaded THEN the System SHALL enable camera controls for navigation
5. WHEN a Splat World is loaded THEN the System SHALL initialize splat colliders for raycast hit detection
6. IF the .spz file fails to load THEN the System SHALL display an error message and offer alternative worlds
7. THE System SHALL provide a "Create Empty World" option for starting with a blank canvas
8. THE System SHALL provide a "Request from Slartibartfast" option where users can describe a custom world they want created

### Requirement 2: Treat Placement via Raycasting

**User Story:** As a user, I want to place 3D treats in the splat world by clicking on surfaces, so that I can customize and decorate the environment.

#### Acceptance Criteria

1. WHEN a user clicks on the Splat World surface with a treat selected THEN the System SHALL perform a raycast against splat colliders
2. WHEN a raycast hit is detected THEN the System SHALL place the selected treat .glb at the hit position
3. WHEN a treat is placed THEN the System SHALL orient the treat to align with the surface normal
4. WHEN a treat is placed THEN the System SHALL persist the treat position to the scene state
5. IF a raycast misses all colliders THEN the System SHALL provide visual feedback indicating no valid placement surface

### Requirement 3: Custom GLB with Attached Text

**User Story:** As a user, I want to place any GLB from a URL with custom text attached, so that I can bring my own 3D models into the world with personalized messages.

#### Acceptance Criteria

1. WHEN a user selects the custom GLB option THEN the System SHALL display input fields for GLB URL and optional text message
2. WHEN a user provides a valid GLB URL THEN the System SHALL load and instantiate the 3D model from that URL
3. WHEN a user attaches text to a GLB THEN the System SHALL store the message as metadata on the placed treat
4. WHEN another user clicks on a placed treat with attached text THEN the System SHALL display the contained message
5. THE System SHALL limit attached text to 280 characters
6. THE System SHALL provide a default Message in a Bottle preset using https://s3.amazonaws.com/worldmatica/message_in_a_bottle.glb

### Requirement 4: GLB Treat Library

**User Story:** As a user, I want to browse and search existing 3D treats from a database, so that I can quickly find and place pre-made objects.

#### Acceptance Criteria

1. WHEN a user opens the treat library THEN the System SHALL display a searchable grid of available .glb treats
2. WHEN a user enters a search query THEN the System SHALL filter treats by name and tags
3. WHEN a user selects a treat from the library THEN the System SHALL load the .glb and set it as the active placement object
4. THE System SHALL display treat thumbnails with name and category labels

### Requirement 5: Waypoint Navigation System

**User Story:** As a user, I want to place waypoint markers that create navigation paths through the world, so that visitors can follow guided tours or find points of interest.

#### Acceptance Criteria

1. WHEN a user selects the waypoint treat type THEN the System SHALL allow placing navigation markers in the world
2. WHEN a user places multiple waypoints THEN the System SHALL allow linking them into ordered paths
3. WHEN a visitor activates a waypoint path THEN the System SHALL animate the camera along the connected waypoints
4. THE System SHALL display visual indicators showing waypoint connections and path direction
5. THE System SHALL allow waypoints to trigger behaviors when reached (play audio, show text, activate nearby treats)
6. THE System SHALL support multiple named paths within a single world
7. THE System SHALL use https://s3.amazonaws.com/worldmatica/geomarker_animated.glb as the default waypoint marker

### Requirement 6: Scene State Persistence

**User Story:** As a user, I want my placed treats to be saved, so that I can return to my decorated world later.

#### Acceptance Criteria

1. WHEN a treat is placed THEN the System SHALL save the scene state including treat type, position, rotation, and metadata
2. WHEN a user returns to a previously visited world THEN the System SHALL restore all placed treats
3. THE System SHALL serialize scene state to JSON format for storage
4. THE System SHALL deserialize scene state from JSON format for restoration

### Requirement 7: Stripe Token Purchase

**User Story:** As a user, I want to purchase tokens via Stripe, so that I can access premium features like AI 3D generation.

#### Acceptance Criteria

1. WHEN a user initiates a token purchase THEN the System SHALL display available token packages with prices
2. WHEN a user selects a package THEN the System SHALL create a Stripe Checkout session
3. WHEN Stripe payment succeeds THEN the System SHALL credit the purchased tokens to the user's balance
4. WHEN Stripe payment fails THEN the System SHALL display an error and maintain the current token balance
5. THE System SHALL display the current token balance in the UI header

### Requirement 8: AI-Generated 3D Treats

**User Story:** As a user, I want to generate custom 3D treats from text prompts using AI, so that I can create unique objects for my world.

#### Acceptance Criteria

1. WHEN a user selects AI3D generation THEN the System SHALL display a text prompt input
2. WHEN a user submits a prompt with sufficient token balance (5 tokens) THEN the System SHALL deduct 5 tokens and initiate 3D generation
3. WHEN AI3D generation completes THEN the System SHALL convert the result to .glb format and add it to the user's treat inventory
4. IF the user has insufficient tokens THEN the System SHALL display a prompt to purchase more tokens
5. WHEN AI3D generation fails THEN the System SHALL refund the 5 tokens and display an error message

### Requirement 9: Skeleton Code Architecture

**User Story:** As a developer, I want a clean, modular codebase, so that I can easily adapt this template for different use cases.

#### Acceptance Criteria

1. THE System SHALL separate concerns into distinct modules: rendering, input handling, payments, and data persistence
2. THE System SHALL provide clear interfaces between the SparkJS renderer and application logic
3. THE System SHALL use TypeScript for type safety and code clarity
4. THE System SHALL include inline documentation for all public APIs
5. WHEN a developer extends the template THEN the System SHALL allow swapping splat worlds and treat types without modifying core logic

### Requirement 10: Dual Application Demonstration

**User Story:** As a hackathon judge, I want to see two distinct applications built from the same skeleton, so that I can evaluate the template's versatility.

#### Acceptance Criteria

1. THE System SHALL include Application A: "Splat and Treat" - the Halloween-themed treat placement experience
2. THE System SHALL include Application B: A second distinct application demonstrating the skeleton's flexibility (e.g., virtual gallery, product placement, or educational tool)
3. WHEN comparing both applications THEN the shared skeleton code SHALL be clearly identifiable
4. THE System SHALL document the customization points used by each application

---

## Advanced Features (Lower Priority)

### Requirement 11: Vibe Code Custom Behaviors

**User Story:** As a user, I want to attach custom vibe-coded functionality to any GLB, so that my placed treats can have interactive behaviors like animations, sounds, or triggered actions.

#### Acceptance Criteria

1. WHEN a user selects a GLB for placement THEN the System SHALL provide an option to attach custom behavior code
2. WHEN a user enters vibe code THEN the System SHALL validate the code for safe execution (no network calls, no infinite loops)
3. WHEN a treat with attached code is placed THEN the System SHALL execute the behavior code in a sandboxed environment
4. WHEN another user interacts with a coded treat THEN the System SHALL trigger the attached behavior
5. THE System SHALL support behavior triggers: onClick, onHover, onProximity, onTimer, and onCollision
6. THE System SHALL provide code templates for common behaviors (spin, bounce, glow, play sound)
7. THE System SHALL store behavior code as part of the treat metadata in the scene state

### Requirement 12: Inter-Object Communication and Chaining

**User Story:** As a user, I want treats to communicate with each other and trigger chain reactions, so that I can build complex interactive systems like Rube Goldberg machines.

#### Acceptance Criteria

1. WHEN a user creates a treat THEN the System SHALL allow assigning a unique object ID for referencing
2. WHEN vibe code executes THEN the System SHALL provide an API to emit events to other treats by ID or broadcast to all
3. WHEN a treat receives an event THEN the System SHALL trigger the onEvent behavior with the event payload
4. THE System SHALL support physics-based triggers where one object colliding with another triggers behaviors
5. THE System SHALL allow chaining multiple treats so that one trigger cascades through connected objects
6. THE System SHALL provide templates for chain reaction patterns (domino effect, ball drop, lever activation)

### Requirement 13: Hacker-Creator Mode (LLM Vibe Engine)

**User Story:** As a power user, I want to enter a hacker-creator mode where I can send the entire scene graph and engine capabilities to an LLM with a vibe prompt, so that I can experiment with AI-generated scene manipulations and discover emergent behaviors.

#### Acceptance Criteria

1. WHEN a user activates hacker-creator mode THEN the System SHALL serialize the complete scene graph including all treats, positions, behaviors, and connections
2. WHEN a user enters a vibe prompt THEN the System SHALL send the scene context plus engine API documentation to an LLM
3. WHEN the LLM returns generated code THEN the System SHALL display a preview of proposed changes before execution
4. WHEN a user approves the generated code THEN the System SHALL execute it in a sandboxed environment with full scene access
5. THE System SHALL provide the LLM with available APIs: object manipulation, physics, animations, events, camera control, and audio
6. THE System SHALL allow users to undo LLM-generated changes with a single action
7. IF the generated code causes errors THEN the System SHALL catch exceptions and rollback to the previous scene state
8. THE System SHALL deduct tokens for LLM vibe prompts (cost configurable, default 2 tokens per prompt)
