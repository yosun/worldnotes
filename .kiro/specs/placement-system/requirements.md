# Requirements Document

## Introduction

The Placement System Enhancement improves the user experience for placing 3D treats in Splat and Treat worlds. The current system requires users to click and hope the treat lands correctly, with no preview or ability to adjust after placement. This enhancement introduces a ghost preview, drag-to-position, rotation controls, and snap-to-surface behavior to make placement intuitive and satisfying.

## Glossary

- **Treat**: A 3D object (.glb format) that users place within a Splat World
- **Ghost Preview**: A semi-transparent preview of the treat that follows the cursor/touch before placement is confirmed
- **Placement Mode**: The state when a treat is selected and ready to be positioned in the world
- **Surface Normal**: The perpendicular direction from a surface point, used for orienting treats
- **Raycast**: A technique to detect where a ray intersects with 3D geometry
- **Snap-to-Surface**: Automatic alignment of treats to the surface they're placed on
- **Gizmo**: Visual controls for manipulating object position, rotation, or scale
- **Confirm Placement**: The action of finalizing a treat's position in the world

## Requirements

### Requirement 1: Ghost Preview During Placement

**User Story:** As a user, I want to see a preview of my treat following my cursor before I place it, so that I can see exactly where it will land.

#### Acceptance Criteria

1. WHEN a treat is selected for placement THEN the System SHALL display a semi-transparent ghost preview at the cursor position
2. WHEN the cursor moves over a valid surface THEN the System SHALL update the ghost preview position in real-time
3. WHEN the cursor moves over an invalid area (no surface hit) THEN the System SHALL hide the ghost preview or show it in a disabled state
4. WHILE the ghost preview is visible THEN the System SHALL render it at 50% opacity to distinguish it from placed treats
5. WHEN the ghost preview is positioned THEN the System SHALL orient it to match the surface normal

### Requirement 2: Click-to-Confirm Placement

**User Story:** As a user, I want to click to confirm my treat placement, so that I have control over exactly when and where the treat is placed.

#### Acceptance Criteria

1. WHEN a user clicks while the ghost preview is visible on a valid surface THEN the System SHALL place the treat at the preview position
2. WHEN a treat is placed THEN the System SHALL convert the ghost preview to a solid placed treat
3. WHEN a treat is placed THEN the System SHALL keep the same treat selected for additional placements
4. WHEN a user presses Escape or clicks the cancel button THEN the System SHALL cancel placement mode and hide the ghost preview

### Requirement 3: Post-Placement Adjustment

**User Story:** As a user, I want to adjust a treat's position and rotation after placing it, so that I can fine-tune its placement without deleting and re-placing.

#### Acceptance Criteria

1. WHEN a user clicks on a placed treat in Edit mode THEN the System SHALL select that treat for adjustment
2. WHEN a treat is selected for adjustment THEN the System SHALL display visual indicators showing it is selected
3. WHEN a treat is selected THEN the System SHALL allow dragging to reposition it on surfaces
4. WHEN a treat is being dragged THEN the System SHALL update its position in real-time following the cursor
5. WHEN a user releases the drag THEN the System SHALL confirm the new position
6. WHEN a user clicks elsewhere or presses Escape THEN the System SHALL deselect the treat

### Requirement 4: Rotation Controls

**User Story:** As a user, I want to rotate my treats around the vertical axis, so that I can orient them to face the direction I want.

#### Acceptance Criteria

1. WHEN a treat is selected (ghost preview or placed) THEN the System SHALL allow rotation around the Y-axis (vertical)
2. WHEN a user scrolls the mouse wheel while a treat is selected THEN the System SHALL rotate the treat by 15-degree increments
3. WHEN a user presses Q or E keys while a treat is selected THEN the System SHALL rotate the treat left or right by 15 degrees
4. WHEN on mobile with a treat selected THEN the System SHALL display rotation buttons in the UI
5. WHEN a treat is rotated THEN the System SHALL preserve the surface-normal alignment while applying the Y-axis rotation

### Requirement 5: Scale Controls

**User Story:** As a user, I want to resize my treats, so that I can make them fit better in the scene.

#### Acceptance Criteria

1. WHEN a treat is selected THEN the System SHALL allow uniform scaling
2. WHEN a user holds Shift and scrolls the mouse wheel THEN the System SHALL scale the treat up or down
3. WHEN a user presses + or - keys while a treat is selected THEN the System SHALL scale the treat by 10% increments
4. WHEN on mobile with a treat selected THEN the System SHALL display scale buttons in the UI
5. THE System SHALL limit scaling to a range of 0.1x to 5x the original size

### Requirement 6: Visual Feedback and Affordances

**User Story:** As a user, I want clear visual feedback during placement, so that I understand what actions are available and what will happen.

#### Acceptance Criteria

1. WHEN a treat is selected for placement THEN the System SHALL change the cursor to indicate placement mode
2. WHEN the cursor is over a valid surface THEN the System SHALL display a subtle surface indicator (ring or highlight)
3. WHEN a placed treat is hovered in Edit mode THEN the System SHALL highlight it to show it can be selected
4. WHEN a treat is selected for adjustment THEN the System SHALL display a selection outline or glow effect
5. WHEN a treat cannot be placed (invalid surface) THEN the System SHALL show the ghost preview in red or with an X indicator

### Requirement 7: Undo/Redo Support

**User Story:** As a user, I want to undo my placement mistakes, so that I can experiment freely without fear of ruining my scene.

#### Acceptance Criteria

1. WHEN a user presses Ctrl+Z (Cmd+Z on Mac) THEN the System SHALL undo the last placement action
2. WHEN a user presses Ctrl+Shift+Z (Cmd+Shift+Z on Mac) THEN the System SHALL redo the last undone action
3. THE System SHALL maintain an undo history of the last 20 placement actions
4. WHEN an undo is performed THEN the System SHALL restore the previous state of the affected treat
5. THE System SHALL support undo for place, move, rotate, scale, and delete actions

### Requirement 8: Mobile Touch Gestures

**User Story:** As a mobile user, I want intuitive touch gestures for placement, so that I can place and adjust treats easily on my phone or tablet.

#### Acceptance Criteria

1. WHEN on mobile with a treat selected THEN the System SHALL place the ghost preview at the center of the screen
2. WHEN a mobile user taps on a valid surface THEN the System SHALL move the ghost preview to that location
3. WHEN a mobile user double-taps THEN the System SHALL confirm the placement
4. WHEN a mobile user uses two-finger rotation gesture THEN the System SHALL rotate the selected treat
5. WHEN a mobile user uses pinch gesture on a selected treat THEN the System SHALL scale the treat
6. THE System SHALL display on-screen buttons for confirm, cancel, rotate, and scale on mobile

