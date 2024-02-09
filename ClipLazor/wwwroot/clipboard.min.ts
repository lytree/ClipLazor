namespace ClipLazor{
    interface IClipboardFunctionality{
        isClipboardSupported() : boolean;
        hasClipboardPermission(command : PermissionName) : Promise<boolean>;
        copyToClipboard(text: string): Promise<boolean>;
        pasteFromClipboard(): Promise<string | null>;
        copyDataToClipboard(data: Uint8Array, mimeType: string): Promise<boolean>;
        readDataFromClipboard(mimeType: string): Promise<Uint8Array | null>;
        
    }
    
    class Clipboard implements IClipboardFunctionality{
        /**
         * Checks if the Clipboard API is supported in the current browser.
         *
         * @returns {boolean} `true` if the Clipboard API is supported, otherwise `false`.
         */
            isClipboardSupported(): boolean {
            return !!navigator.clipboard;
        }

        /**
         * Checks if the browser has permission to write to the clipboard.
         *
         * @param {PermissionName} command - The permission name to check (e.g., 'clipboard-write').
         * @returns {Promise<boolean>} A Promise that resolves to `true` if the permission is granted, otherwise `false`.
         */
          async hasClipboardPermission(command: PermissionName): Promise<boolean> {
            try {
                const permissionStatus = await navigator.permissions.query({ name: command });
                return permissionStatus.state === 'granted';
            } catch (error) {
                console.error(`Error checking ${command} permission:`, error);
                return false;
            }
        }

        /**
         * Copies the given text to the clipboard.
         *
         * @param {string} text - The text to be copied to the clipboard.
         * @returns {Promise<boolean>} A Promise that resolves to `true` if the copy operation is successful, otherwise `false`.
         */
          async copyToClipboard(text: string): Promise<boolean> {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (error) {
                console.error("Error copying to clipboard:", error);
                return false;
            }
        }

        /**
         * Reads text data from the clipboard.
         *
         * @returns {Promise<string | null>} A Promise that resolves to the copied text if successful, otherwise `null`.
         */
          async pasteFromClipboard(): Promise<string | null> {
            try {
                const text = await navigator.clipboard.readText();
                return text;
            } catch (error) {
                console.error("Error pasting from clipboard:", error);
                return null;
            }
        }

        /**
         * Copies binary data (e.g., Uint8Array) to the clipboard with a specified MIME type.
         *
         * @param {Uint8Array} data - The binary data to be copied to the clipboard.
         * @param {string} mimeType - The MIME type of the data.
         * @returns {Promise<boolean>} A Promise that resolves to `true` if the copy operation is successful, otherwise `false`.
         */
          async copyDataToClipboard(data: Uint8Array, mimeType: string): Promise<boolean> {
            try {
                const blob = new Blob([data], { type: mimeType });
                await navigator.clipboard.write([new ClipboardItem({ [mimeType]: blob })]);
                return true;
            } catch (error) {
                console.error("Error copying data to clipboard:", error);
                return false;
            }
        }

        /**
         * Reads binary data (e.g., Uint8Array) from the clipboard with a specified MIME type.
         *
         * @param {string} mimeType - The MIME type of the data to read.
         * @returns {Promise<Uint8Array | null>} A Promise that resolves to the binary data if found, otherwise `null`.
         */
          async readDataFromClipboard(mimeType: string): Promise<Uint8Array | null> {
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
    }
    export function Load(): void {
        window['clipLazor'] = new Clipboard();

    }
}

ClipLazor.Load();

