// Drives the hidden Google Website Translator widget mounted by
// components/GoogleTranslateLoader.tsx. Google's widget stores the active
// target language in a `googtrans` cookie shaped "/en/<lang>" and exposes a
// hidden <select class="goog-te-combo"> that it watches for `change` events
// — setting that select's value and firing `change` is the standard way to
// switch languages without the user touching Google's own picker UI.
const GOOGTRANS_COOKIE = 'googtrans';

function setCookie(name: string, value: string) {
  // Set on both the bare host and ".host" — Google's script reads whichever
  // it wrote last, and which variant it wrote is inconsistent across page
  // loads, so covering both avoids a cookie that silently doesn't stick.
  document.cookie = `${name}=${value};path=/`;
  document.cookie = `${name}=${value};path=/;domain=.${window.location.hostname}`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  document.cookie = `${name}=;path=/;domain=.${window.location.hostname};expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

export function getActiveGoogleTranslateLang(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z-]+)/);
  return match ? match[1] : null;
}

function fireChange(el: HTMLSelectElement) {
  // Fired twice deliberately: this is the long-standing, widely-tested
  // "doGTranslate" trick — a single dispatch sometimes only arms Google's
  // internal listener without triggering the translation on the first
  // language switch after page load. The second dispatch is what actually
  // reaches it reliably.
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

// Retries because the widget injects its <select> — and populates its
// <option> list — asynchronously after its script loads. Two distinct
// "not ready yet" states need the same retry: the combo box not existing at
// all yet, and it existing but not yet having an <option value="lang">
// (setting .value to a not-yet-present option silently no-ops rather than
// throwing, so checking afterwards is the only way to detect it).
function applyToWidget(lang: string, attemptsLeft = 20) {
  const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo');
  if (!combo) {
    if (attemptsLeft <= 0) return;
    window.setTimeout(() => applyToWidget(lang, attemptsLeft - 1), 250);
    return;
  }
  combo.value = lang;
  if (combo.value !== lang) {
    if (attemptsLeft <= 0) return;
    window.setTimeout(() => applyToWidget(lang, attemptsLeft - 1), 250);
    return;
  }
  fireChange(combo);
}

export function translateTo(lang: string) {
  setCookie(GOOGTRANS_COOKIE, `/en/${lang}`);
  applyToWidget(lang);
}

// Clears the cookie only — no reload. Header's EN/JA items call this right
// before their own <a href> navigates, so the browser's normal full page
// load (these are plain anchors, not next/link) lands on a fresh page with
// no stale translation cookie. Unwinding Google's in-place DOM rewrites via
// the widget API is unreliable, so a real navigation is the robust way back
// to untranslated content rather than trying to undo them in place.
export function clearGoogleTranslateCookie() {
  clearCookie(GOOGTRANS_COOKIE);
}
