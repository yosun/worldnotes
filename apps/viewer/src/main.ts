/**
 * WorldNotes Viewer - Entry point
 *
 * This is the main entry point for the Viewer application.
 * It initializes the WorldNotes core in read-only mode.
 *
 * Implementation details in task 13.2
 */

// Parse URL parameters
const params = new URLSearchParams(window.location.search);
const worldUrl = params.get('world');
const sceneId = params.get('scene');
const worldName = params.get('name') || 'WorldNotes Scene';

console.log('WorldNotes Viewer initializing...', { worldUrl, sceneId, worldName });

// Update UI with world name
const titleEl = document.getElementById('world-title');
if (titleEl) {
  titleEl.textContent = worldName;
}

// Placeholder - full implementation in task 13
export {};
