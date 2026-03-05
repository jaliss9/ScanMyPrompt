/**
 * Copy text to clipboard with automatic fallback.
 * 1. Try the modern Clipboard API (requires secure context + focus)
 * 2. Fallback to execCommand('copy') via a temporary textarea
 *
 * Returns true if the copy was attempted successfully.
 * Note: execCommand is deprecated and may return false even when the copy
 * actually worked, so we return true optimistically after calling it.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard API failed (no focus, HTTP, iframe…) — fall through to legacy
    }
  }

  // Legacy fallback: hidden textarea + execCommand
  return copyViaExecCommand(text);
}

function copyViaExecCommand(text: string): boolean {
  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Place off-screen so it's invisible but still selectable
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);

  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    document.execCommand('copy');
    // execCommand is deprecated and returns false in many modern browsers
    // even when the copy actually succeeds. Return true optimistically
    // since we selected the text and invoked the command without error.
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
