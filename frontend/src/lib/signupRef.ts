// Captures ?ref= on first load so it survives navigation until registration
const STORAGE_KEY = 'signup-ref';
const REF_PATTERN = /^[a-z0-9_-]{1,32}$/;

export function captureSignupRef(): void {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref')?.trim().toLowerCase();
    if (!ref || !REF_PATTERN.test(ref)) return;
    if (localStorage.getItem(STORAGE_KEY)) return; // first touch wins
    localStorage.setItem(STORAGE_KEY, ref);
  } catch {
    // storage unavailable (private mode, blocked) — attribution is best-effort
  }
}

export function getSignupRef(): string | undefined {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function clearSignupRef(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
