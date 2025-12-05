# Implementation Plan

## Phase 1: Core Ghost Preview System

- [x] 1. Create GhostPreview component
  - [x] 1.1 Implement GhostPreview class in viewer.html
    - Load GLB model and clone for preview
    - Set all materials to 50% opacity
    - Add to scene but initially hidden
    - _Requirements: 1.1, 1.4_
  - [ ]* 1.2 Write property test for ghost opacity
    - **Property 3: Ghost preview opacity is 50%**
    - **Validates: Requirements 1.4**
  - [x] 1.3 Implement position and orientation updates
    - setPosition() from raycast hit
    - Orient to surface normal
    - _Requirements: 1.2, 1.5_
  - [ ]* 1.4 Write property test for ghost position
    - **Property 1: Ghost preview position matches raycast hit**
    - **Validates: Requirements 1.2, 1.5**
  - [x] 1.5 Implement validity state visualization
    - Show/hide based on raycast validity
    - Red tint when invalid (no surface hit)
    - _Requirements: 1.3, 6.5_
  - [ ]* 1.6 Write property test for ghost visibility
    - **Property 2: Ghost preview visibility follows raycast validity**
    - **Validates: Requirements 1.3**

- [x] 2. Integrate ghost preview with existing placement flow
  - [x] 2.1 Update TreatManager.selectTreat() to create ghost preview
    - When treat is selected, show ghost preview
    - Ghost follows cursor via mousemove/touchmove events
    - _Requirements: 1.1, 1.2_
  - [x] 2.2 Add surface indicator ring
    - Small orange ring at raycast hit point
    - Shows where treat will be placed
    - _Requirements: 6.2_
  - [x] 2.3 Update cursor style during placement mode
    - Change cursor to crosshair when in placement mode
    - _Requirements: 6.1_

**🎯 CHECKPOINT: Ghost preview follows cursor and shows placement position!**

## Phase 2: Click-to-Confirm Placement

- [ ] 3. Implement click-to-confirm workflow
  - [ ] 3.1 Modify click handler for placement confirmation
    - Click places treat at ghost position (not raycast position)
    - Convert ghost to solid treat (full opacity)
    - _Requirements: 2.1, 2.2_
  - [ ]* 3.2 Write property test for placement position
    - **Property 4: Placed treat position equals ghost position**
    - **Validates: Requirements 2.1**
  - [ ]* 3.3 Write property test for placed treat opacity
    - **Property 5: Placed treat has full opacity**
    - **Validates: Requirements 2.2**
  - [ ] 3.4 Keep selection after placement
    - After placing, same treat type remains selected
    - Ghost preview reappears for next placement
    - _Requirements: 2.3_
  - [ ]* 3.5 Write property test for selection persistence
    - **Property 6: Selection persists after placement**
    - **Validates: Requirements 2.3**
  - [ ] 3.6 Implement cancel placement
    - Escape key or cancel button hides ghost and exits placement mode
    - _Requirements: 2.4_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Selection and Post-Placement Adjustment

- [ ] 5. Create SelectionManager component
  - [ ] 5.1 Implement SelectionManager class
    - Track selected treat ID
    - Track hovered treat ID
    - Emit events on selection/deselection
    - _Requirements: 3.1, 3.2_
  - [ ] 5.2 Implement selection visual feedback
    - Orange outline around selected treat
    - Subtle glow effect
    - _Requirements: 3.2, 6.4_
  - [ ] 5.3 Implement hover highlighting
    - Light highlight on hover in edit mode
    - _Requirements: 6.3_
  - [ ] 5.4 Wire up click-to-select in edit mode
    - Click on placed treat selects it for adjustment
    - Click elsewhere deselects
    - Escape deselects
    - _Requirements: 3.1, 3.6_

- [ ] 6. Implement drag-to-reposition
  - [ ] 6.1 Add drag detection for selected treats
    - Mousedown on selected treat starts drag
    - Track drag state
    - _Requirements: 3.3_
  - [ ] 6.2 Update treat position during drag
    - Follow cursor raycast hit in real-time
    - Maintain surface normal alignment
    - _Requirements: 3.3, 3.4_
  - [ ]* 6.3 Write property test for drag position
    - **Property 7: Drag updates treat position to raycast hit**
    - **Validates: Requirements 3.3, 3.4**
  - [ ] 6.4 Commit position on drag end
    - Mouseup commits the new position
    - _Requirements: 3.5_
  - [ ]* 6.5 Write property test for drag commit
    - **Property 8: Drag end commits position**
    - **Validates: Requirements 3.5**

**🎨 CHECKPOINT: Can select placed treats and drag to reposition!**

## Phase 4: Rotation and Scale Controls

- [ ] 7. Create TransformManager component
  - [ ] 7.1 Implement TransformManager class
    - rotateY() with 15-degree increments
    - scale() with 10% increments and bounds [0.1, 5.0]
    - _Requirements: 4.1, 5.1_
  - [ ]* 7.2 Write property test for rotation increment
    - **Property 9: Rotation changes by exact increment**
    - **Validates: Requirements 4.2, 4.3**
  - [ ]* 7.3 Write property test for surface alignment preservation
    - **Property 10: Rotation preserves surface alignment**
    - **Validates: Requirements 4.5**
  - [ ]* 7.4 Write property test for uniform scale
    - **Property 11: Scale changes uniformly**
    - **Validates: Requirements 5.1**
  - [ ]* 7.5 Write property test for scale bounds
    - **Property 12: Scale is clamped to bounds**
    - **Validates: Requirements 5.5**

- [ ] 8. Wire up rotation controls
  - [ ] 8.1 Add mouse wheel rotation
    - Scroll wheel rotates selected treat by 15 degrees
    - Works on ghost preview and selected treats
    - _Requirements: 4.2_
  - [ ] 8.2 Add keyboard rotation (Q/E)
    - Q rotates left, E rotates right
    - 15-degree increments
    - _Requirements: 4.3_

- [ ] 9. Wire up scale controls
  - [ ] 9.1 Add Shift+scroll scaling
    - Shift + scroll wheel scales up/down
    - _Requirements: 5.2_
  - [ ] 9.2 Add keyboard scaling (+/-)
    - Plus key scales up 10%, minus scales down 10%
    - _Requirements: 5.3_

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Undo/Redo System

- [ ] 11. Create UndoHistory component
  - [ ] 11.1 Implement UndoHistory class
    - Push actions with before/after state snapshots
    - 20-action history limit
    - Undo/redo stack management
    - _Requirements: 7.1, 7.2, 7.3_
  - [ ]* 11.2 Write property test for undo restoration
    - **Property 13: Undo restores previous state**
    - **Validates: Requirements 7.1**
  - [ ]* 11.3 Write property test for redo restoration
    - **Property 14: Redo restores undone state**
    - **Validates: Requirements 7.2**
  - [ ]* 11.4 Write property test for history size limit
    - **Property 15: Undo history respects size limit**
    - **Validates: Requirements 7.3**
  - [ ]* 11.5 Write property test for all action types
    - **Property 16: All action types are undoable**
    - **Validates: Requirements 7.5**

- [ ] 12. Integrate undo/redo with placement actions
  - [ ] 12.1 Record place actions
    - Push action when treat is placed
    - _Requirements: 7.5_
  - [ ] 12.2 Record move actions
    - Push action when drag ends
    - _Requirements: 7.5_
  - [ ] 12.3 Record rotate/scale actions
    - Push action when transform completes
    - _Requirements: 7.5_
  - [ ] 12.4 Record delete actions
    - Push action when treat is deleted
    - _Requirements: 7.5_
  - [ ] 12.5 Wire up keyboard shortcuts
    - Ctrl+Z (Cmd+Z) for undo
    - Ctrl+Shift+Z (Cmd+Shift+Z) for redo
    - _Requirements: 7.1, 7.2_

**⏪ CHECKPOINT: Full undo/redo support for all placement actions!**

## Phase 6: Mobile Touch Support

- [ ] 13. Create MobileControls component
  - [ ] 13.1 Implement on-screen control buttons
    - Confirm/Cancel buttons during preview
    - Rotate left/right buttons during adjustment
    - Scale up/down buttons during adjustment
    - _Requirements: 4.4, 5.4, 8.6_
  - [ ] 13.2 Style mobile controls
    - Position at top and bottom of screen
    - Semi-transparent, touch-friendly size
    - _Requirements: 8.6_

- [ ] 14. Implement mobile gestures
  - [ ] 14.1 Implement tap-to-position ghost
    - Single tap moves ghost preview to tap location
    - _Requirements: 8.2_
  - [ ]* 14.2 Write property test for tap positioning
    - **Property 17: Mobile tap moves ghost to hit position**
    - **Validates: Requirements 8.2**
  - [ ] 14.3 Implement double-tap to confirm
    - Double-tap confirms placement
    - _Requirements: 8.3_
  - [ ] 14.4 Implement two-finger rotation
    - Two-finger rotation gesture rotates treat
    - _Requirements: 8.4_
  - [ ] 14.5 Implement pinch-to-scale
    - Pinch gesture scales selected treat
    - _Requirements: 8.5_
  - [ ]* 14.6 Write property test for pinch scale
    - **Property 18: Mobile pinch scales treat**
    - **Validates: Requirements 8.5**

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
