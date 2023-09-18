// Check if the browser supports clipboard functionality
export function isClipboardSupported(): boolean {
    return !!navigator.clipboard;
}