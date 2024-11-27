namespace ClipLazor {
    class Clipboard {

        private readonly isChromium: boolean;
        constructor() {
            // Check for Chromium-based browser
            const userAgentData = (navigator as any).userAgentData;
            this.isChromium = !!userAgentData && userAgentData.brands.some(data => data.brand == 'Chromium');
        }
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
         * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#security_considerations
         * 
         *
         * @param {PermissionName} command - The permission name to check (e.g., 'clipboard-write').
         * @returns {Promise<boolean>} A Promise that resolves to `true` if the permission is granted, otherwise `false`.
         */
        async hasClipboardPermission(command: PermissionName): Promise<boolean> {
            if (this.isChromium) {
                try {
                    const permissionStatus = await navigator.permissions.query({ name: command });
                    return permissionStatus.state === 'granted';
                } catch (error) {
                    console.error(`Error checking ${command} permission:`, error);
                    return false;
                }
            }
            return true;
        }

        /**
         * Copies the given text to the clipboard.
         *
         * @param {string} text - The text to be copied to the clipboard.
         * @returns {Promise<boolean>} A Promise that resolves to `true` if the copy operation is successful, otherwise `false`.
         */
        async copyToClipboard(text: string): Promise<boolean> {
            if(this.isClipboardSupported()){
                try {
                    await navigator.clipboard.writeText(text);
                    return true;
                } catch (error) {
                    console.error("Error copying to clipboard:", error);
                    return false;
                }
            }
            else {
                this.commandCopy(text);
                return true;
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
        
        /**
         * Attaches a clipboard action (copy or cut) to a target HTML element.
         *
         * @param targetId - The ID of the target HTML element on which the clipboard action is to be performed.
         * @param action - The clipboard action to perform, either 'copy' or 'cut'.
         * @param dotNet - A .NET object reference used to invoke callback methods in Blazor.
         * @returns A promise that resolves when the clipboard action and associated callback invocation are complete.
         */
        async attachClipboardAction(targetId: string, action: 'copy' | 'cut', dotNet): Promise<void> {
            const targetElement = document.getElementById(targetId) as HTMLElement;
            
            if (!targetElement ){
                await dotNet.invokeMethodAsync('OnTextActionCallback', "", action, false);
                return;
            }
            
            if(!this.isTextContentElement(targetElement)){
                await dotNet.invokeMethodAsync('OnTextActionCallback', "", action, false);
                return;
            }
                
            const value = this.getElementContent(targetElement as HTMLElement);
            const success = await this.copyToClipboard(value);

            if (success && action === 'cut') {
                this.clearElementContent(targetElement as HTMLElement);
            }
            
            await dotNet.invokeMethodAsync('OnTextActionCallback', value, action, true);
        }
        private getElementContent(element: HTMLElement): string {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                return element.value;
            } else {
                return element.innerText;
            }
        }

        private clearElementContent(element: HTMLElement): void {
            if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                element.value = '';
            } else {
                element.innerText = '';
            }
        }
        private isTextContentElement(element: HTMLElement): boolean {
            return (
                element instanceof HTMLInputElement ||
                element instanceof HTMLTextAreaElement ||
                element!.isContentEditable || // For editable divs
                element instanceof HTMLHeadingElement ||
                element instanceof HTMLParagraphElement ||
                element instanceof HTMLSpanElement
            );
        }
        private dataURLToUint8Array(dataUrl: string): Uint8Array {
            const base64 = dataUrl.split(',')[1];
            const binary = atob(base64);
            const length = binary.length;
            const buffer = new Uint8Array(length);
            for (let i = 0; i < length; i++) {
                buffer[i] = binary.charCodeAt(i);
            }
            return buffer;
        }
        private commandCopy(value: string) {
            const ta = document.createElement('textarea')
            ta.value = value ?? ''
            ta.style.position = 'absolute'
            ta.style.opacity = '0'
            document.body.appendChild(ta)
            ta.select()
            document.execCommand('copy')
            ta.remove()
        }
    }
    
    export function Load(): void {
        window['clipLazor'] = new Clipboard();
    }
}

ClipLazor.Load();

