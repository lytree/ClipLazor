using ClipLazor.Enums;
using Microsoft.JSInterop;

namespace ClipLazor.Components
{
    /// <summary>
    /// An implementation of the <see cref="IClipLazor"/> interface for interacting with the Clipboard API.
    /// </summary>
    public class ClipLazor : IClipLazor
    {
        private IJSRuntime JSRuntime;

        /// <summary>
        /// Creates a new instance of the <see cref="ClipLazor"/> class.
        /// </summary>
        /// <param name="JSRuntime">The JSRuntime instance for JavaScript Interop.</param>
        /// <exception cref="ArgumentNullException">Throws if the JSRuntime parameter is null.</exception>
        public ClipLazor(IJSRuntime JSRuntime)
        {
            this.JSRuntime = JSRuntime ?? throw new ArgumentNullException(nameof(JSRuntime));
        }

        /// <summary>
        /// Checks if the Clipboard API is supported in the current browser.
        /// </summary>
        /// <returns>True if the Clipboard API is supported; otherwise, false.</returns>
        public async ValueTask<bool> IsClipboardSupported() => await JSRuntime.InvokeAsync<bool>("isClipboardSupported");

        /// <summary>
        /// Checks if the browser has permission to perform a specific clipboard operation.
        /// </summary>
        /// <param name="command">The clipboard permission command (e.g., PermissionCommand.Write or PermissionCommand.Read).</param>
        /// <returns>True if permission is granted; otherwise, false.</returns>
        public async ValueTask<bool> IsPermitted(PermissionCommand command)
        {
            var response = (command == PermissionCommand.Write) ?
                 await JSRuntime.InvokeAsync<bool>("hasClipboardPermission", "clipboard-write") :
                 await JSRuntime.InvokeAsync<bool>("hasClipboardPermission", "clipboard-read");
            return response;
            var response = await JSRuntime.InvokeAsync<object>("copyClipboard.copyText", text.ToString());
            return response.ToString();

        }

        /// <summary>
        /// Copies text to the clipboard.
        /// </summary>
        /// <param name="text">The text to copy to the clipboard.</param>
        /// <returns>True if the copy operation is successful; otherwise, false.</returns>
        public async ValueTask<bool> WriteTextAsync(ReadOnlyMemory<char> text) => await JSRuntime.InvokeAsync<bool>("copyToClipboard", text.ToString());

        /// <summary>
        /// Reads text from the clipboard.
        /// </summary>
        /// <returns>The read text from the clipboard.</returns>
        public async ValueTask<string> ReadTextAsync() => await JSRuntime.InvokeAsync<string>("pasteFromClipboard");

        /// <summary>
        /// Copies binary data to the clipboard with a specified MIME type.
        /// </summary>
        /// <param name="data">The binary data to copy to the clipboard.</param>
        /// <param name="mimeType">The MIME type of the data (default is "text/plain").</param>
        /// <returns>True if the copy operation is successful; otherwise, false.</returns>
        public async ValueTask<bool> WriteDataAsync(ReadOnlyMemory<byte> data, string mimeType = "text/plain") => await JSRuntime.InvokeAsync<bool>("copyDataToClipboard", data.ToArray(), mimeType);

        /// <summary>
        /// Reads binary data from the clipboard with a specified MIME type.
        /// </summary>
        /// <param name="mimeType">The MIME type of the data to read (default is "text/plain").</param>
        /// <returns>The read binary data from the clipboard.</returns>
        public async ValueTask<Memory<byte>> ReadDataAsync(string mimeType = "text/plain")
        {
            return await JSRuntime.InvokeAsync<byte[]>("readDataFromClipboard", mimeType);
        }
    }
}
