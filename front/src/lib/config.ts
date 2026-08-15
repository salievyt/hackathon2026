export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

// Fallback used only when the backend is unreachable, so the timer still renders.
export const DEFAULT_EVENT_START = '2026-11-21T10:00:00Z';
