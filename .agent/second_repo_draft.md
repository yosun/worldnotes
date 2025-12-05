You are a senior full-stack / WebGL engineer helping me refactor an existing prototype called **Splat-n-Treat** into a generalized architecture that can be cleanly split into **two repos**:

* **Repo A – worldnotes-editor** (full editor)
* **Repo B – worldnotes-viewer** (view-only embeddable viewer)

Both repos target the web and are deployed as static sites (CloudFront + S3). The app you see now is the editor prototype.

---

## High-level goal

Turn the current single-page viewer/editor prototype (Spark.js + UI panel) into:

1. A **shared core module** (`@worldnotes/core` or local `core/` folder) that contains:

   * Splat loading & rendering (Spark.js integration)
   * Input controls (WASD, mouse look, click to place)
   * Treat schema, serialization, and runtime model
   * Camera calibration utilities
   * Config loading from URL params
   * S3/Cognito integration utilities (no hardcoded env; use config object)

2. An **Editor app** (Repo A) that:

   * Imports the core
   * Adds the full **Place Treats** side panel and edit flow:

     * quick presets (Geomarker Pin, Message in a Bottle)
     * custom GLB URL + message text
     * position offset inputs
     * list of placed treats with edit/delete
     * “Edit Treat” modal (message, drag-to-move, reset, copy, save, delete)
   * Includes **Share** flow:

     * generates a sharable URL pointing to the viewer, with scene config stored in S3
     * writes the treat config JSON to S3 via Cognito
   * Includes **Camera Calibration** UI (read-only in viewer; editable here)
   * Exposes a simple config file for:

     * world name, thumbnail, splat URL
     * default camera values
     * default treat GLB
   * Is easy to extend with more “treat types” later.

3. A **Viewer app** (Repo B) that:

   * Imports the same core
   * **Does NOT include** treat creation UI
   * Only:

     * loads the `.spz` world
     * loads treat config JSON (from URL / S3)
     * renders treats
     * supports basic interactions: walk, look, hover, E/Click to read message
   * Optional minimal UI:

     * world title
     * “X treats placed” badge
   * No S3 write, only read. No edit side panel.

---

## Current behavior to preserve

From the existing prototype (what you see now):

* **Controls**

  * `WASD` to move
  * `ESC` to toggle cursor / look
  * click to place when in placement mode
  * drag-to-move treat during edit
  * E or click to open nearby message

* **Treats**

  * Each treat is defined by:

    * `id`
    * `type` (e.g., `geomarker`, `bottle`, custom)
    * `glbUrl`
    * `message` (optional)
    * `position` (vec3)
    * `rotation` (vec3 or yaw/pitch/roll)
    * maybe `createdAt`, `updatedAt`
  * Treats can be:

    * created from quick presets or custom GLB
    * selected, edited, deleted
    * serialized/deserialized to JSON

* **Camera calibration**

  * UI shows current camera position, rotation, and direction
  * Buttons to copy values, reset to origin, apply values

* **Share**

  * “Share” shows a modal with a URL
  * That URL encodes at least:

    * world id (splat URL)
    * name
    * thumbnail URL
  * The treat config is stored externally (e.g. S3 JSON), the viewer loads it.

---

## Refactor / implementation tasks

1. **Codebase survey + notes**

   * Find all logic related to:

     * Spark.js init & render loop
     * camera / controls
     * treat placement & editing
     * S3/Cognito saving
     * URL parameter parsing
   * Group them into:

     * `core/` (shared)
     * `editor/` (editor-only UI)
     * `viewer/` (viewer-only UI)
   * Write a short `ARCHITECTURE.md` summarizing this structure.

2. **Create a core module**

   * Implement a `WorldNotesCore` (name can be improved) that exposes:

     * `initWorld(container, config)` → returns a handle with:

       * `addTreat(treatData)`
       * `updateTreat(treatId, patch)`
       * `removeTreat(treatId)`
       * `getTreats()`
       * `setCameraPose(pose)`
       * `getCameraPose()`
       * event hooks: `onTreatClicked`, `onMessageZoneEntered`, etc.
     * Treat schema TypeScript types or JSDoc typedefs.
     * Simple `loadConfigFromUrl()` helper.
   * Core should *not* know about DOM panels, modals, or specific CSS.

3. **Editor app (Repo A)**

   * Build an `editor.html` / `editor.tsx` entry that:

     * mounts the core viewer
     * controls “Edit mode” state
     * implements the right-hand “Place Treats” panel UI:

       * quick preset buttons
       * custom GLB URL input
       * message textarea
       * position offset inputs
       * “Load & Select Treat” button
       * placed treats list (with edit/delete)
       * “Edit Treat” modal with:

         * message editing
         * drag-to-move toggle
         * reset, delete, copy, save
     * wires UI actions to core (add/update/remove treat).
   * Implement the Share modal logic:

     * `saveSceneToS3()` (using Cognito creds from a config file)
     * get back a scene config URL
     * build final viewer URL and show it.

4. **Viewer app (Repo B)**

   * Build a minimal `viewer.html` / `viewer.ts` entry that:

     * reads URL params (world URL, config URL, etc.)
     * initializes the core in view-only mode
     * loads treat config JSON (S3 public read)
     * registers events so:

       * clicking near a treat or pressing `E` opens its message (simple overlay)
     * includes no editing UI, no S3 write logic.
   * Provide a minimal CSS/HTML chrome that:

     * shows world name
     * maybe a subtle “Powered by WorldNotes” in a corner.

5. **Config & environment**

   * Introduce a `config.ts` or `.env` mapping for:

     * S3 bucket
     * Cognito Identity Pool ID
     * region
   * Editor and viewer should both import from a shared config (or provide different config files in each repo but with the same shape).
   * Ensure everything can run locally (with dummy config) and in production.

6. **Build & bundling**

   * Use a simple bundler setup (Vite, esbuild, or plain `tsc + esbuild`) that works with Spark.js without WASM/bundling issues.
   * Produce:

     * `dist/editor` for Repo A
     * `dist/viewer` for Repo B
   * Documentation:

     * `README` with “how to run locally” and “how to deploy to S3 + CloudFront”.

7. **Skeleton Crew requirement**

   * Make sure both repos are clearly distinct apps that share the core:

     * Editor: full create/edit/save/share experience.
     * Viewer: read-only, embeddable world experience.
   * Document this explicitly in `ARCHITECTURE.md` and in the Devpost README language (“two separate repos built on a shared WorldNotes core”).

---

## Style / code quality

* Prefer small, well-named functions and clear modules over cleverness.
* Add comments where the behavior is non-obvious (raycasting, camera math).
* Keep CSS simple and close to the current visual design.
* Avoid React if it complicates Spark.js integration; a lightweight reactive pattern or minimal JSX is fine.
* Prioritize **clarity** and **extensibility** over micro-optimizations.

---

## Deliverables

1. Refactored code with:

   * `core/` module
   * `editor/` entry
   * `viewer/` entry

2. Two repo-ready folders or branches:

   * `worldnotes-editor`
   * `worldnotes-viewer`

3. Docs:

   * `ARCHITECTURE.md` explaining the split and shared core
   * `README.md` for each repo with basic run/deploy instructions.

Start by mapping the current code into a proposed `core/editor/viewer` structure, then implement the core API and rewire the editor UI. After that, create the minimal viewer app that consumes the same core without editing features.
