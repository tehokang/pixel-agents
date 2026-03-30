/** Map status prefixes back to tool names for animation selection */
export const STATUS_TO_TOOL: Record<string, string> = {
  Reading: 'Read',
  Searching: 'Grep',
  Globbing: 'Glob',
  Fetching: 'WebFetch',
  'Searching web': 'WebSearch',
  Writing: 'Write',
  Editing: 'Edit',
  Running: 'Bash',
  Task: 'Task',
};

export function extractToolName(status: string): string | null {
  for (const [prefix, tool] of Object.entries(STATUS_TO_TOOL)) {
    if (status.startsWith(prefix)) return tool;
  }
  const first = status.split(/[\s:]/)[0];
  return first || null;
}

import { DEFAULT_COLS, DEFAULT_ROWS, TILE_SIZE, ZOOM_MIN } from '../constants.js';

/**
 * Compute a default integer zoom level (device pixels per sprite pixel).
 *
 * [AWT PATCH] When embedded in a small viewport (e.g. AWT Inspector panel),
 * the original DPR-based zoom is too high — the map overflows and only the
 * center portion is visible.  This patch computes the maximum integer zoom
 * that fits the default map (DEFAULT_COLS × DEFAULT_ROWS × TILE_SIZE)
 * within the current viewport, falling back to the original DPR-based
 * calculation for large viewports (VS Code panel, standalone browser).
 *
 * Upstream default: Math.max(ZOOM_MIN, Math.round(ZOOM_DEFAULT_DPR_FACTOR * dpr))
 * See: https://github.com/pablodelucca/pixel-agents
 */
export function defaultZoom(): number {
  const dpr = window.devicePixelRatio || 1;

  // [AWT PATCH] Fractional zoom — fit the map exactly to the viewport
  // with zero padding.  pixel-agents' renderer uses TILE_SIZE * zoom
  // for all calculations, so fractional values work correctly.
  const vw = window.innerWidth * dpr;
  const vh = window.innerHeight * dpr;
  const mapW = DEFAULT_COLS * TILE_SIZE;
  const mapH = DEFAULT_ROWS * TILE_SIZE;
  return Math.max(ZOOM_MIN, Math.min(vw / mapW, vh / mapH));
}
