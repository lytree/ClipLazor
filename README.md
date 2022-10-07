# ClipLazor
Clipboard API Interop for blazor.

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
3.Add this script tag in your root html file (Likely _Host.cshtml for Blazor Server Apps or index.html for Blazor WebAssembly Apps), right under the framework script tag. (i.e `<script src="_framework/blazor.server.js"></script>` for Blazor Server Apps or `<script src="_framework/blazor.webassembly.js"></script>` for Blazor WebAssembly Apps):

  ```html
  <script src="_content/ClipLazor/Clipboard.js"></script>
  ```
  
## Usage
1. After ClipLazor installation now you can inject it:

  ```razor
  @inject IClipLazor clipboard
    
  <input @bind="text" />
  <button @onclick="(async c => await Copy()))">Copy To Clipboard</button>

   @code
   {
       string text = string.Empty;
       
       async void Copy()
       {
          if(text.Length > 0){
            var response = await clipboard.CopyAsync(text);
       }
   }
   
   ```
    
    
    
 
