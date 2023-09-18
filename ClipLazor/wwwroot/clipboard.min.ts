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

// Copy binary data (Uint8Array) to the clipboard with a specified MIME type
export async function copyDataToClipboard(data: Uint8Array, mimeType: string): Promise<boolean> {
    try {
        const blob = new Blob([data], { type: mimeType });
        await navigator.clipboard.write([new ClipboardItem({ [mimeType]: blob })]);
        return true;
    } catch (error) {
        console.error("Error copying data to clipboard:", error);
        return false;
    }
}

// Read binary data (Uint8Array) from the clipboard with a specified MIME type
export async function readDataFromClipboard(mimeType: string): Promise<Uint8Array | null> {
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
            for (const type of item.types) {
                if (type === mimeType) {
                    const blob = await item.getType(type);
                    if (blob instanceof Blob) {
                        const arrayBuffer = await blob.arrayBuffer();
                        return new Uint8Array(arrayBuffer);
                    }
                }
            }
        }
        return null; // Data with the specified mimeType not found in clipboard
    } catch (error) {
        console.error("Error reading data from clipboard:", error);
        return null;
    }
}