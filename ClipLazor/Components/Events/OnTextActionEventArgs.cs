namespace ClipLazor.Components;

/// <summary>
/// Event arguments for clipboard action events.
/// </summary>
public class OnTextActionEventArgs : EventArgs
{
    /// <summary>
    /// Gets or sets the clipboard action performed.
    /// </summary>
    public ClipboardAction Action { get; set; }

    /// <summary>
    /// Gets or sets the text involved in the clipboard action.
    /// </summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether the clipboard action was successful.
    /// </summary>
    public bool IsSuccess { get; set; }
}
