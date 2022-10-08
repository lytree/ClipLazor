# ClipLazor
Clipboard API Interop for blazor.


![alt text](https://github.com/p6laris/ClipLazor/blob/master/ClipboardLazor.png?raw=true)

## Installation
1. Install [ClipLazor](https://www.nuget.org/packages/ClipLazor) from the nuget package manager in your Blazor app.

  ```sh
  Install-package ClipLazor
  ```
2. Add the service to the IoC container using `AddClipboard` method:

  ```C#
  using ClipLazor.Extention;

  builder.Service.AddClipboard();
  ```
3.Add this script tag in your root html file _Host.cshtml for Blazor Server Apps or index.html for Blazor WebAssembly Apps:
  ```html
  <script src="_content/ClipLazor/clipboard.min.js"></script>
  ```
  
## Usage
1. After ClipLazor installation now you can inject it:

  ```razor
  @inject ClipLazor clipboard
  @using ClipLazor.Components;
   
   ```
2. As you injected the ClipLazor you can copy a text to the clipboard by calling `CopyAsync` method
   and `ReadAsync` to paste a text from the clipbaord:
   
   > :warning: **Pass the text argument for CopyAsync method as ReadOnlyMemory.**
  
  ```razor
  <input @bind="text" />
  <button @onclick="(async c => await Copy()))">Copy</button>
  <button @onclikc="(async c => await Paste())">Paste</button>
   @code
   {
       string text = string.Empty;
       
       async void Copy()
       {
          if(text.Length > 0){
            var response = await clipboard.CopyAsync(text.AsMemory());
       }
       async void Paste(){
       text = await clipboard.ReadAsync();
   }
   ```
 ## License
 [MIT](https://github.com/p6laris/ClipLazor/blob/master/README.md)
    
    
    
 
