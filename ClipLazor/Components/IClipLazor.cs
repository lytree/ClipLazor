﻿using ClipLazor.Enums;

namespace ClipLazor.Components
{
    /// <summary>
    /// An abstraction for the Clipboard API
    /// </summary>
    public interface IClipLazor
    {
        /// <summary>
        /// Gets a text and copy it to the clipboard.
        /// </summary>
        /// <param name="text"> The <see cref="System.ReadOnlyMemory{Char}"></see> text to copy to the clipboard</param>
        /// <returns><see cref="System.String"></see> of the response</returns>
        ValueTask<bool> WriteTextAsync(ReadOnlyMemory<char> text);

        /// <summary>
        /// Read a text from the clipboard.
        /// </summary>
        /// <returns><see cref="System.String"></see> of the readed text.</returns>
        ValueTask<string> ReadTextAsync();

        ValueTask<bool> IsClipboardSupported();

        ValueTask<bool> IsPermitted(PermissionCommand command);

        ValueTask<bool> WriteDataAsync(ReadOnlyMemory<byte> data, string mimeType);
        ValueTask<Memory<byte>> ReadDataAsync(string mimeType);
    }
}
