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