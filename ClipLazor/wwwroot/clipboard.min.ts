// Check if the browser supports clipboard functionality
export function isClipboardSupported(): boolean {
    return !!navigator.clipboard;
}


// Check if the browser has permission to write to the clipboard
export async function hasClipboardPermission(command: PermissionName): Promise<boolean> {
    try {
        const permissionStatus = await navigator.permissions.query({ name: command });
        return permissionStatus.state === 'granted';
    } catch (error) {
        console.error(`Error checking ${command} permission:`, error);
        return false;
    }
}

// Copy a text string to the clipboard
export async function copyToClipboard(text: string): Promise<boolean> {

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error("Error copying to clipboard:", error);
        return false;
    }
}

// Paste text from the clipboard
export async function pasteFromClipboard(): Promise<string | null> {

    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (error) {
        console.error("Error pasting from clipboard:", error);
        return null;
    }
}
