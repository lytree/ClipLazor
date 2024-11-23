
namespace ClipLazor.Components
{
    /// <summary>
    /// An abstraction for the Clipboard API.
    /// </summary>
    public interface IClipLazor
    {
        /// <summary>
        /// Checks if the Clipboard API is supported in the current environment.
        /// </summary>
        /// <returns>True if the Clipboard API is supported; otherwise, false.</returns>
        ValueTask<bool> IsClipboardSupported();

        /// <summary>
        /// Checks if the browser has permission to perform a specific clipboard operation.
        /// </summary>
        /// <param name="command">The clipboard permission command (e.g., PermissionCommand.Write or PermissionCommand.Read).</param>
        /// <returns>True if permission is granted; otherwise, false.</returns>
        ValueTask<bool> IsPermitted(PermissionCommand command);

        /// <summary>
        /// Copies text to the clipboard.
        /// </summary>
        /// <param name="text">The text to copy to the clipboard.</param>
        /// <returns>True if the copy operation is successful; otherwise, false.</returns>
        ValueTask<bool> WriteTextAsync(ReadOnlyMemory<char> text);

        /// <summary>
        /// Reads text from the clipboard.
        /// </summary>
        /// <returns>The read text from the clipboard.</returns>
        ValueTask<string> ReadTextAsync();

        /// <summary>
        /// Copies binary data to the clipboard with a specified MIME type.
        /// </summary>
        /// <param name="data">The binary data to copy to the clipboard.</param>
        /// <param name="mimeType">The MIME type of the data (default is "text/plain").</param>
        /// <returns>True if the copy operation is successful; otherwise, false.</returns>
        ValueTask<bool> WriteDataAsync(ReadOnlyMemory<byte> data, string mimeType = "text/plain");

        /// <summary>
        /// Reads binary data from the clipboard with a specified MIME type.
        /// </summary>
        /// <param name="mimeType">The MIME type of the data to read (default is "text/plain").</param>
        /// <returns>The read binary data from the clipboard.</returns>
        ValueTask<ReadOnlyMemory<byte>> ReadDataAsync(string mimeType = "text/plain");
    }
}
